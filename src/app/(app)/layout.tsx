'use client'

import AppLayout from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const [showContent, setShowContent] = useState(false);
  const [colorHue, setColorHue] = useState(0);
  const [isClosing, setIsClosing] = useState(false);


  useEffect(() => {
    const shouldShowContent = pathname && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/_error';
    
    if (shouldShowContent) {
        setIsClosing(false);
        setColorHue(pathColorMap[pathname] || 0);
        setShowContent(true);
    } else {
        setIsClosing(true);
    }
  }, [pathname]);

  const handleAnimationEnd = () => {
    if (isClosing) {
      setShowContent(false);
    }
  };

  return <AppLayout showContent={showContent} colorHue={colorHue} isClosing={isClosing} onAnimationEnd={handleAnimationEnd}>{children}</AppLayout>;
}
