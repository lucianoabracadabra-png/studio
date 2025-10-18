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
import { usePathname } from 'next/navigation';
import { Separator } from '../ui/separator';

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

const SidebarLink = ({ link, isActive }: { link: (typeof mainLinks)[0], isActive: boolean }) => {
    const Icon = link.icon;
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={link.href} className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
                        isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}>
                        <Icon className="w-6 h-6" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{link.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const ProfileLink = ({ link, isActive }: { link: typeof profileLink, isActive: boolean }) => {
    const Icon = link.icon;
    return (
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={link.href} className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                        isActive ? "ring-2 ring-primary" : ""
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
      <div className="fixed top-0 left-0 h-full w-20 flex flex-col items-center gap-4 z-50 py-4 bg-background border-r">
          <nav className="flex flex-col items-center gap-2">
              {mainLinks.map(link => (
                  <SidebarLink 
                    key={link.href} 
                    link={link} 
                    isActive={pathname.startsWith(link.href)} />
              ))}
          </nav>
          <Separator className='my-2 w-8' />
          <nav className="flex flex-col items-center gap-2">
              {gmToolsLinks.map(link => (
                  <SidebarLink 
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
