'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  LayoutDashboard,
  Map,
  Swords,
  Users,
  FileText,
  Volume2,
  Dices,
  FlaskConical
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
import { useState, useEffect, useMemo } from 'react';

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
  const [activePath, setActivePath] = useState<string | null>(null);

  useEffect(() => {
    // Only set the active path after navigation occurs, not on initial load
    if (pathname && pathname !== '/_error' && pathname !== '/') {
      setActivePath(pathname);
    } else {
      setActivePath(null);
    }
  }, [pathname]);

  const animationStyles = useMemo(() => {
    const styles: { [key: string]: React.CSSProperties } = {};
    [...mainLinks, ...gmToolsLinks].forEach(link => {
      styles[link.href] = {
        '--animation-duration': `${(Math.random() * 4 + 6).toFixed(2)}s`,
        '--animation-delay': `${(Math.random() * -5).toFixed(2)}s`,
        '--float-x1': `${(Math.random() * 4 - 2).toFixed(2)}px`,
        '--float-y1': `${(Math.random() * 6 - 3).toFixed(2)}px`,
        '--float-x2': `${(Math.random() * 4 - 2).toFixed(2)}px`,
        '--float-y2': `${(Math.random() * 6 - 3).toFixed(2)}px`,
        '--float-x3': `${(Math.random() * 4 - 2).toFixed(2)}px`,
        '--float-y3': `${(Math.random() * 6 - 3).toFixed(2)}px`,
      } as React.CSSProperties;
    });
    return styles;
  }, []);


  return (
    <div className="fixed left-0 top-0 h-full z-40 flex flex-col items-center w-20 py-4">
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
                          activePath === link.href && 'active'
                        )}
                        style={{...animationStyles[link.href], '--book-color-hue': `${200 + index * 40}deg`} as React.CSSProperties}
                      >
                        <link.icon className="w-6 h-6 text-white/80 transition-all" />
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
                           activePath === link.href && 'active'
                        )}
                        style={{...animationStyles[link.href], '--book-color-hue': `${30 + index * 35}deg`} as React.CSSProperties}
                      >
                        <link.icon className="w-5 h-5 text-white/80 transition-all" />
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
      <div className="mt-auto flex flex-col items-center gap-4 py-4">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn("book-nav-item book-tool")} style={{'--book-color-hue': '0deg'} as React.CSSProperties}>
                         <Avatar className="h-9 w-9 border-2 border-white/50 avatar-glow">
                            <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@shadcn" data-ai-hint="fantasy wizard" />
                            <AvatarFallback>GM</AvatarFallback>
                        </Avatar>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Profile</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
