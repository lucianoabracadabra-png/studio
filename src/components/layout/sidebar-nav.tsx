
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

const bassuraImage = PlaceHolderImages.find(p => p.id === 'character-bassura');

export const profileLink = {
  label: 'Perfil',
  href: '/profile',
  icon: () => (
    <Avatar className="h-8 w-8">
      <AvatarImage src={bassuraImage?.imageUrl} alt="Bassura Ambasiore" data-ai-hint={bassuraImage?.imageHint} />
      <AvatarFallback>BA</AvatarFallback>
    </Avatar>
  ),
  colorHue: '0 0% 0%'
};

export function SidebarNav({ activeColorHue }: { activeColorHue: string }) {
    const pathname = usePathname();

    const logoStyle = {
        color: `hsl(${activeColorHue})`,
    } as React.CSSProperties;

    const sidebarStyle = {
        borderColor: `hsl(${activeColorHue})`,
        boxShadow: `5px 0 25px -5px hsl(${activeColorHue} / 0.7)`,
        transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
    } as React.CSSProperties;

    return (
      <div className="fixed top-0 left-0 h-full w-20 flex flex-col items-center z-50 py-4 border-r-4" style={{ ...sidebarStyle, perspective: '1000px' }}>
          <Link href="/dashboard" className='px-4 pb-4 flex-shrink-0'>
            <Icons.logo className="h-8 w-8 transition-colors duration-500" style={logoStyle} />
          </Link>
          
          <ScrollArea className="w-full px-2 flex-grow">
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
              
              <div className="sticky bottom-0 bg-card/50 backdrop-blur-sm py-2 flex flex-col items-center gap-4">
                  <Link href="/settings">
                    <Book label="Configurações" icon={Settings} colorHsl={'240 10% 70%'} isActive={pathname.startsWith('/settings')} showLabel={false} />
                  </Link>
                  <Link href={profileLink.href}>
                    <Book label={profileLink.label} icon={profileLink.icon} colorHsl={profileLink.colorHue} isActive={pathname.startsWith(profileLink.href)} showLabel={false} />
                  </Link>
              </div>
          </ScrollArea>
      </div>
  );
}
