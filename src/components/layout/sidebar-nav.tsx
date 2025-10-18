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
import { useEffect, useState, CSSProperties } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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

const allLinks = [...mainLinks, ...gmToolsLinks, ...profileLink];

type AnimationState = 'off' | 'growing' | 'holding' | 'climax' | 'decaying-on' | 'on' | 'decaying-off';

const Book = ({ 
    link, 
    isTool,
    visualState,
    isActive,
    onClick,
}: { 
    link: (typeof mainLinks)[0], 
    isTool?: boolean;
    visualState: AnimationState;
    isActive: boolean;
    onClick: () => void,
}) => {
    const Icon = link.icon;
    const isProfile = profileLink.some(l => l.href === link.href);
    const animationClass = isActive ? 'on' : visualState;

    return (
        <TooltipProvider key={link.href}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="book-wrapper">
                        <Link
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                onClick();
                            }}
                            className={cn(
                              'book-nav-item',
                              isTool && 'book-nav-item--tool',
                              animationClass
                            )}
                            style={{ 
                                '--book-color-hue': `${link.colorHue}`,
                            } as CSSProperties}
                            aria-current={isActive ? 'page' : undefined}
                        >
                           <div className='book-cover'>
                               <div className={cn("book-icon", isActive && 'on')}>
                                   {isProfile ? <Icon /> : <Icon className="w-full h-full" />}
                               </div>
                           </div>
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

export function SidebarNav({ activePath: initialActivePath }: { activePath: string | null }) {
    const router = useRouter();
    const pathname = usePathname();
    
    const [activeHref, setActiveHref] = useState<string | null>(null);
    const [visualStates, setVisualStates] = useState<Record<string, AnimationState>>(() => {
        const initialState: Record<string, AnimationState> = {};
        allLinks.forEach(link => {
            initialState[link.href] = 'off';
        });
        return initialState;
    });

    // Effect 1: Determine the true active link from the URL (source of truth)
     useEffect(() => {
        const mostSpecificLink = [...allLinks]
            .sort((a, b) => b.href.length - a.href.length)
            .find(link => pathname.startsWith(link.href) && link.href !== '/');
        
        const currentActiveHref = mostSpecificLink ? mostSpecificLink.href : null;

        if (currentActiveHref !== activeHref) {
            setVisualStates(prev => {
                const newStates = {...prev};
                // Turn off the old book
                if (activeHref && newStates[activeHref] !== 'off') {
                    newStates[activeHref] = 'decaying-off';
                }
                // Turn on the new book
                if (currentActiveHref) {
                    newStates[currentActiveHref] = 'growing';
                }
                return newStates;
            });
            setActiveHref(currentActiveHref);
        }

    }, [pathname]);

    // Effect 2: Manage the animation state machine based on visual state
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        
        Object.entries(visualStates).forEach(([href, state]) => {
            if (state === 'growing') {
                timers.push(setTimeout(() => setVisualStates(prev => ({ ...prev, [href]: 'holding' })), 1000));
            } else if (state === 'holding') {
                timers.push(setTimeout(() => setVisualStates(prev => ({ ...prev, [href]: 'climax' })), 2000));
            } else if (state === 'climax') {
                timers.push(setTimeout(() => setVisualStates(prev => ({ ...prev, [href]: 'decaying-on' })), 1000));
            } else if (state === 'decaying-on') {
                 timers.push(setTimeout(() => {
                    setVisualStates(prev => ({ ...prev, [href]: 'on' }));
                }, 1000));
            } else if (state === 'decaying-off') {
                timers.push(setTimeout(() => setVisualStates(prev => ({ ...prev, [href]: 'off' })), 1000));
            }
        });

        return () => timers.forEach(clearTimeout);
    }, [visualStates]);

    const handleLinkClick = (href: string) => {
        if (pathname === href) return;
        router.push(href);
    };

    const renderBook = (link: any, isTool: boolean = false) => (
        <Book 
            key={link.href}
            link={link}
            isTool={isTool}
            visualState={visualStates[link.href] || 'off'}
            isActive={activeHref === link.href && visualStates[link.href] === 'on'}
            onClick={() => handleLinkClick(link.href)}
        />
    );

    return (
      <div className="fixed top-0 left-0 h-full w-24 flex flex-col items-center justify-between z-50 py-4 hide-scrollbar overflow-y-auto">
          <nav className="flex flex-col items-center gap-4">
              {mainLinks.map(link => renderBook(link, false))}
          </nav>
          <div className="my-4 w-8 border-t border-white/20"></div>
          <nav className="flex flex-col items-center gap-4">
              {gmToolsLinks.map(link => renderBook(link, true))}
          </nav>
          <div className='flex-grow'></div>
          <nav className="flex flex-col items-center gap-4">
              {profileLink.map(link => renderBook(link, false))}
          </nav>
      </div>
  );
}
