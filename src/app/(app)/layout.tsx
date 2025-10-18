'use client'

import AppLayout from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { mainLinks, gmToolsLinks, profileLink } from '@/components/layout/sidebar-nav';
import { MovableWindowProvider } from '@/context/movable-window-context';
import { MovableWindow } from '@/components/layout/movable-window';

const allLinks = [...mainLinks, ...gmToolsLinks, profileLink];

const pathColorMap: { [key: string]: number } = allLinks.reduce((acc, link) => {
    acc[link.href] = link.colorHue;
    return acc;
}, {} as { [key: string]: number });


export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activePath = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/_error' ? null : pathname;
  
  const getActiveColorHue = () => {
    const matchedLink = allLinks.find(link => pathname.startsWith(link.href) && link.href !== '/');
    if (matchedLink) return matchedLink.colorHue;
    if (pathname === '/dashboard') return pathColorMap['/dashboard'];
    return 0;
  }
  
  const colorHue = getActiveColorHue();
  
  const pageStyle = {
    '--page-primary-color': `${colorHue}`,
    '--page-accent-color': `${(colorHue + 40) % 360}`,
  } as React.CSSProperties;

  return (
    <MovableWindowProvider>
      <AppLayout 
        activePath={activePath}
        style={pageStyle}
      >
        <div
          className="page-container-visuals"
          style={pageStyle}
        >
          {children}
        </div>
      </AppLayout>
      <MovableWindow />
    </MovableWindowProvider>
  );
}
