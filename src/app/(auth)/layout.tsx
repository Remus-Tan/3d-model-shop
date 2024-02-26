import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Blendy',
  description: 'This is Blendy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={GeistSans.className}>
        <body>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
