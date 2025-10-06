'use client'

import Image from 'next/image'
import FavButton from '@/components/FavButton'

export type Ad = {
  id: string
  title: string
  price: number
  city: string
  category: string
  image: string
  postedAt: string
  description?: string
  images?: string[]
  ownerId?: string
}

export function AdCard({ ad }: { ad: Ad }) {
  return (
    <article className="card overflow-hidden">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={ad.image}
          alt={ad.title}
          fill
          className="object-cover transition duration-300 hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{ad.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-primary font-extrabold text-lg">{ad.price.toLocaleString('ro-RO')} lei</div>
          <div className="text-sm text-neutral-500">{ad.city} • {ad.postedAt}</div>
        </div>
        <div className="mt-2 text-sm text-neutral-500">{ad.category}</div>
        <div className="mt-3">
          <FavButton adId={ad.id} />
        </div>
      </div>
    </article>
  )
}
