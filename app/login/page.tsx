'use client'

import { useState } from 'react'
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/ads')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleRegister = async () => {
    setError('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/ads')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      router.push('/ads')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="container-xl py-10">
      <h1 className="text-2xl font-bold">Autentificare</h1>
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <form onSubmit={handleEmailLogin} className="card p-6 grid gap-3">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit">Intră</button>
            <button className="btn btn-outline" type="button" onClick={handleRegister}>Creează cont</button>
          </div>
        </form>
        <div className="card p-6 flex flex-col gap-3">
          <p className="text-neutral-600">Sau continuă rapid:</p>
          <button className="btn btn-primary" type="button" onClick={handleGoogle}>Continuă cu Google</button>
        </div>
      </div>
    </main>
  )
}
