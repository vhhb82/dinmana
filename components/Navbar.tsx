'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/components/AuthProvider'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-neutral-200">
      <div className="container-xl h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-lg text-neutral-900">
          <span className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-primary px-4 py-1 text-sm font-black uppercase tracking-tight shadow-sm">
            DM&M
          </span>
          Din mână în mână
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-neutral-800">
          <Link href="/ads" className="hover:text-neutral-950">Anunțuri</Link>
          <Link href="/favorites" className="hover:text-neutral-950">Favorite</Link>
          {user ? (
            <>
              <span className="text-neutral-600 text-sm">Salut, {user.email?.split('@')[0] ?? 'utilizator'}</span>
              <button className="btn btn-outline" onClick={handleSignOut}>Ieși</button>
              <Link href="/ads/new" className="btn btn-primary">Adaugă anunț</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-neutral-950">Intră</Link>
              <Link href="/ads/new" className="btn btn-primary">Adaugă anunț</Link>
            </>
          )}
        </nav>
        <button className="md:hidden btn btn-outline" onClick={() => setOpen(!open)}>Meniu</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white/95 backdrop-blur">
          <div className="container-xl py-3 flex flex-col gap-2 text-neutral-900">
            <Link href="/ads">Anunțuri</Link>
            <Link href="/favorites">Favorite</Link>
            {user ? (
              <button className="btn btn-outline" onClick={handleSignOut}>Ieși</button>
            ) : (
              <Link href="/login">Intră</Link>
            )}
            <Link href="/ads/new" className="btn btn-primary">Adaugă anunț</Link>
          </div>
        </div>
      )}
    </header>
  )
}

