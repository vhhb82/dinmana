import mongoose, { Schema, model } from 'mongoose'

const MessageSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
  adId: { type: String },
  ts: { type: Date, default: Date.now },
}, { timestamps: true })

MessageSchema.index({ from: 1, to: 1, ts: -1 })

export const Message = mongoose.models.Message || model('Message', MessageSchema)
