import admin from 'firebase-admin'
import type { Request, Response, NextFunction } from 'express'
import { ENV } from '../env'

if (!admin.apps.length) {
  const credentials = JSON.parse(ENV.FIREBASE_SERVICE_ACCOUNT_JSON)
  admin.initializeApp({ credential: admin.credential.cert(credentials) })
}

export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) {
      return res.status(401).json({ error: 'Missing Bearer token' })
    }

    const decoded = await admin.auth().verifyIdToken(token)
    ;(req as any).user = { uid: decoded.uid, email: decoded.email }
    next()
  } catch (error: any) {
    return res.status(401).json({ error: 'Invalid token', details: error.message })
  }
}
