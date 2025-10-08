import { auth } from '@/lib/firebase'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://opportunity-cache-collections-outcomes.trycloudflare.com'

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

async function buildApiError(response: Response): Promise<ApiError> {
  const contentType = response.headers.get('content-type') ?? ''
  let details: unknown
  let message = `Cererea a esuat cu status ${response.status}`

  if (contentType.includes('application/json')) {
    details = await response.json().catch(() => undefined)
    const jsonMessage = (details as any)?.error ?? (details as any)?.message
    if (typeof jsonMessage === 'string' && jsonMessage.trim().length > 0) {
      message = jsonMessage
    }
  } else {
    const text = await response.text().catch(() => '')
    if (text) {
      details = text
      message = text
    }
  }

  return new ApiError(message, response.status, details)
}

async function getIdTokenOrThrow() {
  const current = auth.currentUser
  if (!current) {
    throw new ApiError('Trebuie sa fii autentificat pentru aceasta actiune.', 401)
  }

  return current.getIdToken()
}

async function authFetch(path: string, init: RequestInit = {}, tokenOverride?: string) {
  const token = tokenOverride ?? (await getIdTokenOrThrow())
  const headers = new Headers(init.headers ?? {})
  headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (!response.ok) {
    throw await buildApiError(response)
  }

  return response
}

type DirectUploadResponse = {
  uploadURL: string
  id: string
}

type CloudflareUploadResponse = {
  result?: { id: string; variants?: string[] }
  success?: boolean
  errors?: Array<{ message?: string }>
}

export type CloudflareUploadResult = {
  id: string
  publicUrl: string
  variants: string[]
}

export async function requestDirectUpload(): Promise<DirectUploadResponse> {
  const token = await getIdTokenOrThrow()

  const response = await authFetch('/api/upload/direct-url', { method: 'POST' }, token)
  return response.json()
}

export async function uploadImageToCloudflare(file: File): Promise<CloudflareUploadResult> {
  const { uploadURL } = await requestDirectUpload()
  const formData = new FormData()
  formData.append('file', file)

  const uploadResponse = await fetch(uploadURL, { method: 'POST', body: formData })
  const data = (await uploadResponse.json().catch(() => null)) as CloudflareUploadResponse | null

  if (!uploadResponse.ok || !data?.success || !data.result) {
    const message = data?.errors?.[0]?.message ?? 'Upload catre Cloudflare a esuat'
    throw new Error(message)
  }

  const variants = data.result.variants ?? []
  const publicUrl = variants[0]
  if (!publicUrl) {
    throw new Error('Cloudflare nu a returnat un URL public pentru imagine')
  }

  return { id: data.result.id, publicUrl, variants }
}

export type CreateAdPayload = {
  title: string
  price: number
  city: string
  category: string
  description?: string
  image: string
  images?: string[]
}

export async function createAd(payload: CreateAdPayload) {
  const response = await authFetch('/api/ads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return response.json()
}
