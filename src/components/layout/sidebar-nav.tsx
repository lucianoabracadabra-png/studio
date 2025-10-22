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

export const mainLinks = [
  { label: 'Painel', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Personagens', href: '/characters', icon: Users },
  { label: 'Mesa Virtual', href: '/vtt', icon: Map },
  { label: 'Wiki', href: '/wiki', icon: BookOpen },
];

export const gmToolsLinks = [
  { label: 'Rolador de Dados', href: '/tools/dice-roller', icon: Dices },
  { label: 'Rastreador de Combate', href: '/gm/combat-tracker', icon: Swords },
  { label: 'Geradores', href: '/tools/generator', icon: FlaskConical },
  { label: 'Mesa de Som', href: '/tools/soundboard', icon: Volume2 },
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
};

const NavLink = ({ link, isActive }: { link: {label: string, href: string, icon: LucideIcon | (() => JSX.Element)}, isActive: boolean }) => {
    const Icon = link.icon;
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={link.href} className="relative group">
                       <div
                            className={cn(
                                'w-12 h-12 flex items-center justify-center rounded-lg transition-colors',
                                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <Icon />
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


export function SidebarNav() {
    const pathname = usePathname();

    return (
      <div className="fixed top-0 left-0 h-full w-16 flex flex-col items-center gap-4 z-50 py-4 bg-card border-r">
          <Link href="/dashboard" className='px-4'>
            <Icons.logo className="h-8 w-8 text-primary" />
          </Link>
          
          <ScrollArea className="w-full">
            <div className="flex flex-col items-center gap-2 px-2 py-2">
                {mainLinks.map(link => (
                    <NavLink
                        key={link.href}
                        link={link}
                        isActive={pathname.startsWith(link.href)} />
                ))}
            
                <div className='h-4' />

                {gmToolsLinks.map(link => (
                    <NavLink
                        key={link.href}
                        link={link}
                        isActive={pathname.startsWith(link.href)} />
                ))}
            </div>
          </ScrollArea>
          
          <div className='flex-grow'></div>
          <nav>
              <NavLink link={profileLink} isActive={pathname.startsWith(profileLink.href)} />
          </nav>
      </div>
  );
}
