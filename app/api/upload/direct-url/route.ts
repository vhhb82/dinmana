// app/api/upload/direct-url/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs' // pe Vercel avem nevoie de runtime node pentru fs

type CloudflareDirectUploadResponse = {
  result?: { id: string; uploadURL: string }
  success?: boolean
  errors?: Array<{ message: string }>
}

function resolveServiceAccount(): string {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (inline && inline.trim().length > 0) return inline

  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!filePath) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS')
  }

  const candidates = new Set<string>([filePath])

  if (filePath.startsWith('./')) {
    const trimmed = filePath.slice(2)
    candidates.add(trimmed)
    candidates.add(path.join('server', trimmed))
  }

  candidates.add(path.join('server', filePath))

  for (const candidate of candidates) {
    const absolute = path.isAbsolute(candidate) ? candidate : path.resolve(process.cwd(), candidate)
    if (existsSync(absolute)) {
      return readFileSync(absolute, 'utf-8')
    }
  }
  throw new Error(`Unable to load Firebase service account from ${filePath}`)
}

function ensureFirebase() {
  if (getApps().length) return
  const json = resolveServiceAccount()
  const serviceAccount = JSON.parse(json)
  initializeApp({
    credential: cert(serviceAccount),
  })
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  const ALLOWED = [
    'http://localhost:3000',
    'https://dinmana.vercel.app',
    process.env.CLIENT_ORIGIN, // dacă o setezi
  ].filter(Boolean) as string[]
  return ALLOWED.some((o) => o === origin)
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (!isOriginAllowed(origin)) {
    return new NextResponse(null, { status: 204 })
  }
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin!,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin')
    if (!isOriginAllowed(origin)) {
      return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
    }

    ensureFirebase()
    const authHeader = req.headers.get('authorization') || ''
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!idToken) {
      return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 })
    }
    await getAuth().verifyIdToken(idToken)

    const accountId = process.env.CF_ACCOUNT_ID
    const imagesToken = process.env.CF_IMAGES_TOKEN
    if (!accountId || !imagesToken) {
      return NextResponse.json({ error: 'Cloudflare credentials missing' }, { status: 500 })
    }

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${imagesToken}`,
      },
    })

    const json = (await res.json()) as CloudflareDirectUploadResponse
    if (!res.ok || !json?.success || !json?.result?.uploadURL) {
      return NextResponse.json(
        { error: 'Cloudflare direct upload failed', details: json?.errors ?? null },
        { status: 502 }
      )
    }

    return new NextResponse(JSON.stringify({ uploadURL: json.result.uploadURL }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin!,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
