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
  const router = useRouter();
  
  const [animatingHref, setAnimatingHref] = useState<string | null>(null);
  const [spinCompleteHref, setSpinCompleteHref] = useState<string | null>(activePath);
  const [previousBook, setPreviousBook] = useState<string | null>(null);
  
  const activeBook = activePath;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const handleLinkClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (href === activeBook || animatingHref) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setPreviousBook(activeBook);
    setSpinCompleteHref(null);
    setAnimatingHref(href);
    
    timeoutRef.current = setTimeout(() => {
      router.push(href);
      setAnimatingHref(null);
      setSpinCompleteHref(href);
    }, 2000); 
  };
  
  const renderBook = (link: any, isTool: boolean) => {
    const isActive = activeBook?.startsWith(link.href);
    const isPrevious = previousBook?.startsWith(link.href);
    const isAnimating = animatingHref === link.href;
    const isSpinComplete = spinCompleteHref?.startsWith(link.href);

    const Icon = link.icon;

    return (
      <TooltipProvider key={link.href}>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={cn(
                    "book-wrapper", 
                    isAnimating && 'book-spin-and-ignite',
                    isPrevious && 'book-decaying',
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
                        style={{ '--book-color-hue': `${link.colorHue}` } as React.CSSProperties}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon className={cn(
                            "w-6 h-6 text-white/80 transition-all", 
                            isActive && !isAnimating && !isSpinComplete && 'active-icon'
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
  }

  return (
    <div className="fixed top-0 left-0 h-full w-24 flex flex-col items-center bg-transparent z-50 overflow-visible py-4">
      <nav className="flex flex-col items-center gap-4">
          {mainLinks.map(link => renderBook(link, false))}
          {gmToolsLinks.map(link => renderBook(link, true))}
          {profileLink.map(link => renderBook(link, true))}
      </nav>
    </div>
  );
}
