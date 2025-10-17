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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

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

export const profileLink = [{
  label: 'Profile',
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
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  const [activeBook, setActiveBook] = useState<string | null>(activePath);
  
  useEffect(() => {
    setActiveBook(activePath);
  }, [activePath]);


  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (isAnimating) return;

    setIsAnimating(href);
    router.push(href);
    
    setTimeout(() => {
        setIsAnimating(null);
        setActiveBook(href);
    }, 2000); // Duration of the animation
  };
  

  const renderBook = (link: any, isTool: boolean) => {
    const isCurrentlyAnimating = isAnimating === link.href;
    const isActive = activeBook === link.href && !isAnimating;
  
    return (
      <TooltipProvider key={link.href}>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={cn(
                    "book-wrapper", 
                    isCurrentlyAnimating && 'book-spin-and-ignite'
                )}>
                    <Link
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className={cn(
                        'book-nav-item',
                        isTool ? 'tool-book' : 'main-book',
                        isActive && 'active spin-complete'
                        )}
                        style={{ '--book-color-hue': `${link.colorHue}` } as React.CSSProperties}
                    >
                        <link.icon className={cn("w-6 h-6 text-white/80 transition-all", isActive && 'active-icon')} />
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
    <div className="fixed top-0 left-0 h-full w-24 flex flex-col items-center bg-transparent py-4 z-50">
      <ScrollArea className="w-full h-full hide-scrollbar">
        <div className="flex flex-col items-center gap-4 py-4">
          <nav className="flex flex-col items-center gap-4">
            {mainLinks.map(link => renderBook(link, false))}
          </nav>
          <nav className="flex flex-col items-center gap-2">
            {gmToolsLinks.map(link => renderBook(link, true))}
            {profileLink.map(link => renderBook(link, true))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
