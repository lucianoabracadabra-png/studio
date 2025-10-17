'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { label: 'Painel', href: '/dashboard', icon: LayoutDashboard, colorHue: 200 },
  { label: 'Personagens', href: '/characters', icon: Users, colorHue: 240 },
  { label: 'Mesa Virtual', href: '/vtt', icon: Map, colorHue: 280 },
  { label: 'Wiki', href: '/wiki', icon: BookOpen, colorHue: 320 },
];

export const gmToolsLinks = [
  { label: 'Rolador de Dados', href: '/tools/dice-roller', icon: Dices, colorHue: 30 },
  { label: 'Rastreador de Combate', href: '/gm/combat-tracker', icon: Swords, colorHue: 65 },
  { label: 'Geradores', href: '/tools/generator', icon: FlaskConical, colorHue: 100 },
  { label: 'Descritor de Cenas', href: '/tools/description-generator', icon: FileText, colorHue: 135 },
  { label: 'Mesa de Som', href: '/tools/soundboard', icon: Volume2, colorHue: 170 },
];

export const profileLink = [{
  label: 'Perfil',
  href: '/profile',
  icon: () => (
    <Avatar className="h-9 w-9 border-2 border-white/50 avatar-glow">
      <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@shadcn" data-ai-hint="fantasy wizard" />
      <AvatarFallback>GM</AvatarFallback>
    </Avatar>
  ),
  colorHue: 0,
}];

export function SidebarNav({ activePath }: { activePath: string | null }) {
  const pathname = usePathname();
  const [activeBook, setActiveBook] = useState<string | null>(activePath);
  const [previousBook, setPreviousBook] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [animatingHref, setAnimatingHref] = useState<string | null>(null);
  const [spinCompleteHref, setSpinCompleteHref] = useState<string | null>(activePath);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (pathname !== activeBook) {
      setPreviousBook(activeBook);
      setActiveBook(pathname);
    }
  }, [pathname, activeBook]);

  const handleLinkClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href === activeBook) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault(); 
    setAnimatingHref(href);
    setSpinCompleteHref(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    window.history.pushState(null, '', href);
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);

    timeoutRef.current = setTimeout(() => {
      setAnimatingHref(null);
      setSpinCompleteHref(href);
    }, 2000); 
  };
  
  useEffect(() => {
    const handlePopState = () => {
       if (window.location.pathname !== activeBook) {
         setPreviousBook(activeBook);
         setActiveBook(window.location.pathname);
       }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeBook]);


  const renderBook = (link: any, isTool: boolean) => {
    const isActive = activeBook === link.href;
    const isPrevious = previousBook === link.href;
    const isAnimating = animatingHref === link.href;
    const isSpinComplete = spinCompleteHref === link.href;

    const Icon = link.icon;

    return (
      <TooltipProvider key={link.href}>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={cn(
                    "book-wrapper", 
                    isAnimating && 'book-spin-and-ignite',
                    isPrevious && !isAnimating && 'book-decaying',
                )}>
                    <Link
                        href={link.href}
                        onClick={(e) => handleLinkClick(link.href, e)}
                        className={cn(
                          'book-nav-item',
                          isTool ? 'tool-book' : 'main-book',
                          isActive && !isAnimating && 'active',
                          isSpinComplete && 'spin-complete'
                        )}
                        style={{ '--book-color-hue': `${link.colorHue}` } as React.CSSProperties}
                    >
                        <Icon className={cn("w-6 h-6 text-white/80 transition-all", isActive && !isAnimating && !isSpinComplete && 'active-icon')} />
                    </Link>
                </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{link.label}</p>
            </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const navContent = (
    <nav className="flex flex-col items-center gap-4 py-4">
        {mainLinks.map(link => renderBook(link, false))}
        {gmToolsLinks.map(link => renderBook(link, true))}
        {profileLink.map(link => renderBook(link, true))}
    </nav>
  )

  return (
    <div className="fixed top-0 left-0 h-full w-24 flex flex-col items-center bg-transparent z-50 overflow-visible">
      {isClient ? (
         <ScrollArea className="w-full h-full hide-scrollbar overflow-visible">
          {navContent}
        </ScrollArea>
      ) : (
        <div className="w-full h-full hide-scrollbar overflow-visible">
          {navContent}
        </div>
      )}
    </div>
  );
}
