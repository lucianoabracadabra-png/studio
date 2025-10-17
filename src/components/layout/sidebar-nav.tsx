'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const Book = ({ link, activeBook, previousBook, animatingHref, spinCompleteHref, handleLinkClick }: any) => {
    const [animationDelay, setAnimationDelay] = useState('0s');

    useEffect(() => {
      // This will only run on the client, after hydration, preventing mismatch
      setAnimationDelay(`-${Math.random() * 20}s`);
    }, []);


    const isActive = activeBook?.startsWith(link.href);
    const isPrevious = previousBook?.startsWith(link.href);
    const isAnimating = animatingHref === link.href;
    const isSpinComplete = spinCompleteHref?.startsWith(link.href);

    const Icon = link.icon;
    const isTool = gmToolsLinks.includes(link) || profileLink.includes(link);
    
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
                              isSpinComplete && !isAnimating && 'spin-complete'
                            )}
                            style={{ 
                              '--book-color-hue': `${link.colorHue}`,
                              animationDelay: animationDelay,
                            } as React.CSSProperties}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={cn(
                                "w-6 h-6 text-white/80 transition-all", 
                                (isActive || isSpinComplete) && !isAnimating && 'active-icon'
                            )} />
                        </Link>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{link.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};


export function SidebarNav({ activePath }: { activePath: string | null }) {
  const router = useRouter();
  
  const [animatingHref, setAnimatingHref] = useState<string | null>(null);
  const [previousBook, setPreviousBook] = useState<string | null>(null);
  
  const activeBook = activePath;
  const spinCompleteHref = activePath; 

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (animatingHref && activePath === animatingHref) {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setAnimatingHref(null);
        }, 1000);
    }
    
    // Cleanup timeout on unmount or if dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activePath, animatingHref]);
  
  const handleLinkClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (animatingHref) {
      e.preventDefault();
      return;
    }

    if (href === activeBook) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    setPreviousBook(activeBook);
    setAnimatingHref(href);
    
    if(timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      router.push(href);
    }, 1000);
  };
  
  const renderBook = (link: any) => {
      return <Book 
          key={link.href}
          link={link}
          activeBook={activeBook}
          previousBook={previousBook}
          animatingHref={animatingHref}
          spinCompleteHref={spinCompleteHref}
          handleLinkClick={handleLinkClick}
      />
  };

  return (
    <div className="fixed top-0 left-0 h-full w-24 flex flex-col items-center z-50 overflow-visible">
      <nav className="flex flex-col items-center gap-4 py-4">
          {mainLinks.map(renderBook)}
          {gmToolsLinks.map(renderBook)}
          {profileLink.map(renderBook)}
      </nav>
    </div>
  );
}
