'use client';

import Link from 'next/link';
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
import { useEffect, useRef, useState } from 'react';

export const mainLinks = [
  { label: 'Painel', href: '/dashboard', icon: LayoutDashboard, colorHue: 200, title: 'Painel' },
  { label: 'Personagens', href: '/characters', icon: Users, colorHue: 240, title: 'Personagens' },
  { label: 'Mesa Virtual', href: '/vtt', icon: Map, colorHue: 280, title: 'Mesa' },
  { label: 'Wiki', href: '/wiki', icon: BookOpen, colorHue: 320, title: 'Wiki' },
];

export const gmToolsLinks = [
  { label: 'Rolador de Dados', href: '/tools/dice-roller', icon: Dices, colorHue: 30, title: 'Dados' },
  { label: 'Rastreador de Combate', href: '/gm/combat-tracker', icon: Swords, colorHue: 65, title: 'Combate' },
  { label: 'Geradores', href: '/tools/generator', icon: FlaskConical, colorHue: 100, title: 'Gerador' },
  { label: 'Descritor de Cenas', href: '/tools/description-generator', icon: FileText, colorHue: 135, title: 'Cenas' },
  { label: 'Mesa de Som', href: '/tools/soundboard', icon: Volume2, colorHue: 170, title: 'Som' },
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
  title: 'Perfil'
}];

const Book = ({ link, activePath }: { link: (typeof mainLinks)[0], activePath: string | null }) => {
    const [animationDelay, setAnimationDelay] = useState('0s');
    
    useEffect(() => {
        setAnimationDelay(`-${Math.random() * 20}s`);
    }, []);

    const isActive = activePath?.startsWith(link.href);
    const Icon = link.icon;
    const isTool = gmToolsLinks.includes(link) || profileLink.includes(link);
    
    return (
        <TooltipProvider key={link.href}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="book-wrapper">
                        <Link
                            href={link.href}
                            className={cn(
                              'book-nav-item',
                              isTool ? 'tool-book' : 'main-book',
                              isActive && 'active',
                            )}
                            style={{ 
                              '--book-color-hue': `${link.colorHue}`,
                              animationDelay: animationDelay,
                            } as React.CSSProperties}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={cn(
                                "w-6 h-6 text-white/80 transition-all", 
                                isActive && 'active-icon'
                            )} />
                             <span className="book-title">{link.title}</span>
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
  
  const renderBook = (link: any) => {
      return <Book 
          key={link.href}
          link={link}
          activePath={activePath}
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
