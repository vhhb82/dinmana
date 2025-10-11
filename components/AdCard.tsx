'use client'

import Image from 'next/image'
import Link from 'next/link'
import FavButton from '@/components/FavButton'
import type { AdRecord } from '@/lib/api'

function formatPostedAt(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diffMs = Date.now() - date.getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'acum'
  if (minutes < 60) return `acum ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `acum ${hours} h`

  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'short',
  })
}

export type Ad = AdRecord

export function AdCard({ ad }: { ad: AdRecord }) {
  const adId = ad._id ?? ad.id
  const href = adId ? `/ads/${adId}` : null
  const postedLabel = formatPostedAt(ad.postedAt ?? ad.createdAt)
  const locationLabel = ad.city && postedLabel ? `${ad.city} - ${postedLabel}` : ad.city || postedLabel || ''

  return (
    <article className="card overflow-hidden">
      {href ? (
        <Link href={href} className="relative block aspect-[16/11] overflow-hidden group">
          <Image
            src={ad.image}
            alt={ad.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
          />
        </Link>
      ) : (
        <div className="relative aspect-[16/11] overflow-hidden">
          <Image
            src={ad.image}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
          />
        </div>
      )}

      <div className="p-4">
        {href ? (
          <Link href={href} className="font-semibold line-clamp-2 hover:underline">
            {ad.title}
          </Link>
        ) : (
          <h3 className="font-semibold line-clamp-2">{ad.title}</h3>
        )}
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="text-primary font-extrabold text-lg whitespace-nowrap">
            {ad.price.toLocaleString('ro-RO')} lei
          </div>
          <div className="text-sm text-neutral-500 line-clamp-1 text-right">{locationLabel}</div>
        </div>
        <div className="mt-2 text-sm text-neutral-500">{ad.category}</div>
        {adId && (
          <div className="mt-3">
            <FavButton adId={adId} />
          </div>
        )}
      </div>
    </article>
  )
}
