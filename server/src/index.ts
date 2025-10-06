import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { ENV } from './env'
import { connectDB } from './db'
import { ads } from './routes/ads'
import { upload } from './routes/upload'
import { chat } from './routes/chat'
import { verifyFirebaseToken } from './middleware/auth'
import { Message } from './models/Message'

async function main() {
  await connectDB()

  const allowedOrigins = ENV.CLIENT_ORIGINS
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  })

  app.use(cors({ origin: allowedOrigins, credentials: true }))
  app.use(express.json({ limit: '5mb' }))
  app.use(morgan('dev'))

  app.get('/health', (_req, res) => res.json({ ok: true }))

  app.use('/api/ads', ads)
  app.use('/api/upload', verifyFirebaseToken, upload)
  app.use('/api/chat', verifyFirebaseToken, chat)
  app.post('/api/ads', verifyFirebaseToken, (req, res, next) => (ads as any).handle(req, res, next))

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      return next(new Error('Missing token'))
    }
    // Token-ul poate fi validat aici cu Admin SDK daca extinzi logica
    return next()
  })

  io.on('connection', (socket) => {
    socket.on('identify', (uid: string) => {
      socket.join(uid)
    })

    socket.on('chat:send', async (payload: { from: string; to: string; text: string; adId?: string }) => {
      const message = await Message.create({ ...payload, ts: new Date() })
      io.to(payload.to).emit('chat:recv', message)
      io.to(payload.from).emit('chat:delivered', message)
    })
  })

  httpServer.listen(ENV.PORT, () => {
    console.log(`API server running on port ${ENV.PORT}`)
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
