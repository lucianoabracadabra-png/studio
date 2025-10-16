'use client';

import { SidebarNav } from './sidebar-nav';
import { cn } from '@/lib/utils';

type AppLayoutProps = {
  children: React.ReactNode;
  showContent: boolean;
  colorHue: number;
  isClosing: boolean;
  onAnimationEnd: () => void;
};

export default function AppLayout({ children, showContent, colorHue, isClosing, onAnimationEnd }: AppLayoutProps) {
  const pageStyle = {
    '--page-primary-color': `hsl(${colorHue} 90% 70%)`,
    '--page-accent-color': `hsl(${(colorHue + 40) % 360} 90% 70%)`,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen w-full bg-background relative">
      <SidebarNav />
      <main className="pl-20">
        {showContent && (
          <div 
            className={cn("page-content-wrapper", isClosing && "closing", "h-screen w-[calc(100%-5rem)] fixed top-0 left-20 flex items-center justify-center")}
            onAnimationEnd={onAnimationEnd}
          >
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-6">
              <div 
                className="page-container flex-1 flex flex-col"
                style={pageStyle}
              >
                {children}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
