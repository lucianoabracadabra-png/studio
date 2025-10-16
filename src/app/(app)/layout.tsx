'use client'

import AppLayout from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const pathColorMap: { [key: string]: string } = {
    '/dashboard': 'hsl(200 65% 50% / 0.05)',
    '/characters': 'hsl(240 65% 50% / 0.05)',
    '/vtt': 'hsl(280 65% 50% / 0.05)',
    '/wiki': 'hsl(320 65% 50% / 0.05)',
    '/tools/dice-roller': 'hsl(30 65% 50% / 0.05)',
    '/gm/combat-tracker': 'hsl(65 65% 50% / 0.05)',
    '/tools/generator': 'hsl(100 65% 50% / A0.05)',
    '/tools/description-generator': 'hsl(135 65% 50% / 0.05)',
    '/tools/soundboard': 'hsl(170 65% 50% / 0.05)',
    'default': 'transparent'
};


function getPageTitle(pathname: string): string {
    if (!pathname) return '';
    const segment = pathname.split('/').pop() || 'dashboard';
    const title = segment.replace(/-/g, ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
}

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [pageColor, setPageColor] = useState('transparent');
  const [isClosing, setIsClosing] = useState(false);


  useEffect(() => {
    if (pathname && pathname !== '/_error' && pathname !== '/') {
        setPageTitle(getPageTitle(pathname));
        setPageColor(pathColorMap[pathname] || pathColorMap.default);
        setShowContent(true);
        setIsClosing(false);
    } else {
        // When no path is active, start the closing animation
        setIsClosing(true);
    }
  }, [pathname]);

  const handleAnimationEnd = () => {
    // Only hide content after closing animation finishes
    if (isClosing) {
      setShowContent(false);
    }
  };

  return <AppLayout pageTitle={pageTitle} showContent={showContent} pageColor={pageColor} isClosing={isClosing} onAnimationEnd={handleAnimationEnd}>{children}</AppLayout>;
}
