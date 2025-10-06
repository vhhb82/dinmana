import 'dotenv/config'
import { readFileSync } from 'node:fs'

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable ${name}`)
  }
  return value
}

function parseClientOrigins() {
  const raw = requireEnv('CLIENT_ORIGIN')
  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (origins.length === 0) {
    throw new Error('CLIENT_ORIGIN must contain at least one origin')
  }

  return origins
}

function resolveFirebaseServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (inline) {
    return inline
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!credentialsPath) {
    throw new Error('Missing environment variable FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS')
  }

  try {
    const raw = readFileSync(credentialsPath, 'utf-8').trim()
    if (!raw) {
      throw new Error('File is empty')
    }
    JSON.parse(raw)
    return raw
  } catch (error: any) {
    const message = error?.message ?? String(error)
    throw new Error(`Unable to load Firebase service account from ${credentialsPath}: ${message}`)
  }
}

const CLIENT_ORIGINS = parseClientOrigins()

export const ENV = {
  PORT: Number(process.env.PORT ?? 8080),
  MONGODB_URI: requireEnv('MONGODB_URI'),
  CLIENT_ORIGIN: CLIENT_ORIGINS[0],
  CLIENT_ORIGINS,
  FIREBASE_SERVICE_ACCOUNT_JSON: resolveFirebaseServiceAccount(),
  CF_ACCOUNT_ID: requireEnv('CF_ACCOUNT_ID'),
  CF_IMAGES_TOKEN: requireEnv('CF_IMAGES_TOKEN'),
}
