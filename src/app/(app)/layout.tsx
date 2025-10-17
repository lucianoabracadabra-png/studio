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
  
  const pageStyle = {
    '--page-primary-color': `${colorHue}`,
    '--page-accent-color': `${(colorHue + 40) % 360}`,
  } as React.CSSProperties;

  return (
      <AppLayout 
        activePath={activePath}
      >
          <div 
              className="page-container h-full"
              style={pageStyle}
          >
              <div className='p-4 lg:p-6 flex-1 flex flex-col'>
                  {children}
              </div>
          </div>
      </AppLayout>
  );
}
