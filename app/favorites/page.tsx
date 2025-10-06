'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { AdCard, type Ad } from '@/components/AdCard'
import { ADS } from '@/lib/mockAds'

export default function FavoritesPage() {
  const { user } = useAuth()
  const [localAds, setLocalAds] = useState<Ad[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dinmana_ads')
      setLocalAds(raw ? JSON.parse(raw) : [])
    } catch (error) {
      console.error('Local ads load error', error)
    }
  }, [])

  useEffect(() => {
    const key = `fav_${user?.uid ?? 'guest'}`
    try {
      const arr = JSON.parse(localStorage.getItem(key) || '[]') as string[]
      setFavoriteIds(arr)
    } catch (error) {
      console.error('Favorites load error', error)
    }
  }, [user?.uid])

  const allAds = useMemo(() => [...localAds, ...ADS], [localAds])
  const favoriteAds = allAds.filter((ad) => favoriteIds.includes(ad.id))

  return (
    <main className="container-xl py-8 lg:py-10">
      <h1 className="text-2xl font-bold">Favorite</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
      {favoriteAds.length === 0 && (
        <p className="mt-6 text-neutral-600">Nu ai încă anunțuri la favorite.</p>
      )}
    </main>
  )
}
