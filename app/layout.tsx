import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Din mână în mână – Anunțuri locale rapide',
  description: 'Marketplace local – vinde și cumpără simplu, din mână în mână.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
