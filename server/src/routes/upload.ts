import { Router } from 'express'
import fetch from 'node-fetch'
import { ENV } from '../env.js'

type DirectUploadResponse = {
  result?: { id: string; uploadURL: string }
  success?: boolean
  errors?: Array<{ message?: string }>
}

export const upload = Router()

upload.post('/direct-url', async (_req, res) => {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ENV.CF_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ENV.CF_IMAGES_TOKEN}`,
        },
      },
    )

    const data = (await response.json().catch(() => null)) as DirectUploadResponse | null

    if (!response.ok || !data?.success || !data.result) {
      const status = response.status >= 400 ? response.status : 502
      const error = data?.errors?.[0]?.message ?? 'Cloudflare direct upload failed'
      return res.status(status).json({ error })
    }

    return res.json({ uploadURL: data.result.uploadURL, id: data.result.id })
  } catch (error: any) {
    return res.status(500).json({ error: 'Unable to create Cloudflare direct upload', details: error.message })
  }
})
