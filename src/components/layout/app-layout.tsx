'use client';

import { SidebarNav } from './sidebar-nav';
import { Header } from './header';
import { cn } from '@/lib/utils';

type AppLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
  showContent: boolean;
  pageColor: string;
  isClosing: boolean;
  onAnimationEnd: () => void;
};

export default function AppLayout({ children, pageTitle, showContent, pageColor, isClosing, onAnimationEnd }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <div className="spell-effect"></div>
        {showContent && (
          <div 
            className={cn("page-content-wrapper", isClosing && "closing", "flex-1 flex flex-col p-4 lg:p-6")}
            onAnimationEnd={onAnimationEnd}
          >
            <Header pageTitle={pageTitle} />
            <main className="flex flex-1 flex-col overflow-y-auto">
              <div 
                className="page-container flex-1 flex flex-col"
                style={{ '--page-bg-color': pageColor } as React.CSSProperties}
              >
                {children}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
