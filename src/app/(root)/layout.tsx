import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Topbar from '@/components/shared/topbar';
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
        <body className="bg-background">
          <Topbar />
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
