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
  ScrollText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { Book } from './book';
import React from 'react';
import navData from '@/lib/data/navigation.json';

const iconMap: { [key: string]: LucideIcon } = {
  LayoutDashboard,
  Users,
  Map,
  BookOpen,
  Dices,
  Swords,
  FlaskConical,
  Volume2,
  Settings,
  ScrollText,
};


export const profileLink = {
  label: 'Perfil',
  href: '/profile',
  icon: () => (
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@shadcn" data-ai-hint="fantasy wizard" />
      <AvatarFallback>GM</AvatarFallback>
    </Avatar>
  ),
  colorHue: '0 0% 0%'
};

export function SidebarNav({ activeColorHue }: { activeColorHue: string }) {
    const pathname = usePathname();

    const logoStyle = {
        color: `hsl(${activeColorHue})`,
    } as React.CSSProperties;

    return (
      <div className="fixed top-0 left-0 h-full w-20 flex flex-col items-center gap-4 z-50 py-4 bg-card border-r" style={{ perspective: '1000px' }}>
          <Link href="/dashboard" className='px-4'>
            <Icons.logo className="h-8 w-8 transition-colors duration-500" style={logoStyle} />
          </Link>
          
          <ScrollArea className="w-full px-2">
            <div className="flex flex-col items-center gap-4 py-2">
                {navData.mainLinks.map(link => {
                    const Icon = iconMap[link.icon];
                    return (
                        <Link href={link.href} key={link.id}>
                            <Book
                                label={link.label}
                                icon={Icon}
                                colorHsl={link.colorHue}
                                isActive={pathname.startsWith(link.href)}
                                showLabel={false}
                            />
                        </Link>
                    )
                })}
            
                <div className='h-4' />

                {navData.gmToolsLinks.map(link => {
                     const Icon = iconMap[link.icon];
                     return (
                        <Link href={link.href} key={link.id}>
                            <Book
                                label={link.label}
                                icon={Icon}
                                colorHsl={link.colorHue}
                                isActive={pathname.startsWith(link.href)}
                                showLabel={false}
                            />
                        </Link>
                    )
                })}
            </div>
          </ScrollArea>
          
          <div className='flex-grow'></div>
          <nav className="flex flex-col items-center gap-4">
              <Link href="/settings">
                <Book label="Configurações" icon={Settings} colorHsl={'240 10% 70%'} isActive={pathname.startsWith('/settings')} showLabel={false} />
              </Link>
              <Link href={profileLink.href}>
                <Book label={profileLink.label} icon={profileLink.icon} colorHsl={profileLink.colorHue} isActive={pathname.startsWith(profileLink.href)} showLabel={false} />
              </Link>
          </nav>
      </div>
  );
}
