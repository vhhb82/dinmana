'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'

type FavButtonProps = {
  adId: string
}

function getKey(userId?: string | null) {
  return `fav_${userId ?? 'guest'}`
}

export default function FavButton({ adId }: FavButtonProps) {
  const { user } = useAuth()
  const storageKey = getKey(user?.uid)
  const [active, setActive] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]') as string[]
      setActive(stored.includes(adId))
    } catch (error) {
      console.error('Favorite read error', error)
    }
  }, [storageKey, adId])

  const toggle = () => {
    try {
      const stored = new Set<string>(JSON.parse(localStorage.getItem(storageKey) || '[]'))
      if (stored.has(adId)) {
        stored.delete(adId)
        setActive(false)
      } else {
        stored.add(adId)
        setActive(true)
      }
      localStorage.setItem(storageKey, JSON.stringify(Array.from(stored)))
    } catch (error) {
      console.error('Favorite toggle error', error)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`btn btn-outline text-sm ${
        active ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-900 hover:text-white' : ''
      }`}
      aria-pressed={active}
    >
      {active ? 'In favorite' : 'Adauga la favorite'}
    </button>
  )
}
