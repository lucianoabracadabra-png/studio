'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, MousePointer, Ruler, Cloud, Pen, Zap } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { VttTool } from './vtt-layout';

interface VttToolbarProps {
    activeTool: VttTool;
    onToolSelect: (tool: VttTool) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onCenter: () => void;
    zoomLevel: number;
}

const mainTools: { id: VttTool, label: string, icon: React.ElementType }[] = [
    { id: 'select', label: 'Selecionar & Mover', icon: MousePointer },
    { id: 'measure', label: 'Medir Distância', icon: Ruler },
    { id: 'fog', label: 'Névoa de Guerra', icon: Cloud },
    { id: 'draw', label: 'Desenhar', icon: Pen },
    { id: 'ping', label: 'Pingar no Mapa', icon: Zap },
]

export function VttToolbar({ activeTool, onToolSelect, onZoomIn, onZoomOut, onCenter, zoomLevel }: VttToolbarProps) {
    return (
        <div className='h-full w-16 bg-card/90 border-r border-white/10 flex flex-col items-center p-2 gap-2'>
            {mainTools.map(tool => (
                <TooltipProvider key={tool.id}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={activeTool === tool.id ? 'secondary' : 'ghost'} 
                                size="icon" 
                                onClick={() => onToolSelect(tool.id)}
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
            <div className='flex-grow' />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon" onClick={onZoomIn} className="h-10 w-10"><ZoomIn /></Button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Aproximar</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="font-mono text-xs p-1 rounded-md bg-muted">{Math.round(zoomLevel * 100)}%</div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onZoomOut} className="h-10 w-10"><ZoomOut /></Button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Afastar</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onCenter} className="h-10 w-10"><Maximize /></Button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Centralizar Mapa</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
