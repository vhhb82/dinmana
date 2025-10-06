import Image from 'next/image'
import Link from 'next/link'
import { CategoryGrid } from '@/components/CategoryGrid'
import { AdCard, type Ad } from '@/components/AdCard'

const featured: Ad[] = [
  { id: '1', title: 'iPhone 14 Pro 256GB', price: 4200, city: 'Iași', category: 'Electronice', image: '/demo/iphone.jpg', postedAt: 'Astăzi' },
  { id: '2', title: 'Apartament 2 camere Centru', price: 98000, city: 'Suceava', category: 'Imobiliare', image: '/demo/apart.jpg', postedAt: 'Ieri' },
  { id: '3', title: 'Dacia Duster 4x4 2019', price: 11200, city: 'Botoșani', category: 'Auto', image: '/demo/duster.jpg', postedAt: 'Acum 3 zile' },
]

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
        <div className="container-xl py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 badge">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> Lansare MVP
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Din mână în mână — <span className="text-primary">anunțuri locale, rapide</span>
              </h1>
              <p className="mt-4 text-lg text-neutral-600 max-w-2xl">
                Vinde și cumpără în orașul tău. Fără complicații, fără comisioane ascunse. Postezi în 30 de secunde.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/ads/new" className="btn btn-primary">Adaugă anunț</Link>
                <Link href="#categorie" className="btn btn-outline">Caută în apropiere</Link>
              </div>
              {/* Căutare */}
              <div className="mt-8 card p-3 sm:p-4 lg:p-5">
                <form className="grid gap-3 sm:grid-cols-[1fr,180px,140px,120px]">
                  <input className="input" placeholder="Ce cauți? ex: iPhone, bicicletă, garsonieră" />
                  <input className="input" placeholder="Oraș" />
                  <select className="input"><option>Toate categoriile</option></select>
                  <button className="btn btn-primary" type="button">Caută</button>
                </form>
              </div>
            </div>

            {/* Right visuals */}
            <div className="hidden lg:block">
              <div className="card overflow-hidden">
                <div className="relative h-[420px]">
                  <Image
                    src="/demo/hero-collage.jpg"
                    alt="Anunțuri locale"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 420px, 100vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorii */}
      <section id="categorie" className="container-xl py-10 lg:py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">Categorii populare</h2>
          <Link href="#" className="text-primary font-semibold">Vezi toate →</Link>
        </div>
        <CategoryGrid />
      </section>

      {/* Anunțuri recomandate */}
      <section className="container-xl pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">Anunțuri recomandate</h2>
          <Link href="#" className="text-primary font-semibold">Toate anunțurile →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-neutral-100 border-t border-neutral-200">
        <div className="container-xl py-12 text-center">
          <h3 className="text-2xl font-bold">Ai ceva de vândut?</h3>
          <p className="mt-2 text-neutral-600">Publică anunțul gratuit și găsește cumpărători în orașul tău.</p>
          <div className="mt-5">
            <Link href="/ads/new" className="btn btn-primary">Publică anunț</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
