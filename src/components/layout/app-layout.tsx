'use client';

import { SidebarNav } from './sidebar-nav';
import { cn } from '@/lib/utils';

type AppLayoutProps = {
  children: React.ReactNode;
  activePath: string | null;
  style: React.CSSProperties;
};

export default function AppLayout({ children, activePath, style }: AppLayoutProps) {

  return (
    <div className="min-h-screen w-full bg-background relative overflow-visible">
        <SidebarNav activePath={activePath} />
        <main className="pl-24 relative min-h-screen p-4 lg:p-6">
            <div className="page-container-visuals" style={style}>
                <div className={cn('page-container-content')}>
                    {children}
                </div>
            </div>
        </main>
    </div>
  );
}
