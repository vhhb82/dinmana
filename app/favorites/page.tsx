'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { AdCard } from '@/components/AdCard'
import { fetchAd, type AdRecord } from '@/lib/api'

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [ads, setAds] = useState<AdRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const key = `fav_${user?.uid ?? 'guest'}`
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]') as string[]
      setFavoriteIds(Array.isArray(stored) ? stored : [])
    } catch (err) {
      console.error('Favorites load error', err)
      setFavoriteIds([])
    }
  }, [user?.uid])

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setAds([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    Promise.allSettled(favoriteIds.map((id) => fetchAd(id, { signal: controller.signal })))
      .then((results) => {
        if (controller.signal.aborted) return

        const successful = results.filter((item): item is PromiseFulfilledResult<AdRecord> => item.status === 'fulfilled')
        const failed = results.length - successful.length

        const map = new Map(successful.map((item) => [item.value._id ?? item.value.id, item.value] as const))
        const ordered = favoriteIds.map((id) => map.get(id)).filter((value): value is AdRecord => Boolean(value))

        setAds(ordered)
        setLoading(false)

        if (failed > 0) {
          setError('Unele anunturi nu au mai fost gasite.')
          const remainingIds = favoriteIds.filter((id) => map.has(id))
          setFavoriteIds(remainingIds)
          const storageKey = `fav_${user?.uid ?? 'guest'}`
          try {
            localStorage.setItem(storageKey, JSON.stringify(remainingIds))
          } catch (storageError) {
            console.error('Favorites cleanup error', storageError)
          }
        }
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        const message = err instanceof Error ? err.message : 'Nu am putut incarca anunturile favorite.'
        setError(message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [favoriteIds, user?.uid])

  const favoriteCount = useMemo(() => ads.length, [ads])

  return (
    <main className="container-xl py-8 lg:py-10">
      <h1 className="text-2xl font-bold">Favorite</h1>
      {loading && <p className="mt-4 text-neutral-600">Incarcam anunturile tale favorite...</p>}
      {error && !loading && <p className="mt-4 text-red-600">{error}</p>}

      {!loading && favoriteCount === 0 && (
        <p className="mt-6 text-neutral-600">Nu ai inca anunturi la favorite.</p>
      )}

      {favoriteCount > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <AdCard key={ad._id ?? ad.id ?? ad.image} ad={ad} />
          ))}
        </div>
      )}
    </main>
  )
}
