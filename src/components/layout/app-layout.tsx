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
    <div className="min-h-screen w-full bg-background relative">
        <div className='relative z-20'>
            <SidebarNav activePath={activePath} />
        </div>
        <main className="pl-24 h-screen relative z-10">
            <div className="h-full w-full">
                <div 
                    className='page-container-visuals' style={style}
                >
                    <div className={cn('page-container-content', 'h-full flex-1 flex flex-col')}>
                         {children}
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
