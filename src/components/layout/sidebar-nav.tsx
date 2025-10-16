'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  LayoutDashboard,
  Map,
  Swords,
  Users,
  WandSparkles,
  FileText,
  Volume2,
  Dices,
  FlaskConical
} from 'lucide-react';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const mainLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Characters', href: '/characters', icon: Users },
  { label: 'Virtual Tabletop', href: '/vtt', icon: Map },
  { label: 'Wiki', href: '/wiki', icon: BookOpen },
];

const gmToolsLinks = [
  { label: 'Dice Roller', href: '/tools/dice-roller', icon: Dices },
  { label: 'Combat Tracker', href: '/gm/combat-tracker', icon: Swords },
  { label: 'Generators', href: '/tools/generator', icon: FlaskConical },
  { label: 'Describer', href: '/tools/description-generator', icon: FileText },
  { label: 'Soundboard', href: '/tools/soundboard', icon: Volume2 },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full z-40 flex flex-col items-center w-20 bg-background/30 backdrop-blur-lg border-r border-white/10 py-4">
       <Link href="/dashboard" className="flex items-center justify-center mb-8">
          <Icons.logo className="h-10 w-10 text-primary" />
        </Link>
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-2">
          {mainLinks.map((link, index) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link href={link.href}>
                  <div
                    className={cn(
                      'book-nav-item',
                      pathname === link.href && 'active'
                    )}
                    style={{'--book-color-hue': `${200 + index * 40}deg`} as React.CSSProperties}
                  >
                    <link.icon className="w-6 h-6 text-white/80" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <div className="my-4 h-px w-8 bg-white/20" />

        <Tooltip>
           <TooltipTrigger>
                <WandSparkles className="w-8 h-8 text-accent/80" />
           </TooltipTrigger>
           <TooltipContent side="right">
                <p>GM Tools</p>
           </TooltipContent>
        </Tooltip>

         <nav className="flex flex-col items-center gap-2 mt-4">
          {gmToolsLinks.map((link, index) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link href={link.href}>
                  <div
                    className={cn(
                      'book-nav-item book-tool',
                      pathname === link.href && 'active'
                    )}
                    style={{'--book-color-hue': `${30 + index * 35}deg`} as React.CSSProperties}
                  >
                    <link.icon className="w-5 h-5 text-white/80" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </div>
  );
}
