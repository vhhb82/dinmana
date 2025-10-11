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

export const FILTER_CATEGORIES = [
  'Toate',
  'Auto',
  'Imobiliare',
  'Electronice',
  'Casa & gradina',
  'Joburi & servicii',
  'Agricultura',
] as const

const SORT_OPTIONS: Array<{ value: FilterState['sort']; label: string }> = [
  { value: 'recente', label: 'Recente' },
  { value: 'pret_cresc', label: 'Pret crescator' },
  { value: 'pret_desc', label: 'Pret descrescator' },
]

export function FilterBar({ value, onChange }: { value: FilterState; onChange: (next: FilterState) => void }) {
  const formId = useId()
  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch })

  return (
    <form
      className="grid gap-3 md:grid-cols-6"
      aria-labelledby={`${formId}-title`}
      onSubmit={(event) => event.preventDefault()}
    >
      <span id={`${formId}-title`} className="sr-only">
        Filtre anunturi
      </span>
      <input
        className="input md:col-span-2"
        placeholder="Cauta..."
        value={value.q}
        onChange={(event) => update({ q: event.target.value })}
        aria-label="Cauta anunt"
      />
      <input
        className="input"
        placeholder="Oras"
        value={value.city}
        onChange={(event) => update({ city: event.target.value })}
        aria-label="Oras"
      />
      <select
        className="input"
        value={value.category}
        onChange={(event) => update({ category: event.target.value })}
        aria-label="Categorie"
      >
        {FILTER_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category === 'Toate' ? 'Toate categoriile' : category}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Min"
          value={value.priceMin}
          onChange={(event) => update({ priceMin: event.target.value })}
          aria-label="Pret minim"
          inputMode="numeric"
        />
        <input
          className="input"
          placeholder="Max"
          value={value.priceMax}
          onChange={(event) => update({ priceMax: event.target.value })}
          aria-label="Pret maxim"
          inputMode="numeric"
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
