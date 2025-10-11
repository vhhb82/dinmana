'use client'

import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { FILTER_CATEGORIES } from '@/components/FilterBar'

export function HeroSearch() {
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()

    const q = (formData.get('q') as string | null)?.trim() ?? ''
    const city = (formData.get('city') as string | null)?.trim() ?? ''
    const category = (formData.get('category') as string | null) ?? ''

    if (q) params.set('q', q)
    if (city) params.set('city', city)
    if (category && category !== 'Toate') params.set('category', category)

    const query = params.toString()
    router.push(query ? `/ads?${query}` : '/ads')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr,180px,140px,120px]">
      <input className="input" name="q" placeholder="Ce cauti? ex: iPhone, bicicleta, garsoniera" />
      <input className="input" name="city" placeholder="Oras" />
      <select className="input" name="category" defaultValue="Toate">
        {FILTER_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category === 'Toate' ? 'Toate categoriile' : category}
          </option>
        ))}
      </select>
      <button className="btn btn-primary" type="submit">
        Cauta
      </button>
    </form>
  )
}
