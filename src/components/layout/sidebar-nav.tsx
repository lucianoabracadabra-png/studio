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
import { useEffect, useState, useRef, CSSProperties } from 'react';
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

type AnimationState = 'off' | 'growing' | 'holding' | 'climax' | 'decaying-on' | 'decaying-off' | 'on';
type BookStates = Record<string, AnimationState>;

const allLinks = [...mainLinks, ...gmToolsLinks, ...profileLink];

const getInitialState = (activePath: string | null): BookStates => {
    const initialState: BookStates = {};
    const activeLink = activePath ? [...allLinks].reverse().find(link => activePath.startsWith(link.href)) : null;
    
    allLinks.forEach(link => {
        initialState[link.href] = (activeLink && activeLink.href === link.href) ? 'on' : 'off';
    });
    return initialState;
}

const Book = ({ 
    link, 
    animationState,
    onClick,
    isTool
}: { 
    link: (typeof mainLinks)[0], 
    animationState: AnimationState,
    onClick: (href: string) => void,
    isTool?: boolean;
}) => {
    const Icon = link.icon;
    const isProfile = profileLink.some(l => l.href === link.href);

    const animationStyle: CSSProperties = {};
    let isSpinning = false;
    
    switch(animationState) {
        case 'growing':
            isSpinning = true;
            animationStyle['--book-rotation-duration'] = '1s';
            animationStyle['--book-rotation-count'] = 2;
            animationStyle['--book-animation-state'] = 'running';
            break;
        case 'climax':
            isSpinning = true;
            animationStyle['--book-rotation-duration'] = '1s';
            animationStyle['--book-rotation-count'] = 4;
            animationStyle['--book-animation-state'] = 'running';
            break;
        case 'decaying-on':
        case 'decaying-off':
            isSpinning = true;
            animationStyle['--book-rotation-duration'] = '1s';
            animationStyle['--book-rotation-count'] = 1;
            animationStyle['--book-animation-state'] = 'running';
            break;
        case 'holding':
        case 'on':
        case 'off':
            isSpinning = false;
            animationStyle['--book-animation-state'] = 'paused';
            break;
    }

    return (
        <TooltipProvider key={link.href}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="book-wrapper">
                        <Link
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                onClick(link.href);
                            }}
                            className={cn(
                              'book-nav-item',
                              isTool && 'book-nav-item--tool',
                              animationState,
                              isSpinning && 'spinning'
                            )}
                            style={{ 
                                '--book-color-hue': `${link.colorHue}`,
                                ...animationStyle 
                            } as React.CSSProperties}
                            aria-current={animationState === 'on' ? 'page' : undefined}
                        >
                           <div className='book-cover'>
                               <div className={cn("book-icon w-6 h-6 flex items-center justify-center")}>
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


export function SidebarNav({ activePath }: { activePath: string | null }) {
    const router = useRouter();
    const pathname = usePathname();
    const [bookStates, setBookStates] = useState<BookStates>(() => getInitialState(activePath));
    const [isNavigating, setIsNavigating] = useState(false);
    const destinationRef = useRef<string | null>(null);

    // Effect to handle state transitions after animations complete
    useEffect(() => {
        const timeouts: NodeJS.Timeout[] = [];
        let navigationTriggered = false;

        Object.entries(bookStates).forEach(([href, state]) => {
            if (state === 'growing') {
                const t = setTimeout(() => setBookStates(prev => ({...prev, [href]: 'holding'})), 1000);
                timeouts.push(t);
            } else if (state === 'holding') {
                if (href === destinationRef.current && !navigationTriggered) {
                    navigationTriggered = true;
                    router.push(href);
                }
            } else if (state === 'climax') {
                const t = setTimeout(() => {
                    setBookStates(prev => ({...prev, [href]: 'decaying-on'}));
                    setIsNavigating(false);
                    destinationRef.current = null;
                }, 1000);
                timeouts.push(t);
            } else if (state === 'decaying-on') {
                const t = setTimeout(() => setBookStates(prev => ({...prev, [href]: 'on'})), 1000);
                timeouts.push(t);
            } else if (state === 'decaying-off') {
                const t = setTimeout(() => setBookStates(prev => ({...prev, [href]: 'off'})), 1000);
                timeouts.push(t);
            }
        });

        return () => timeouts.forEach(clearTimeout);
    }, [bookStates, router]);

    // Effect to trigger climax after page load completes
    useEffect(() => {
        if (destinationRef.current && pathname === destinationRef.current && !isNavigating) {
             setBookStates(prev => {
                const newStates = {...prev};
                if (newStates[destinationRef.current!] === 'holding') {
                    newStates[destinationRef.current!] = 'climax';
                }
                return newStates;
            });
        }
    }, [pathname, isNavigating]);

    const handleLinkClick = (href: string) => {
        if (pathname === href || isNavigating) return;

        setIsNavigating(true);
        destinationRef.current = href;

        setBookStates(prevStates => {
            const newStates = { ...prevStates };
            const currentOnBook = Object.keys(prevStates).find(key => prevStates[key] === 'on');
            
            if (currentOnBook) {
                newStates[currentOnBook] = 'decaying-off';
            }
            
            newStates[href] = 'growing';
            return newStates;
        });
    };

    const renderBook = (link: any, isTool: boolean = false) => {
      return <Book 
          key={link.href}
          link={link}
          animationState={bookStates[link.href] || 'off'}
          onClick={handleLinkClick}
          isTool={isTool}
      />
    };

    return (
      <div className="fixed top-0 left-0 h-full w-24 flex flex-col items-center z-50 py-4 hide-scrollbar overflow-y-auto">
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
