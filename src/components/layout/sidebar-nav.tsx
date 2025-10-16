'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  LayoutDashboard,
  Map,
  Swords,
  Users,
  FileText,
  Volume2,
  Dices,
  FlaskConical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect, useRef } from 'react';

export const mainLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, colorHue: 200 },
  { label: 'Characters', href: '/characters', icon: Users, colorHue: 240 },
  { label: 'Virtual Tabletop', href: '/vtt', icon: Map, colorHue: 280 },
  { label: 'Wiki', href: '/wiki', icon: BookOpen, colorHue: 320 },
];

export const gmToolsLinks = [
  { label: 'Dice Roller', href: '/tools/dice-roller', icon: Dices, colorHue: 30 },
  { label: 'Combat Tracker', href: '/gm/combat-tracker', icon: Swords, colorHue: 65 },
  { label: 'Generators', href: '/tools/generator', icon: FlaskConical, colorHue: 100 },
  { label: 'Describer', href: '/tools/description-generator', icon: FileText, colorHue: 135 },
  { label: 'Soundboard', href: '/tools/soundboard', icon: Volume2, colorHue: 170 },
];

export const profileLink = {
  label: 'Profile',
  href: '/profile',
  icon: () => (
    <Avatar className="h-9 w-9 border-2 border-white/50 avatar-glow">
      <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@shadcn" data-ai-hint="fantasy wizard" />
      <AvatarFallback>GM</AvatarFallback>
    </Avatar>
  ),
  colorHue: 0,
};

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [activePath, setActivePath] = useState(pathname);
  const [spinningBookHref, setSpinningBookHref] = useState<string | null>(null);
  const [reverseSpinningBookHref, setReverseSpinningBookHref] = useState<string | null>(null);
  const [animationStyles, setAnimationStyles] = useState<{ [key: string]: React.CSSProperties }>({});
  
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const styles: { [key: string]: React.CSSProperties } = {};
    [...mainLinks, ...gmToolsLinks, profileLink].forEach(link => {
      styles[link.href] = {
        '--animation-duration': `${(Math.random() * 4 + 6).toFixed(2)}s`,
        '--animation-delay': `${(Math.random() * -5).toFixed(2)}s`,
        '--float-x1': `${(Math.random() * 4 - 2).toFixed(2)}px`,
        '--float-y1': `${(Math.random() * 6 - 3).toFixed(2)}px`,
        '--float-x2': `${(Math.random() * 4 - 2).toFixed(2)}px`,
        '--float-y2': `${(Math.random() * 6 - 3).toFixed(2)}px`,
        '--float-x3': `${(Math.random() * 4 - 2).toFixed(2)}px`,
        '--float-y3': `${(Math.random() * 6 - 3).toFixed(2)}px`,
      } as React.CSSProperties;
    });
    setAnimationStyles(styles);
  }, []);

  useEffect(() => {
    const currentPath = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/_error' ? null : pathname;
    const prevPath = prevPathRef.current;
    
    if (currentPath !== prevPath && prevPath !== null && prevPath !== '/login' && prevPath !== '/signup' && prevPath !== '/_error') {
      setReverseSpinningBookHref(prevPath);
      setTimeout(() => setReverseSpinningBookHref(null), 1000); 
    }
    
    setActivePath(currentPath);
    prevPathRef.current = pathname;

  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (activePath !== href) {
        setSpinningBookHref(href);
        setTimeout(() => setSpinningBookHref(null), 1000);
        router.push(href);
    }
  };
  
  const renderBook = (link: any, isTool: boolean) => {
    const isActive = activePath === link.href;
    const isSpinning = spinningBookHref === link.href;
    const isReverseSpinning = reverseSpinningBookHref === link.href;
  
    return (
      <TooltipProvider key={link.href}>
        <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={cn(
                  'book-nav-item',
                  isTool ? 'tool-book' : 'main-book',
                  isActive && 'active',
                  isSpinning && 'book-spin-two-speeds',
                  isReverseSpinning && 'book-reverse-spin-anim',
                  !isActive && !isSpinning && !isReverseSpinning && 'float-anim'
                )}
                style={{ ...animationStyles[link.href], '--book-color-hue': `${link.colorHue}deg` } as React.CSSProperties}
              >
                <link.icon className={cn("w-6 h-6 text-white/80 transition-all", isActive && "active-icon")} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{link.label}</p>
            </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="fixed top-0 left-0 h-full w-20 flex flex-col items-center bg-transparent py-4 z-50">
      <ScrollArea className="w-full h-full hide-scrollbar">
        <div className="flex flex-col items-center gap-4 py-4">
          <nav className="flex flex-col items-center gap-4">
            {mainLinks.map(link => renderBook(link, false))}
          </nav>
          <nav className="flex flex-col items-center gap-2">
            {gmToolsLinks.map(link => renderBook(link, true))}
            {renderBook(profileLink, true)}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
