'use client';

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ZoomIn, ZoomOut, Maximize, MousePointer, Ruler, Cloud, Pen, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type VttTool = 'select' | 'measure' | 'fog' | 'draw' | 'ping';

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
    <div className="absolute top-1/2 -translate-y-1/2 left-4 flex flex-col items-center gap-2 p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-white/10 shadow-lg z-20">
      
      {mainTools.map(tool => (
         <TooltipProvider key={tool.id}>
            <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onToolSelect(tool.id)}
                    className={cn(activeTool === tool.id && "bg-primary/20 text-primary")}
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

      <Separator className="my-2" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onZoomOut}>
              <ZoomOut />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Diminuir Zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="font-mono text-xs px-2 w-16 text-center">{Math.round(zoomLevel * 100)}%</div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onZoomIn}>
              <ZoomIn />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Aumentar Zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onCenter}>
              <Maximize />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Centralizar Mapa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
