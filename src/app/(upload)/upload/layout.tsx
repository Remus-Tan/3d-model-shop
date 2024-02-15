import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '../../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Hello friends',
  description: 'Welcome',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={GeistSans.className}>
        <body className='w-fit m-auto bg-stone-100'>
            {children}
            <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
