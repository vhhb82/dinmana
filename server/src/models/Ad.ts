import mongoose, { Schema, model } from 'mongoose'

const AdSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  ownerId: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
}, { timestamps: true })

AdSchema.index({ title: 'text', description: 'text' })
AdSchema.index({ city: 1, category: 1, price: 1 })

export const Ad = mongoose.models.Ad || model('Ad', AdSchema)
