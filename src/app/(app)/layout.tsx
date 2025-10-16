'use client'

import AppLayout from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
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
  const [activePath, setActivePath] = useState<string | null>(null);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [colorHue, setColorHue] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const previousPathnameRef = useRef<string | null>(null);


  useEffect(() => {
    const newPath = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/_error' ? null : pathname;
    const oldPath = previousPathnameRef.current;

    if (newPath !== oldPath) {
      if (oldPath) {
        setIsClosing(true);
        // Wait for the closing animation to finish before changing content
        const timer = setTimeout(() => {
          setContent(children);
          setActivePath(newPath);
          setColorHue(pathColorMap[newPath || ''] || 0);
          setIsClosing(false);
        }, 500); // This duration should match your CSS animation
        return () => clearTimeout(timer);
      } else {
        // First load or coming from a non-app page
        setContent(children);
        setActivePath(newPath);
        setColorHue(pathColorMap[newPath || ''] || 0);
      }
    } else {
        // If the path is the same, but children might have updated (e.g. HMR)
        setContent(children);
    }
    previousPathnameRef.current = newPath;

  }, [pathname, children]);


  return (
      <AppLayout 
        activePath={activePath} 
        colorHue={colorHue} 
        isClosing={isClosing}
      >
        {content}
      </AppLayout>
  );
}
