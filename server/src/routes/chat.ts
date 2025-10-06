import { Router } from 'express'
import { Message } from '../models/Message'

export const chat = Router()

chat.get('/:peerId', async (req, res) => {
  const uid = (req as any).user?.uid
  const peer = req.params.peerId
  if (!uid) {
    return res.status(401).json({ error: 'Unauthenticated' })
  }
  const items = await Message.find({
    $or: [
      { from: uid, to: peer },
      { from: peer, to: uid },
    ],
  }).sort({ ts: 1 })
  res.json(items)
})

chat.post('/send', async (req, res) => {
  const uid = (req as any).user?.uid
  if (!uid) {
    return res.status(401).json({ error: 'Unauthenticated' })
  }

  const { to, text, adId } = req.body as { to?: string; text?: string; adId?: string }
  if (!to || !text) {
    return res.status(400).json({ error: 'to and text are required' })
  }

  const message = await Message.create({ from: uid, to, text, adId })
  res.json(message)
})
