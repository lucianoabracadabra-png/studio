'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, PenTool, Cloud, Layers, Swords, Settings, LucideIcon, Hand } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { VttTool } from './vtt-layout';

interface VttToolbarProps {
    activeTool: VttTool | null;
    onToolToggle: (tool: VttTool | null) => void;
}

const tools: { id: VttTool, label: string, icon: LucideIcon }[] = [
    { id: 'pan', label: 'Selecionar & Mover', icon: Hand },
    { id: 'tokens', label: 'Tokens', icon: Users },
    { id: 'drawing', label: 'Desenho e Medição', icon: PenTool },
    { id: 'fog', label: 'Névoa de Guerra', icon: Cloud },
    { id: 'layers', label: 'Camadas do Mapa', icon: Layers },
    { id: 'combat', label: 'Rastreador de Combate', icon: Swords },
];

const settingsTool = { id: 'settings' as VttTool, label: 'Configurações', icon: Settings };

export function VttToolbar({ activeTool, onToolToggle }: VttToolbarProps) {
    
    const currentActiveTool = activeTool === null ? 'pan' : activeTool;

    const handleToolClick = (toolId: VttTool) => {
        if (toolId === 'pan') {
            onToolToggle(null);
        } else {
            onToolToggle(toolId);
        }
    };

    return (
        <div className='absolute top-0 left-0 h-full w-16 bg-card border-r flex flex-col items-center p-2 gap-2 z-20'>
            {tools.map(tool => (
                <TooltipProvider key={tool.id}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={currentActiveTool === tool.id ? 'default' : 'ghost'} 
                                size="icon" 
                                onClick={() => handleToolClick(tool.id)}
                                className="h-12 w-12"
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

            <div className="flex-grow" />
            <Separator className="w-8" />
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={currentActiveTool === settingsTool.id ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => handleToolClick(settingsTool.id)}
                            className="h-12 w-12"
                        >
                            <settingsTool.icon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{settingsTool.label}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
