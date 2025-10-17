'use client';

import { SidebarNav } from './sidebar-nav';

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
            <div 
                className="h-full overflow-y-auto"
            >
                <div className='page-container h-full p-4 lg:p-6 flex-1 flex flex-col' style={style}>
                    {children}
                </div>
            </div>
        </main>
    </div>
  );
}
