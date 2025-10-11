'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FilterBar, type FilterState } from '@/components/FilterBar'
import { AdCard } from '@/components/AdCard'
import { fetchAds, type AdRecord } from '@/lib/api'

const DEFAULT_FILTERS: FilterState = {
  q: '',
  city: '',
  category: 'Toate',
  priceMin: '',
  priceMax: '',
  sort: 'recente',
}

function parseFiltersFromSearch(params: ReturnType<typeof useSearchParams>): FilterState {
  if (!params) return DEFAULT_FILTERS

  const sortParam = params.get('sort')
  const sort: FilterState['sort'] =
    sortParam === 'price_asc' ? 'pret_cresc' : sortParam === 'price_desc' ? 'pret_desc' : 'recente'

  return {
    q: params.get('q') ?? '',
    city: params.get('city') ?? '',
    category: params.get('category') ?? 'Toate',
    priceMin: params.get('min') ?? '',
    priceMax: params.get('max') ?? '',
    sort,
  }
}

function filtersToSearchParams(filters: FilterState) {
  const params = new URLSearchParams()
  if (filters.q.trim()) params.set('q', filters.q.trim())
  if (filters.city.trim()) params.set('city', filters.city.trim())
  if (filters.category && filters.category !== 'Toate') params.set('category', filters.category)
  if (filters.priceMin.trim()) params.set('min', filters.priceMin.trim())
  if (filters.priceMax.trim()) params.set('max', filters.priceMax.trim())
  if (filters.sort === 'pret_cresc') params.set('sort', 'price_asc')
  if (filters.sort === 'pret_desc') params.set('sort', 'price_desc')
  return params
}

function filtersToApiParams(filters: FilterState) {
  const minNumber = filters.priceMin ? Number(filters.priceMin) : undefined
  const maxNumber = filters.priceMax ? Number(filters.priceMax) : undefined

  return {
    q: filters.q.trim() || undefined,
    city: filters.city.trim() || undefined,
    category: filters.category && filters.category !== 'Toate' ? filters.category : undefined,
    min: Number.isFinite(minNumber) ? minNumber : undefined,
    max: Number.isFinite(maxNumber) ? maxNumber : undefined,
    sort:
      filters.sort === 'pret_cresc'
        ? 'price_asc'
        : filters.sort === 'pret_desc'
          ? 'price_desc'
          : 'recent',
  } as const
}

function areFiltersEqual(a: FilterState, b: FilterState) {
  return (
    a.q === b.q &&
    a.city === b.city &&
    a.category === b.category &&
    a.priceMin === b.priceMin &&
    a.priceMax === b.priceMax &&
    a.sort === b.sort
  )
}

export default function AdsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(() => parseFiltersFromSearch(searchParams))
  const [ads, setAds] = useState<AdRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const next = parseFiltersFromSearch(searchParams)
    setFilters((prev) => (areFiltersEqual(prev, next) ? prev : next))
  }, [searchParams])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchAds(filtersToApiParams(filters), { signal: controller.signal })
      .then((data) => {
        setAds(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        const message = err instanceof Error ? err.message : 'Nu am putut incarca anunturile.'
        setError(message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [filters])

  const handleFilterChange = useCallback(
    (nextFilters: FilterState) => {
      setFilters(nextFilters)
      const params = filtersToSearchParams(nextFilters)
      const queryString = params.toString()
      router.replace(queryString ? `/ads?${queryString}` : '/ads', { scroll: false })
    },
    [router],
  )

  return (
    <main className="container-xl py-8 lg:py-10">
      <h1 className="text-2xl font-bold">Toate anunturile</h1>
      <p className="text-neutral-600 mt-1">
        Filtreaza dupa oras, categorie, pret sau cauta direct dupa titlu.
      </p>

      <div className="mt-5 card p-3 sm:p-4 lg:p-5">
        <FilterBar value={filters} onChange={handleFilterChange} />
      </div>

      {loading && <div className="mt-8 text-center text-neutral-500">Incarcam anunturile...</div>}

      {error && !loading && <div className="mt-8 text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <AdCard key={ad._id ?? ad.id ?? ad.image} ad={ad} />
            ))}
          </div>

          {ads.length === 0 && (
            <div className="mt-8 text-center text-neutral-500">Niciun rezultat. Ajusteaza filtrele.</div>
          )}
        </>
      )}
    </main>
  )
}
