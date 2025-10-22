'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Circle, Square, Milestone, Pen, Ruler } from 'lucide-react';
import type { VttState, DrawingToolType } from '../vtt-layout';
import { cn } from '@/lib/utils';

interface DrawingPanelProps {
    drawingState: VttState['drawing'];
    setDrawingState: (updater: React.SetStateAction<VttState['drawing']>) => void;
}

export function DrawingPanel({ drawingState, setDrawingState }: DrawingPanelProps) {

    const handleToolSelect = (tool: DrawingToolType) => {
        setDrawingState(prev => ({
            ...prev,
            activeTool: prev.activeTool === tool ? null : tool,
        }));
    };

    return (
        <div className="p-4 text-white">
            <h3 className="text-lg font-bold mb-4">Desenho e Medição</h3>
            
            <div className='space-y-2'>
                <p className='text-sm text-white/70'>Formas</p>
                <div className='grid grid-cols-3 gap-2'>
                    <ToolButton label="Círculo" icon={Circle} onClick={() => handleToolSelect('circle')} isActive={drawingState.activeTool === 'circle'} />
                    <ToolButton label="Quadrado" icon={Square} onClick={() => handleToolSelect('square')} isActive={drawingState.activeTool === 'square'} />
                    <ToolButton label="Cone" icon={Milestone} onClick={() => handleToolSelect('cone')} isActive={drawingState.activeTool === 'cone'} />
                </div>
            </div>

            <Separator className='my-4 bg-white/10' />

            <div className='space-y-2'>
                <p className='text-sm text-white/70'>Ferramentas</p>
                 <div className='grid grid-cols-3 gap-2'>
                    <ToolButton label="Desenho Livre" icon={Pen} onClick={() => handleToolSelect('freehand')} isActive={drawingState.activeTool === 'freehand'} />
                    <ToolButton label="Régua" icon={Ruler} onClick={() => handleToolSelect('ruler')} isActive={drawingState.activeTool === 'ruler'} />
                </div>
            </div>
            
            <Separator className='my-4 bg-white/10' />

            {/* Placeholder for options like color, fill, etc. */}
            <div className='space-y-2'>
                 <p className='text-sm text-white/70'>Opções</p>
                 <p className='text-xs text-center text-white/50'>Opções da ferramenta aparecerão aqui.</p>
            </div>
        </div>
    )
}

// A helper component for tool buttons
interface ToolButtonProps {
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    isActive: boolean;
}
function ToolButton({ label, icon: Icon, onClick, isActive }: ToolButtonProps) {
    return (
        <Button 
            variant='outline' 
            className={cn(
                'w-full h-20 flex-col gap-1 border-white/20 hover:bg-white/10 text-white',
                isActive && 'bg-cyan-400/20 border-cyan-400'
            )}
            onClick={onClick}
        >
            <Icon className='w-6 h-6' />
            <span className='text-xs'>{label}</span>
        </Button>
    )
}

export default DrawingPanel;
