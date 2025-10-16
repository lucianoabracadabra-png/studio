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
import { useState, useEffect, useCallback } from 'react';

const mainLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, colorHue: 200 },
  { label: 'Characters', href: '/characters', icon: Users, colorHue: 240 },
  { label: 'Virtual Tabletop', href: '/vtt', icon: Map, colorHue: 280 },
  { label: 'Wiki', href: '/wiki', icon: BookOpen, colorHue: 320 },
];

const gmToolsLinks = [
  { label: 'Dice Roller', href: '/tools/dice-roller', icon: Dices, colorHue: 30 },
  { label: 'Combat Tracker', href: '/gm/combat-tracker', icon: Swords, colorHue: 65 },
  { label: 'Generators', href: '/tools/generator', icon: FlaskConical, colorHue: 100 },
  { label: 'Describer', href: '/tools/description-generator', icon: FileText, colorHue: 135 },
  { label: 'Soundboard', href: '/tools/soundboard', icon: Volume2, colorHue: 170 },
];

const profileLink = {
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
  
  const [activePath, setActivePath] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const [animationStyles, setAnimationStyles] = useState<{ [key: string]: React.CSSProperties }>({});

  useEffect(() => {
    // This now only runs on the client, preventing hydration errors.
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
    setActivePath(currentPath);
    if(currentPath === targetHref) {
      setIsPageLoading(false);
      setTargetHref(null);
    }
  }, [pathname, targetHref]);

  const handleLinkClick = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (activePath === href || isPageLoading) return;

    setIsPageLoading(true);
    setTargetHref(href);
    router.push(href);
  }, [activePath, isPageLoading, router]);
  
  const renderBook = (link: any, isTool: boolean) => {
    const isActive = activePath === link.href;
    const isSpinning = isPageLoading && targetHref === link.href;

    return (
      <Tooltip key={link.href}>
        <TooltipTrigger asChild>
          <a
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.href)}
          >
            <div
              className={cn(
                'book-nav-item',
                isTool && 'book-tool',
                isActive && 'active',
                isSpinning && 'book-spin-continuous'
              )}
              style={{ ...animationStyles[link.href], '--book-color-hue': `${link.colorHue}deg` } as React.CSSProperties}
            >
              <link.icon className={cn("w-6 h-6 text-white/80 transition-all", isActive && "active-icon")} />
            </div>
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{link.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full z-50 flex flex-col items-center w-20 py-4">
      <ScrollArea className="w-full hide-scrollbar" scrollHideDelay={0}>
        <TooltipProvider>
          <div className="flex flex-col items-center gap-4 py-4">
            <nav className="flex flex-col items-center gap-2">
              {mainLinks.map(link => renderBook(link, false))}
            </nav>

            <div className="h-px w-8 bg-white/20 my-2" />

            <nav className="flex flex-col items-center gap-2">
              {gmToolsLinks.map(link => renderBook(link, true))}
            </nav>
            
            <div className="flex-grow"></div>

            <nav className="flex flex-col items-center gap-2 mt-4">
                {renderBook(profileLink, true)}
            </nav>

          </div>
        </TooltipProvider>
      </ScrollArea>
    </div>
  );
}
