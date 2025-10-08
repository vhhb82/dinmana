import { Router } from 'express'
import { z } from 'zod'
import type { SortOrder } from 'mongoose'
import { Ad } from '../models/Ad.js'

export const ads = Router()

const CreateAd = z.object({
  title: z.string().min(6),
  price: z.number().nonnegative(),
  city: z.string().min(2),
  category: z.string().min(2),
  description: z.string().optional().default(''),
  image: z.string().url(),
  images: z.array(z.string().url()).optional().default([]),
})

ads.get('/', async (req, res) => {
  const { q, city, category, min, max, sort } = req.query as Record<string, string>
  const filter: Record<string, unknown> = {}

  if (q) filter.$text = { $search: q }
  if (city) filter.city = new RegExp(city, 'i')
  if (category) filter.category = category
  if (min || max) {
    filter.price = {
      ...(min ? { $gte: Number(min) } : {}),
      ...(max ? { $lte: Number(max) } : {}),
    }
  }

  const order: Record<string, SortOrder> =
    sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { createdAt: -1 }

  const items = await Ad.find(filter).sort(order).limit(60)
  res.json(items)
})

ads.get('/:id', async (req, res) => {
  const item = await Ad.findById(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

ads.post('/', async (req, res) => {
  try {
    const parsed = CreateAd.parse(req.body)
    const ownerId = (req as any).user?.uid ?? 'anonymous'
    const item = await Ad.create({ ...parsed, ownerId })
    res.json(item)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})
