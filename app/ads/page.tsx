'use client'

import { useMemo, useState } from 'react'
import { FilterBar, type FilterState } from '@/components/FilterBar'
import { AdCard } from '@/components/AdCard'
import { ADS } from '@/lib/mockAds'

export default function AdsPage() {
  const [filters, setFilters] = useState<FilterState>({
    q: '',
    city: '',
    category: 'Toate',
    priceMin: '',
    priceMax: '',
    sort: 'recente',
  })

  const results = useMemo(() => {
    let list = [...ADS]

    if (filters.q) {
      const q = filters.q.toLowerCase()
      list = list.filter((ad) => ad.title.toLowerCase().includes(q))
    }

    if (filters.city) {
      const c = filters.city.toLowerCase()
      list = list.filter((ad) => ad.city.toLowerCase().includes(c))
    }

    if (filters.category && filters.category !== 'Toate') {
      list = list.filter((ad) => ad.category === filters.category)
    }

    const min = filters.priceMin ? Number(filters.priceMin) : undefined
    const max = filters.priceMax ? Number(filters.priceMax) : undefined
    list = list.filter((ad) => (min === undefined || ad.price >= min) && (max === undefined || ad.price <= max))

    if (filters.sort === 'pret_cresc') {
      list.sort((a, b) => a.price - b.price)
    }
    if (filters.sort === 'pret_desc') {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  }, [filters])

  return (
    <main className="container-xl py-8 lg:py-10">
      <h1 className="text-2xl font-bold">Toate anunțurile</h1>
      <p className="text-neutral-600 mt-1">Filtrează după oraș, categorie, preț sau caută direct după titlu.</p>

      <div className="mt-5 card p-3 sm:p-4 lg:p-5">
        <FilterBar value={filters} onChange={setFilters} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-8 text-center text-neutral-500">Niciun rezultat. Ajustează filtrele.</div>
      )}
    </main>
  )
}
