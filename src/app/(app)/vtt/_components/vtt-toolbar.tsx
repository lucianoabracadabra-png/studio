'use client';

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ZoomIn, ZoomOut, Search, Maximize } from "lucide-react";

interface VttToolbarProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onCenter: () => void;
    zoomLevel: number;
}

export function VttToolbar({ onZoomIn, onZoomOut, onCenter, zoomLevel }: VttToolbarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-white/10 shadow-lg">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onZoomOut}>
              <ZoomOut />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Diminuir Zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="font-mono text-sm px-2 w-16 text-center">{Math.round(zoomLevel * 100)}%</div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onZoomIn}>
              <ZoomIn />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
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
          <TooltipContent>
            <p>Centralizar Mapa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
