'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { SidebarNav } from './sidebar-nav';
import { cn } from '@/lib/utils';
import navData from '@/lib/data/navigation.json';
import { profileLink } from './sidebar-nav';

type AppLayoutProps = {
  children: React.ReactNode;
};

const allLinks = [...navData.mainLinks, ...navData.gmToolsLinks, { ...profileLink, id: 'nav-profile' }];

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const activeColorHue = useMemo(() => {
    const activeLink = allLinks.find(link => pathname.startsWith(link.href));
    return activeLink ? activeLink.colorHue : '240 10% 50%'; // Default grey
  }, [pathname]);

  const mainStyle = {
    '--page-accent-color': `hsl(${activeColorHue})`,
  } as React.CSSProperties;


  return (
    <div className="min-h-screen w-full bg-background relative">
        <SidebarNav />
        <main 
          style={mainStyle}
          className={cn(
            'ml-20 relative min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col gap-6',
            'main-content-area'
            )}
          >
          {children}
        </main>
    </div>
  );
}
