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
  Icon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { Separator } from '../ui/separator';
import React from 'react';
import { Icons } from '@/components/ui/icons';

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
  { label: 'Mesa de Som', href: '/tools/soundboard', icon: Volume2, colorHue: 170, title: 'Som' },
];

export const profileLink = {
  label: 'Perfil',
  href: '/profile',
  icon: () => (
    <Avatar className="h-10 w-10 border-2 border-white/50">
      <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@shadcn" data-ai-hint="fantasy wizard" />
      <AvatarFallback>GM</AvatarFallback>
    </Avatar>
  ),
  colorHue: 0,
  title: 'Perfil'
};


const Book = ({ link, isActive }: { link: (typeof mainLinks)[0], isActive: boolean }) => {
    const Icon = link.icon;
    const isTool = gmToolsLinks.some(tool => tool.href === link.href);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={link.href} className="relative group">
                       <div
                            className={cn(
                                'relative w-14 h-16 transition-all duration-300 ease-in-out transform-gpu',
                                'group-hover:-translate-y-1 group-hover:scale-105'
                            )}
                        >
                            <div 
                                className={cn(
                                    'absolute inset-0 rounded-md rounded-l-lg transition-all duration-300',
                                    'bg-gradient-to-br from-neutral-700 to-neutral-800',
                                    'shadow-lg group-hover:shadow-2xl',
                                    isActive && 'shadow-primary/50'
                                )}
                                style={{'--book-color-hue': `${link.colorHue}deg`} as React.CSSProperties}
                            />
                            
                            {/* Book spine */}
                            <div className={cn(
                                'absolute top-0 left-0 h-full w-2 rounded-l-md bg-neutral-900',
                                isActive ? 'bg-primary' : ''
                            )} 
                            style={{backgroundColor: isActive ? `hsl(${link.colorHue}, 90%, 60%)` : ''}}
                            />
                            
                            {/* Icon on cover */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Icon className={cn(
                                    'w-7 h-7 text-neutral-300/80 transition-all duration-300',
                                    'group-hover:text-white group-hover:scale-110',
                                    isActive && 'text-white drop-shadow-[0_0_5px_hsl(var(--primary))]'
                                )} 
                                style={{color: isActive ? `hsl(${link.colorHue}, 90%, 80%)` : ''}}
                                />
                            </div>

                             {/* Active glow */}
                            {isActive && (
                                <div 
                                    className="absolute -inset-1 rounded-lg blur-md"
                                    style={{backgroundColor: `hsl(${link.colorHue}, 90%, 70%)`, opacity: 0.3, zIndex: -1}}
                                />
                            )}
                        </div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{link.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};


const ProfileLink = ({ link, isActive }: { link: typeof profileLink, isActive: boolean }) => {
    const Icon = link.icon;
    return (
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={link.href} className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-all",
                        isActive ? "ring-2 ring-primary scale-110" : "hover:scale-105"
                    )}>
                        <Icon />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{link.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}


export function SidebarNav() {
    const pathname = usePathname();

    return (
      <div className="fixed top-0 left-0 h-full w-20 flex flex-col items-center gap-4 z-50 py-4 bg-background/50 backdrop-blur-sm border-r">
          <Link href="/dashboard" className='px-4'>
            <Icons.logo className="h-8 w-8 text-primary" />
          </Link>
          <Separator className='w-10' />
          <nav className="flex flex-col items-center gap-4">
              {mainLinks.map(link => (
                  <Book 
                    key={link.href} 
                    link={link} 
                    isActive={pathname.startsWith(link.href)} />
              ))}
          </nav>
          <Separator className='my-2 w-10' />
          <nav className="flex flex-col items-center gap-4">
              {gmToolsLinks.map(link => (
                  <Book 
                    key={link.href} 
                    link={link} 
                    isActive={pathname.startsWith(link.href)} />
              ))}
          </nav>
          <div className='flex-grow'></div>
          <nav>
              <ProfileLink link={profileLink} isActive={pathname.startsWith(profileLink.href)} />
          </nav>
      </div>
  );
}
