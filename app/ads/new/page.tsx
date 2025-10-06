'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent, type ChangeEvent } from 'react'
import { uploadImageToCloudflare, createAd, ApiError } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'

const CATEGORIES = ['Auto', 'Imobiliare', 'Electronice', 'Casa & gradina', 'Joburi & servicii', 'Agricultura']

type FormState = {
  title: string
  price: string
  city: string
  category: string
  description: string
  images: string[]
}

type FormErrors = Partial<Record<keyof FormState, string>>

export default function NewAdPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState<FormState>({
    title: '',
    price: '',
    city: '',
    category: CATEGORIES[0],
    description: '',
    images: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!form.title || form.title.trim().length < 6) {
      nextErrors.title = 'Titlul trebuie sa aiba cel putin 6 caractere.'
    }
    const priceValue = Number(form.price)
    if (!form.price || Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = 'Introdu un pret pozitiv.'
    }
    if (!form.city.trim()) {
      nextErrors.city = 'Completeaza orasul.'
    }
    if (!form.category) {
      nextErrors.category = 'Selecteaza o categorie.'
    }
    if (!form.description || form.description.trim().length < 20) {
      nextErrors.description = 'Descrierea trebuie sa contina minim 20 de caractere.'
    }
    if (form.images.length === 0) {
      nextErrors.images = 'Adauga cel putin o imagine.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    if (!user) {
      setUploadError('Trebuie sa fii conectat pentru a incarca imagini.')
      event.target.value = ''
      return
    }

    setUploadError(null)
    setGlobalError(null)
    setIsUploading(true)

    try {
      for (const file of files) {
        const { publicUrl } = await uploadImageToCloudflare(file)
        setForm((prev) => ({ ...prev, images: [...prev.images, publicUrl] }))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nu am putut incarca imaginea.'
      setUploadError(message)
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== index) }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGlobalError(null)

    if (!validate()) return
    if (isUploading) {
      setGlobalError('Asteapta terminarea incarcarii imaginilor inainte de a trimite anuntul.')
      return
    }
    if (!user) {
      setGlobalError('Autentifica-te pentru a publica un anunt.')
      return
    }

    setIsSubmitting(true)

    try {
      const ad = await createAd({
        title: form.title.trim(),
        price: Number(form.price),
        city: form.city.trim(),
        category: form.category,
        description: form.description.trim(),
        image: form.images[0],
        images: form.images,
      })

      const adId = ad.id ?? ad._id
      router.push(adId ? `/ads/${adId}` : '/ads')
    } catch (error) {
      const message = error instanceof ApiError ? error.message : error instanceof Error ? error.message : 'Nu am putut salva anuntul.'
      setGlobalError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container-xl py-8 lg:py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Adauga anunt</h1>
        <Link href="/ads" className="text-primary">Inapoi la anunturi</Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 card p-4 sm:p-6">
        <label className="grid gap-2">
          <span className="font-semibold">Titlu</span>
          <input
            className="input"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="ex: iPhone 14 Pro 256GB"
          />
          {errors.title && <span className="text-red-600 text-sm">{errors.title}</span>}
        </label>

        <div className="grid sm:grid-cols-3 gap-4">
          <label className="grid gap-2">
            <span className="font-semibold">Pret (lei)</span>
            <input
              className="input"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              placeholder="ex: 4200"
              inputMode="decimal"
            />
            {errors.price && <span className="text-red-600 text-sm">{errors.price}</span>}
          </label>
          <label className="grid gap-2">
            <span className="font-semibold">Oras</span>
            <input
              className="input"
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
              placeholder="ex: Iasi"
            />
            {errors.city && <span className="text-red-600 text-sm">{errors.city}</span>}
          </label>
          <label className="grid gap-2">
            <span className="font-semibold">Categorie</span>
            <select
              className="input"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="text-red-600 text-sm">{errors.category}</span>}
          </label>
        </div>

        <label className="grid gap-2">
          <span className="font-semibold">Descriere</span>
          <textarea
            className="input min-h-[140px]"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Detaliaza starea produsului, garantia, livrarea etc."
          />
          {errors.description && <span className="text-red-600 text-sm">{errors.description}</span>}
        </label>

        <div className="grid gap-2">
          <span className="font-semibold">Imagini</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading || isSubmitting}
          />
          {!user && <span className="text-sm text-neutral-500">Autentifica-te pentru a incarca imagini.</span>}
          {isUploading && <span className="text-sm text-neutral-500">Incarcam imaginea...</span>}
          {uploadError && <span className="text-red-600 text-sm">{uploadError}</span>}
          {errors.images && <span className="text-red-600 text-sm">{errors.images}</span>}

          {form.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {form.images.map((src, index) => (
                <div key={src} className="relative">
                  <div className="relative h-32 w-full overflow-hidden rounded-xl border">
                    <Image
                      src={src}
                      alt={`Imagine ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn btn-outline absolute top-2 right-2 px-3 py-1 text-xs"
                  >
                    Sterge
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {globalError && <div className="text-red-600 text-sm">{globalError}</div>}

        <div className="pt-2">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting || isUploading}>
            {isSubmitting ? 'Publicam anuntul...' : 'Publica anuntul'}
          </button>
        </div>
      </form>
    </main>
  )
}
