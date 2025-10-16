'use client';

import { SidebarNav } from './sidebar-nav';
import { Header } from './header';

type AppLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
  showContent: boolean;
};

export default function AppLayout({ children, pageTitle, showContent }: AppLayoutProps) {
  return (
    <div className="pl-20">
      <SidebarNav />
      <div className="spell-effect"></div>
      {showContent && (
        <div className="page-content">
          <Header pageTitle={pageTitle} />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
