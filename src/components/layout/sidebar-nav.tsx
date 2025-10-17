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
import { useEffect, useState, useRef } from 'react';
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
    allLinks.forEach(link => {
        const isActive = activePath?.startsWith(link.href);
        initialState[link.href] = isActive ? 'on' : 'off';
    });
    return initialState;
}

const Book = ({ 
    link, 
    animationState,
    onClick 
}: { 
    link: (typeof mainLinks)[0], 
    animationState: AnimationState,
    onClick: (href: string) => void,
}) => {
    const Icon = link.icon;
    const isTool = gmToolsLinks.some(l => l.href === link.href) || profileLink.some(l => l.href === link.href);
    
    const [animationDelay, setAnimationDelay] = useState('0s');

    useEffect(() => {
        setAnimationDelay(`${Math.random() * 2}s`);
    }, []);

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
                              isTool ? 'tool-book' : 'main-book',
                              animationState,
                            )}
                            style={{ '--book-color-hue': `${link.colorHue}` } as React.CSSProperties}
                            aria-current={animationState === 'on' ? 'page' : undefined}
                        >
                            <Icon className={cn( "w-6 h-6 text-white/80 transition-all", animationState !== 'off' && 'active-icon' )} />
                             <span className="book-title">{link.title}</span>
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
    const [isPageLoading, setIsPageLoading] = useState(false);

    // Effect to set initial state based on path, and handle manual url changes
    useEffect(() => {
        setBookStates(getInitialState(pathname));
    }, [pathname]);


    // Effect to manage animation state machine
    useEffect(() => {
        const timeouts: NodeJS.Timeout[] = [];

        Object.entries(bookStates).forEach(([href, state]) => {
            if (state === 'growing') {
                const t = setTimeout(() => {
                    setBookStates(prev => ({...prev, [href]: 'holding'}));
                }, 1000);
                timeouts.push(t);
            } else if (state === 'climax') {
                const t = setTimeout(() => {
                    setBookStates(prev => ({...prev, [href]: 'decaying-on'}));
                }, 1000);
                timeouts.push(t);
            } else if (state === 'decaying-on') {
                const t = setTimeout(() => {
                    setBookStates(prev => ({...prev, [href]: 'on'}));
                }, 1000);
                 timeouts.push(t);
            } else if (state === 'decaying-off') {
                 const t = setTimeout(() => {
                    setBookStates(prev => ({...prev, [href]: 'off'}));
                }, 1000);
                 timeouts.push(t);
            }
        });

        return () => {
            timeouts.forEach(clearTimeout);
        };

    }, [bookStates]);

     // Effect to trigger climax after page load
    useEffect(() => {
        if (isPageLoading) return; // Don't run on the initial page load event
        
        const holdingBookHref = Object.keys(bookStates).find(href => bookStates[href] === 'holding');

        if (holdingBookHref && pathname.startsWith(holdingBookHref)) {
             setBookStates(prev => ({ ...prev, [holdingBookHref]: 'climax' }));
        }

    }, [isPageLoading, pathname, bookStates]);
    
    const handleLinkClick = (href: string) => {
        if (pathname.startsWith(href) || isPageLoading) return;

        setIsPageLoading(true);
        router.push(href);

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

    useEffect(() => {
        // This effect runs when the page navigation is complete.
        if (isPageLoading) {
            setIsPageLoading(false);
        }
    }, [pathname, isPageLoading]);


    const renderBook = (link: any) => {
      return <Book 
          key={link.href}
          link={link}
          animationState={bookStates[link.href] || 'off'}
          onClick={handleLinkClick}
      />
    };

    return (
        <div className="fixed top-0 left-0 h-full w-24 flex flex-col items-center z-50 overflow-visible">
            <nav className="flex flex-col items-center gap-4 py-4">
                {mainLinks.map(renderBook)}
                {gmToolsLinks.map(renderBook)}
                {profileLink.map(renderBook)}
            </nav>
        </div>
    );
}
