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
    '/tools/generator': 'hsl(100 65% 50% / 0.05)',
    '/tools/description-generator': 'hsl(135 65% 50% / 0.05)',
    '/tools/soundboard': 'hsl(170 65% 50% / 0.05)',
    '/profile': 'hsl(0 0% 50% / 0.05)',
    'default': 'transparent'
};

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showContent, setShowContent] = useState(false);
  const [pageColor, setPageColor] = useState('transparent');
  const [isClosing, setIsClosing] = useState(false);


  useEffect(() => {
    const shouldShowContent = pathname && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/_error';
    
    if (shouldShowContent) {
        setIsClosing(false);
        setPageColor(pathColorMap[pathname] || pathColorMap.default);
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

  return <AppLayout showContent={showContent} pageColor={pageColor} isClosing={isClosing} onAnimationEnd={handleAnimationEnd}>{children}</AppLayout>;
}
