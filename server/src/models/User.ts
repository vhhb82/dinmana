import mongoose, { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  uid: { type: String, unique: true, index: true },
  email: { type: String },
  name: { type: String },
  avatar: { type: String },
}, { timestamps: true })

export const User = mongoose.models.User || model('User', UserSchema)
