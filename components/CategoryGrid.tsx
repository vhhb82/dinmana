import Link from 'next/link'
import Image from 'next/image'

const items = [
  { key: 'auto', label: 'Auto / Moto', img: '/demo/cat-auto.jpg' },
  { key: 'home', label: 'Casă & grădină', img: '/demo/cat-home.jpg' },
  { key: 'elec', label: 'Electronice', img: '/demo/cat-elec.jpg' },
  { key: 'real', label: 'Imobiliare', img: '/demo/cat-real.jpg' },
  { key: 'jobs', label: 'Joburi & servicii', img: '/demo/cat-jobs.jpg' },
  { key: 'agro', label: 'Agricultură', img: '/demo/cat-agro.jpg' },
]

export function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link key={item.key} href={`/#cat-${item.key}`} className="card overflow-hidden group">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={item.img}
              alt={item.label}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="font-semibold">{item.label}</span>
            <span className="text-primary font-semibold">Vezi →</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
