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
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="fixed left-0 top-0 h-full z-40 flex flex-col items-center w-20 py-4">
       <Link href="/dashboard" className="flex items-center justify-center mb-4 flex-shrink-0">
          <Icons.logo className="h-10 w-10 text-primary" />
        </Link>
      <ScrollArea className="w-full" type="never">
        <TooltipProvider>
          <div className="flex flex-col items-center gap-4 py-4">
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
                        {link.href === '/dashboard' ? null : <link.icon className="w-6 h-6 text-white/80" />}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>

            <div className="h-px w-8 bg-white/20" />

            <nav className="flex flex-col items-center gap-2">
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
          </div>
        </TooltipProvider>
      </ScrollArea>
    </div>
  );
}
