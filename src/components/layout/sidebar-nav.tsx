'use client';

import Link from 'next/link';
import {
  BookOpen,
  LayoutDashboard,
  Map,
  Swords,
  Users,
  FlaskConical,
  Dices,
  Volume2,
  LucideIcon,
  Settings,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { motion } from 'framer-motion';
import React from 'react';

export const mainLinks = [
  { label: 'Painel', href: '/dashboard', icon: LayoutDashboard, colorHue: 15 },
  { label: 'Personagens', href: '/characters', icon: Users, colorHue: 265 },
  { label: 'Mesa Virtual', href: '/vtt', icon: Map, colorHue: 180 },
  { label: 'Wiki', href: '/wiki', icon: BookOpen, colorHue: 45 },
];

export const gmToolsLinks = [
  { label: 'Rolador de Dados', href: '/tools/dice-roller', icon: Dices, colorHue: 210 },
  { label: 'Rastreador de Combate', href: '/gm/combat-tracker', icon: Swords, colorHue: 0 },
  { label: 'Geradores', href: '/tools/generator', icon: FlaskConical, colorHue: 120 },
  { label: 'Mesa de Som', href: '/soundboard', icon: Volume2, colorHue: 300 },
];

export const profileLink = {
  label: 'Perfil',
  href: '/profile',
  icon: () => (
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@shadcn" data-ai-hint="fantasy wizard" />
      <AvatarFallback>GM</AvatarFallback>
    </Avatar>
  ),
  colorHue: 0
};

const Book = ({ link, isActive }: { link: {label: string, href: string, icon: LucideIcon | (() => JSX.Element), colorHue: number }, isActive: boolean }) => {
    const Icon = link.icon;
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={link.href} className="relative group/book">
                        <motion.div 
                            className="relative w-14 h-14"
                            whileHover="hover"
                            animate={isActive ? "active" : "inactive"}
                        >
                            {/* Efeito de Brilho */}
                            <motion.div
                                className="absolute -inset-1 rounded-lg"
                                style={{
                                    backgroundColor: `hsl(${link.colorHue}, 90%, 70%)`,
                                    boxShadow: `0 0 15px hsl(${link.colorHue}, 90%, 70%)`
                                }}
                                variants={{
                                    inactive: { opacity: 0 },
                                    active: { opacity: 0.7 },
                                    hover: { opacity: 0.6 }
                                }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Lombada do Livro */}
                            <div 
                                className="absolute left-0 top-0 h-full w-[18px] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-l-md transform-gpu"
                                style={{ 
                                    backgroundColor: `hsl(${link.colorHue}, 40%, 30%)`,
                                    borderRight: `2px solid hsl(${link.colorHue}, 20%, 15%)`,
                                }}
                            />
                            
                            {/* Capa do Livro */}
                            <motion.div 
                                className="absolute right-0 top-0 h-full w-[calc(100%-12px)] origin-left flex items-center justify-center rounded-r-md"
                                style={{ 
                                    backgroundColor: `hsl(${link.colorHue}, 20%, 10%)`,
                                    borderTop: `2px solid hsl(${link.colorHue}, 20%, 15%)`,
                                    borderBottom: `2px solid hsl(${link.colorHue}, 20%, 15%)`,
                                    borderRight: `2px solid hsl(${link.colorHue}, 20%, 15%)`,
                                }}
                                variants={{
                                    inactive: { rotateY: 0 },
                                    active: { rotateY: -30 },
                                    hover: { rotateY: -60 }
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <Icon className={cn("h-6 w-6 text-neutral-400 transition-colors duration-300 group-hover/book:text-white", isActive && "text-white")} />
                            </motion.div>
                        </motion.div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{link.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export function SidebarNav() {
    const pathname = usePathname();

    return (
      <div className="fixed top-0 left-0 h-full w-20 flex flex-col items-center gap-4 z-50 py-4 bg-card border-r" style={{ perspective: '1000px' }}>
          <Link href="/dashboard" className='px-4'>
            <Icons.logo className="h-8 w-8 text-primary" />
          </Link>
          
          <ScrollArea className="w-full px-2">
            <div className="flex flex-col items-center gap-4 py-2">
                {mainLinks.map(link => (
                    <Book
                        key={link.href}
                        link={link}
                        isActive={pathname.startsWith(link.href)} />
                ))}
            
                <div className='h-4' />

                {gmToolsLinks.map(link => (
                    <Book
                        key={link.href}
                        link={link}
                        isActive={pathname.startsWith(link.href)} />
                ))}
            </div>
          </ScrollArea>
          
          <div className='flex-grow'></div>
          <nav className="flex flex-col items-center gap-4">
              <Book link={{...profileLink, icon: Settings, colorHue: 240}} isActive={pathname.startsWith('/settings')} />
              <Book link={{...profileLink, colorHue: 0}} isActive={pathname.startsWith(profileLink.href)} />
          </nav>
      </div>
  );
}
