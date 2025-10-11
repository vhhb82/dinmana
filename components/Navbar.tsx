'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/components/AuthProvider'
import { FILTER_CATEGORIES } from '@/components/FilterBar'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement | null>(null)
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!categoriesRef.current) return
      if (categoriesRef.current.contains(event.target as Node)) return
      setCategoriesOpen(false)
    }

    if (categoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [categoriesOpen])

  useEffect(() => {
    if (open === false) {
      setCategoriesOpen(false)
    }
  }, [open])

  const renderCategoryLink = (category: (typeof FILTER_CATEGORIES)[number]) => {
    const href = category === 'Toate' ? '/ads' : `/ads?category=${encodeURIComponent(category)}`
    return (
      <Link
        key={category}
        href={href}
        className="px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
        onClick={() => setCategoriesOpen(false)}
      >
        {category === 'Toate' ? 'Toate categoriile' : category}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-neutral-200">
      <div className="container-xl h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-lg text-neutral-900">
          <span className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-primary px-4 py-1 text-sm font-black uppercase tracking-tight shadow-sm">
            DM&M
          </span>
          Din mana in mana
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-neutral-800">
          <div className="relative" ref={categoriesRef}>
            <button
              type="button"
              className={`btn btn-outline ${categoriesOpen ? 'bg-neutral-900 text-white border-neutral-900' : ''}`}
              onClick={() => setCategoriesOpen((prev) => !prev)}
            >
              Categorii
            </button>
            {categoriesOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
                <div className="flex flex-col">{FILTER_CATEGORIES.map(renderCategoryLink)}</div>
              </div>
            )}
          </div>
          <Link href="/ads" className="hover:text-neutral-950">
            Anunturi
          </Link>
          <Link href="/favorites" className="hover:text-neutral-950">
            Favorite
          </Link>
          {user ? (
            <>
              <span className="text-neutral-600 text-sm">Salut, {user.email?.split('@')[0] ?? 'utilizator'}</span>
              <button className="btn btn-outline" onClick={handleSignOut}>
                Iesi
              </button>
              <Link href="/ads/new" className="btn btn-primary">
                Adauga anunt
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-neutral-950">
                Intra
              </Link>
              <Link href="/ads/new" className="btn btn-primary">
                Adauga anunt
              </Link>
            </>
          )}
        </nav>
        <button className="md:hidden btn btn-outline" onClick={() => setOpen(!open)}>
          Meniu
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white/95 backdrop-blur">
          <div className="container-xl py-3 flex flex-col gap-2 text-neutral-900">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setCategoriesOpen((prev) => !prev)}
            >
              Categorii
            </button>
            {categoriesOpen && (
              <div className="grid gap-1 rounded-xl border border-neutral-200 bg-white p-2">
                {FILTER_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    href={category === 'Toate' ? '/ads' : `/ads?category=${encodeURIComponent(category)}`}
                    className="px-3 py-2 text-sm rounded-lg hover:bg-neutral-100"
                    onClick={() => {
                      setCategoriesOpen(false)
                      setOpen(false)
                    }}
                  >
                    {category === 'Toate' ? 'Toate categoriile' : category}
                  </Link>
                ))}
              </div>
            )}
            <Link href="/ads">Anunturi</Link>
            <Link href="/favorites">Favorite</Link>
            {user ? (
              <button className="btn btn-outline" onClick={handleSignOut}>
                Iesi
              </button>
            ) : (
              <Link href="/login">Intra</Link>
            )}
            <Link href="/ads/new" className="btn btn-primary">
              Adauga anunt
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
