'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Header } from './header';

type AppLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

export default function AppLayout({ children, pageTitle }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <Header pageTitle={pageTitle} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
