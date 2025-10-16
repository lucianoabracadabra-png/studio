'use client'

import AppLayout from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { mainLinks, gmToolsLinks, profileLink } from '@/components/layout/sidebar-nav';

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
  const colorHue = pathColorMap[activePath || ''] || 0;

  return (
      <AppLayout 
        activePath={activePath} 
        colorHue={colorHue}
      >
          {children}
      </AppLayout>
  );
}
