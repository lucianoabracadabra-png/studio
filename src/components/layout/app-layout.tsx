'use client';

import { SidebarNav } from './sidebar-nav';

type AppLayoutProps = {
  children: React.ReactNode;
  activePath: string | null;
  colorHue: number;
};

export default function AppLayout({ children, activePath, colorHue }: AppLayoutProps) {
  const pageStyle = {
    '--page-primary-color': `hsl(${colorHue}, 90%, 70%)`,
    '--page-accent-color': `hsl(${(colorHue + 40) % 360}, 90%, 70%)`,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen w-full bg-background relative">
        <div className='relative z-20'>
            <SidebarNav activePath={activePath} />
        </div>
        <main className="pl-24 h-screen relative z-10">
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-6">
                <div 
                    className="page-container flex-1 flex flex-col"
                    style={pageStyle}
                >
                    {children}
                </div>
            </div>
        </main>
    </div>
  );
}
