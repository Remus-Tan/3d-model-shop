import type { Metadata } from 'next';
import '/src/app/globals.css';
import SidebarNav from './_components/sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Profile - Settings - Blendy',
  description: 'Settings Page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {  
  return (
    <>
      <div className="max-w-[2000px] m-auto space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex space-x-12 space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
