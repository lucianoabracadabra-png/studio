'use client';

import { SidebarNav } from './sidebar-nav';
import { cn } from '@/lib/utils';

type AppLayoutProps = {
  children: React.ReactNode;
  style: React.CSSProperties;
};

export default function AppLayout({ children, style }: AppLayoutProps) {

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen w-full bg-background relative">
        <SidebarNav />
        <main 
            className={cn('ml-20 relative min-h-screen p-4 lg:p-6 page-container-visuals')}
            style={style}
        >
          {children}
        </main>
    </div>
  );
}
