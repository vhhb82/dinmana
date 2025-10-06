'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { Ad } from '@/components/AdCard'
import { ADS } from '@/lib/mockAds'

export default function AdDetailPage() {
  const params = useParams<{ id: string }>()
  const [localAds, setLocalAds] = useState<Ad[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dinmana_ads')
      setLocalAds(raw ? JSON.parse(raw) : [])
    } catch (error) {
      console.error('Nu s-au putut încărca anunțurile salvate local.', error)
    }
  }, [])

  const ad = useMemo(() => {
    const allAds = [...localAds, ...ADS]
    return allAds.find((item) => item.id === params.id)
  }, [localAds, params.id])

  if (!ad) {
    return (
      <main className="container-xl py-10">
        <p className="text-neutral-700">Anunțul nu a fost găsit.</p>
        <Link href="/ads" className="text-primary">← Înapoi la anunțuri</Link>
      </main>
    )
  }

  const gallery = ad.images?.length ? ad.images : [ad.image]
  const sellerId = ad.ownerId ?? 'demo-seller'

  return (
    <main className="container-xl py-8 lg:py-10">
      <Link href="/ads" className="text-primary">← Înapoi la anunțuri</Link>
      <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6 mt-4">
        <div className="card p-0 overflow-hidden">
          <div className="relative aspect-[16/10] bg-neutral-100">
            <Image
              src={gallery[0]}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 720px, 100vw"
              unoptimized
            />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2 p-3">
              {gallery.slice(1, 5).map((src, index) => (
                <div key={index} className="relative h-20 overflow-hidden rounded-xl border">
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
            <div className="mt-2 text-primary font-extrabold text-xl">{ad.price.toLocaleString('ro-RO')} lei</div>
            <div className="mt-1 text-neutral-600 text-sm">
              {ad.city} • {ad.category} • {ad.postedAt}
            </div>
            <p className="mt-4 whitespace-pre-wrap">{ad.description ?? 'Detalii indisponibile.'}</p>
          </div>
        </div>
        <aside className="card p-4 h-max">
          <h3 className="font-bold text-lg">Contact vânzător</h3>
          <p className="text-neutral-600 mt-1 text-sm">
            (MVP) În versiunea finală vom avea chat și telefon mascat.
          </p>
          <Link href={`/chat/${sellerId}`} className="btn btn-primary mt-4 w-full">Trimite mesaj</Link>
          <a href="tel:+40700000000" className="btn btn-outline mt-2 w-full">Sună vânzător</a>
        </aside>
      </div>
    </main>
  )
}
