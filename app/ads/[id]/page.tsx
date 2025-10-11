'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { fetchAd, type AdRecord } from '@/lib/api'

export default function AdDetailPage() {
  const params = useParams<{ id: string }>()
  const [ad, setAd] = useState<AdRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchAd(params.id, { signal: controller.signal })
      .then((data) => {
        setAd(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        const message = err instanceof Error ? err.message : 'Nu am putut incarca anuntul.'
        setError(message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [params.id])

  const gallery = useMemo(() => {
    if (!ad) return []
    if (ad.images && ad.images.length > 0) {
      return ad.images.filter(Boolean)
    }
    return ad.image ? [ad.image] : []
  }, [ad])

  if (loading) {
    return (
      <main className="container-xl py-10">
        <p className="text-neutral-600">Incarcam anuntul...</p>
      </main>
    )
  }

  if (error || !ad) {
    return (
      <main className="container-xl py-10">
        <p className="text-neutral-700">{error ?? 'Anuntul nu a fost gasit.'}</p>
        <Link href="/ads" className="text-primary">
          &larr; Inapoi la anunturi
        </Link>
      </main>
    )
  }

  const sellerId = ad.ownerId ?? 'demo-seller'

  return (
    <main className="container-xl py-8 lg:py-10">
      <Link href="/ads" className="text-primary">
        &larr; Inapoi la anunturi
      </Link>
      <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6 mt-4">
        <div className="card p-0 overflow-hidden">
          <div className="relative aspect-[16/10] bg-neutral-100">
            {gallery[0] ? (
              <Image
                src={gallery[0]}
                alt={ad.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 720px, 100vw"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-500">Fara imagine</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2 p-3">
              {gallery.slice(1, 5).map((src, index) => (
                <div key={src ?? index} className="relative h-20 overflow-hidden rounded-xl border">
                  <Image
                    src={src}
                    alt={`${ad.title} - imagine ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
          <div className="p-4">
            <h1 className="text-2xl font-bold">{ad.title}</h1>
            <div className="mt-2 text-primary font-extrabold text-xl">
              {ad.price.toLocaleString('ro-RO')} lei
            </div>
            <div className="mt-1 text-neutral-600 text-sm">
              {ad.city} - {ad.category}
            </div>
            <p className="mt-4 whitespace-pre-wrap">{ad.description ?? 'Detalii indisponibile.'}</p>
          </div>
        </div>
        <aside className="card p-4 h-max">
          <h3 className="font-bold text-lg">Contact vanzator</h3>
          <p className="text-neutral-600 mt-1 text-sm">
            MVP: chat si telefon disponibile dupa confirmarea identitatii.
          </p>
          <Link href={`/chat/${sellerId}`} className="btn btn-primary mt-4 w-full">
            Trimite mesaj
          </Link>
          <a href="tel:+40700000000" className="btn btn-outline mt-2 w-full">
            Suna vanzator
          </a>
        </aside>
      </div>
    </main>
  )
}
