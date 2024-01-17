import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs';

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
      <html lang="en" className={GeistSans.className}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
