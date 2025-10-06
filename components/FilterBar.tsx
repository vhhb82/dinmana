'use client'

import { useId } from 'react'

export type FilterState = {
  q: string
  city: string
  category: string
  priceMin: string
  priceMax: string
  sort: 'recente' | 'pret_cresc' | 'pret_desc'
}

const CATEGORIES = ['Toate', 'Auto', 'Imobiliare', 'Electronice', 'Casă & grădină', 'Joburi & servicii', 'Agricultură']

const SORT_OPTIONS: Array<{ value: FilterState['sort']; label: string }> = [
  { value: 'recente', label: 'Recente' },
  { value: 'pret_cresc', label: 'Preț ↑' },
  { value: 'pret_desc', label: 'Preț ↓' },
]

export function FilterBar({ value, onChange }: { value: FilterState; onChange: (next: FilterState) => void }) {
  const formId = useId()
  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch })

  return (
    <form className="grid gap-3 md:grid-cols-6" aria-labelledby={`${formId}-title`}>
      <span id={`${formId}-title`} className="sr-only">Filtre anunțuri</span>
      <input
        className="input md:col-span-2"
        placeholder="Caută..."
        value={value.q}
        onChange={(event) => update({ q: event.target.value })}
        aria-label="Caută anunț"
      />
      <input
        className="input"
        placeholder="Oraș"
        value={value.city}
        onChange={(event) => update({ city: event.target.value })}
        aria-label="Oraș"
      />
      <select
        className="input"
        value={value.category}
        onChange={(event) => update({ category: event.target.value })}
        aria-label="Categorie"
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Min"
          value={value.priceMin}
          onChange={(event) => update({ priceMin: event.target.value })}
          aria-label="Preț minim"
        />
        <input
          className="input"
          placeholder="Max"
          value={value.priceMax}
          onChange={(event) => update({ priceMax: event.target.value })}
          aria-label="Preț maxim"
        />
      </div>
      <select
        className="input"
        value={value.sort}
        onChange={(event) => update({ sort: event.target.value as FilterState['sort'] })}
        aria-label="Sortare"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  )
}
