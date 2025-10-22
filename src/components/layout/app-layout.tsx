'use client';

import { SidebarNav } from './sidebar-nav';
import { cn } from '@/lib/utils';

type AppLayoutProps = {
  children: React.ReactNode;
  style: React.CSSProperties;
};

export default function AppLayout({ children, style }: AppLayoutProps) {

  return (
    <div className="min-h-screen w-full bg-background relative">
        <SidebarNav />
        <main 
            className={cn('ml-20 relative min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col gap-6')}
            style={style}
        >
          {children}
        </main>
    </div>
  );
}
