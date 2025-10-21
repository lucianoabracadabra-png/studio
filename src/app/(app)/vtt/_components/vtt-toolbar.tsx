'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, PenTool, Cloud, Layers, Swords, Settings, LucideIcon } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type VttTool = 'tokens' | 'drawing' | 'fog' | 'layers' | 'combat' | 'settings';

interface VttToolbarProps {
    activeTool: VttTool | null;
    onToolToggle: (tool: VttTool) => void;
}

const tools: { id: VttTool, label: string, icon: LucideIcon }[] = [
    { id: 'tokens', label: 'Tokens', icon: Users },
    { id: 'drawing', label: 'Desenho e Medição', icon: PenTool },
    { id: 'fog', label: 'Névoa de Guerra', icon: Cloud },
    { id: 'layers', label: 'Camadas do Mapa', icon: Layers },
    { id: 'combat', label: 'Rastreador de Combate', icon: Swords },
    { id: 'settings', label: 'Configurações', icon: Settings },
];

export function VttToolbar({ activeTool, onToolToggle }: VttToolbarProps) {
    return (
        <div className='absolute top-0 left-0 h-full w-16 bg-gray-900/80 border-r border-white/10 flex flex-col items-center p-2 gap-2 z-20'>
            {tools.map(tool => (
                <TooltipProvider key={tool.id}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={'ghost'} 
                                size="icon" 
                                onClick={() => onToolToggle(tool.id)}
                                className={cn(
                                    "h-12 w-12 text-white/70 hover:text-white hover:bg-white/10 transition-all",
                                    activeTool === tool.id && "text-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(74,222,222,0.5)]"
                                )}
                            >
                                <tool.icon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{tool.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    )
}
