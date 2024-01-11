import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Hello friends',
  description: 'Welcome',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
