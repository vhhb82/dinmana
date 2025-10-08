import mongoose from 'mongoose'
import { ENV } from './env.js'

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  await mongoose.connect(ENV.MONGODB_URI)
}
