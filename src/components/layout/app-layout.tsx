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
    <div className="grid grid-cols-[auto_1fr] min-h-screen w-full bg-background relative">
        <SidebarNav activePath={activePath} />
        <main className="h-screen relative z-10">
            <div className="h-full w-full">
                <div 
                    className='page-container-visuals' style={style}
                >
                    <div className={cn('page-container-content', 'h-full')}>
                         {children}
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
