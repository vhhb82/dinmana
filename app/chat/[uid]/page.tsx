'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'

type Message = {
  id: string
  from: string
  text: string
  ts: number
}

function storageKey(a: string, b: string) {
  const ids = [a, b].sort().join('_')
  return `chat_${ids}`
}

export default function ChatPage() {
  const { uid } = useParams<{ uid: string }>()
  const { user } = useAuth()
  const currentUserId = user?.uid ?? 'guest'
  const key = storageKey(currentUserId, uid)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        setMessages(JSON.parse(raw))
      }
    } catch (error) {
      console.error('Chat load error', error)
    }
  }, [key])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!text.trim()) return
    const message: Message = {
      id: crypto.randomUUID(),
      from: currentUserId,
      text: text.trim(),
      ts: Date.now(),
    }
    const nextMessages = [...messages, message]
    setMessages(nextMessages)
    setText('')
    try {
      localStorage.setItem(key, JSON.stringify(nextMessages))
    } catch (error) {
      console.error('Chat save error', error)
    }
  }

  return (
    <main className="container-xl py-8 lg:py-10">
      <h1 className="text-2xl font-bold">Chat</h1>
      <div ref={scrollRef} className="card p-4 h-[60vh] overflow-auto mt-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[70%] mb-3 ${message.from === currentUserId ? 'ml-auto text-right' : ''}`}
          >
            <div className={`rounded-2xl px-3 py-2 ${message.from === currentUserId ? 'bg-primary text-neutral-900' : 'bg-neutral-100'}`}>
              {message.text}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              {new Date(message.ts).toLocaleString('ro-RO')}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="input"
          placeholder="Scrie un mesaj..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              send()
            }
          }}
        />
        <button className="btn btn-primary" type="button" onClick={send}>Trimite</button>
      </div>
      <p className="text-neutral-500 text-sm mt-2">
        MVP offline – vom conecta Socket.io și backend pentru mesagerie realtime și notificări.
      </p>
    </main>
  )
}
