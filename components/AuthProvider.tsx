'use client'

import { onAuthStateChanged, type User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthCtx = createContext<AuthContextValue>({ user: null, loading: true })

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
