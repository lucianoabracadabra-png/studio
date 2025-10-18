'use client'

import AppLayout from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { mainLinks, gmToolsLinks, profileLink } from '@/components/layout/sidebar-nav';
import { MovableWindowProvider } from '@/context/movable-window-context';
import { MovableWindowManager } from '@/components/layout/movable-window';

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
    return 265; // Fallback hue
  }
  
  const colorHue = getActiveColorHue();
  const accentColorHue = (colorHue + 40) % 360;
  
  const pageStyle = {
    '--page-primary-color': `${colorHue} 90% 70%`,
    '--page-accent-color': `${accentColorHue} 90% 70%`,
    '--ring': `hsl(${colorHue}, 90%, 70%)`
  } as React.CSSProperties;

  return (
    <MovableWindowProvider>
      <AppLayout 
        activePath={activePath}
        style={pageStyle}
      >
        <div
          className="page-container-visuals"
        >
          {children}
        </div>
      </AppLayout>
      <MovableWindowManager />
    </MovableWindowProvider>
  );
}
