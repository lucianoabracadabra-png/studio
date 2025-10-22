'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Circle, Square, Milestone, Pen, Ruler, Trash2 } from 'lucide-react';
import type { VttState, DrawingToolType } from '../vtt-layout';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface DrawingPanelProps {
    vttState: VttState;
    setVttState: React.Dispatch<React.SetStateAction<VttState>>;
}

export function DrawingPanel({ vttState, setVttState }: DrawingPanelProps) {
    const { drawing } = vttState;

    const handleToolSelect = (tool: DrawingToolType) => {
        setVttState(prev => ({
            ...prev,
            drawing: {
                ...prev.drawing,
                activeTool: prev.drawing.activeTool === tool ? null : tool,
            },
        }));
    };

    const handleColorChange = (color: string) => {
        setVttState(prev => ({
            ...prev,
            drawing: { ...prev.drawing, options: { ...prev.drawing.options, color } },
        }));
    };

    const handleFillToggle = (filled: boolean) => {
        setVttState(prev => ({
            ...prev,
            drawing: { ...prev.drawing, options: { ...prev.drawing.options, fill: filled } },
        }));
    };

    const clearDrawings = () => {
         setVttState(prev => ({
            ...prev,
            drawing: { ...prev.drawing, shapes: [] },
        }));
    }

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

    return (
        <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Desenho e Medição</h3>
            
            <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>Formas</p>
                <div className='grid grid-cols-3 gap-2'>
                    <ToolButton label="Círculo" icon={Circle} onClick={() => handleToolSelect('circle')} isActive={drawing.activeTool === 'circle'} />
                    <ToolButton label="Quadrado" icon={Square} onClick={() => handleToolSelect('square')} isActive={drawing.activeTool === 'square'} />
                    <ToolButton label="Cone" icon={Milestone} onClick={() => handleToolSelect('cone')} isActive={drawing.activeTool === 'cone'} isDisabled />
                </div>
            </div>

            <Separator className='my-4' />

            <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>Ferramentas</p>
                 <div className='grid grid-cols-3 gap-2'>
                    <ToolButton label="Desenho Livre" icon={Pen} onClick={() => handleToolSelect('freehand')} isActive={drawing.activeTool === 'freehand'} />
                    <ToolButton label="Régua" icon={Ruler} onClick={() => handleToolSelect('ruler')} isActive={drawing.activeTool === 'ruler'} />
                </div>
            </div>
            
            <Separator className='my-4' />

            <div className='space-y-4'>
                 <p className='text-sm text-muted-foreground'>Opções</p>
                 <div className='space-y-2'>
                    <Label>Cor</Label>
                    <div className='flex flex-wrap gap-2'>
                        {colors.map(color => (
                            <button
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={cn('w-7 h-7 rounded-full border-2 transition-all',
                                    drawing.options.color === color ? 'border-ring scale-110' : 'border-transparent'
                                )}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="fill-shape" checked={drawing.options.fill} onCheckedChange={handleFillToggle} />
                    <Label htmlFor="fill-shape">Preencher Forma</Label>
                 </div>
            </div>

            <Separator className='my-4' />
            
            <Button variant='destructive' className='w-full' onClick={clearDrawings}>
                <Trash2 className='mr-2' />
                Limpar Desenhos
            </Button>
        </div>
    );
}

interface ToolButtonProps {
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    isActive: boolean;
    isDisabled?: boolean;
}
function ToolButton({ label, icon: Icon, onClick, isActive, isDisabled }: ToolButtonProps) {
    return (
        <Button 
            variant='outline' 
            className={cn(
                'w-full h-20 flex-col gap-1 hover:bg-muted',
                isActive && 'bg-primary/20 border-primary',
                isDisabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={onClick}
            disabled={isDisabled}
        >
            <Icon className='w-6 h-6' />
            <span className='text-xs'>{label}</span>
        </Button>
    );
}
