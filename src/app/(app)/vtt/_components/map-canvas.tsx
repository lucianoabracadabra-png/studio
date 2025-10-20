'use client';

import React, { useRef, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Token } from './token';
import type { Token as TokenType, VttState, Point } from './vtt-layout';
import type { VttTool } from './vtt-layout';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MapCanvasProps {
  tokens: TokenType[];
  activeTokenId?: number;
  onTokenDragEnd: (id: number, info: PanInfo) => void;
  mapState: VttState['map'];
  setMapState: React.Dispatch<React.SetStateAction<VttState['map']>>;
  activeTool: VttTool;
  layers: VttState['layers'];
  drawingPoints: Point[];
  setDrawingPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  drawingDistance: number;
  setDrawingDistance: React.Dispatch<React.SetStateAction<number>>;
}

const GridLayer = ({ gridSize, mapDimensions }: { gridSize: number, mapDimensions: { width: number, height: number }}) => {
    const gridId = React.useId();
    return (
        <svg width="100%" height="100%" className="absolute top-0 left-0 pointer-events-none">
            <defs>
                <pattern id={gridId} width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                    <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width={mapDimensions.width} height={mapDimensions.height} fill={`url(#${gridId})`} />
        </svg>
    )
}

const DrawingLayer = ({ 
    points, 
    setPoints, 
    mapZoom, 
    activeTool,
    setDistance
}: { 
    points: Point[], 
    setPoints: React.Dispatch<React.SetStateAction<Point[]>>, 
    mapZoom: number,
    activeTool: VttTool,
    setDistance: React.Dispatch<React.SetStateAction<number>>
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const PIXELS_PER_UNIT = 50; // 50 pixels = 1.5m (or 5ft)
    const UNIT_NAME = 'm';
    const UNIT_CONVERSION = 1.5;

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (activeTool !== 'draw') return;
        setIsDrawing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const newPoint = {
            x: (e.clientX - rect.left) / mapZoom,
            y: (e.clientY - rect.top) / mapZoom,
        };
        setPoints([newPoint]);
        setDistance(0);
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDrawing || activeTool !== 'draw') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const newPoint = {
            x: (e.clientX - rect.left) / mapZoom,
            y: (e.clientY - rect.top) / mapZoom,
        };
        setPoints(prev => [...prev, newPoint]);
    };
    
    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

    const ticks = [];
    let accumulatedLength = 0;
    for (let i = 1; i < points.length; i++) {
        const p1 = points[i-1];
        const p2 = points[i];
        const segmentLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

        if (accumulatedLength + segmentLength >= PIXELS_PER_UNIT) {
            const overflow = (accumulatedLength + segmentLength) - PIXELS_PER_UNIT;
            const ratio = (PIXELS_PER_UNIT - accumulatedLength) / segmentLength;
            const tickX = p1.x + (p2.x - p1.x) * ratio;
            const tickY = p1.y + (p2.y - p1.y) * ratio;
            ticks.push({x: tickX, y: tickY});
            accumulatedLength = overflow;
        } else {
            accumulatedLength += segmentLength;
        }
    }
    
    React.useEffect(() => {
        let totalLength = 0;
        for (let i = 1; i < points.length; i++) {
            const p1 = points[i-1];
            const p2 = points[i];
            totalLength += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }
        const calculatedDistance = (totalLength / PIXELS_PER_UNIT) * UNIT_CONVERSION;
        setDistance(calculatedDistance);
    }, [points, setDistance, PIXELS_PER_UNIT, UNIT_CONVERSION]);


    return (
        <svg 
            className="absolute top-0 left-0 w-full h-full"
            style={{ cursor: activeTool === 'draw' ? 'crosshair' : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <g style={{ transform: `scale(${mapZoom})` }}>
                <path d={pathData} strokeWidth={3 / mapZoom} stroke="hsl(var(--accent))" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px hsl(var(--accent)))`}} />
                {ticks.map((tick, i) => (
                    <line key={i} x1={tick.x - 5/mapZoom} y1={tick.y} x2={tick.x + 5/mapZoom} y2={tick.y} stroke="hsl(var(--accent))" strokeWidth={4/mapZoom} transform={`rotate(90 ${tick.x} ${tick.y})`} />
                ))}
            </g>
        </svg>
    );
};


const DrawingToolbar = ({ onClear, distance }: { onClear: () => void, distance: number }) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <Card className="glassmorphic-card flex items-center gap-4 p-2">
                <Button onClick={onClear} variant="destructive" size="icon">
                    <Eraser />
                </Button>
                <div className='flex items-baseline gap-2'>
                    <span className='text-muted-foreground text-sm'>Distância:</span>
                    <span className='font-bold font-mono text-lg'>{distance.toFixed(1)}m</span>
                </div>
            </Card>
        </div>
    )
}

export function MapCanvas({ tokens, activeTokenId, onTokenDragEnd, mapState, setMapState, activeTool, layers, drawingPoints, setDrawingPoints, drawingDistance, setDrawingDistance }: MapCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleMapDrag = (event: any, info: any) => {
    if(activeTool === 'select' || activeTool === 'measure') {
        const currentPosition = mapState.position;
        setMapState(prev => ({ ...prev, position: { x: currentPosition.x + info.delta.x, y: currentPosition.y + info.delta.y }}));
    }
  };
  
  const getCursor = () => {
    switch (activeTool) {
      case 'select': return 'grab';
      case 'measure': return 'crosshair';
      case 'fog': return 'cell';
      case 'draw': return 'crosshair';
      case 'ping': return 'pointer';
      default: return 'default';
    }
  }

  const isPanDisabled = activeTool !== 'select' && activeTool !== 'measure';

  return (
    <div ref={canvasRef} className="flex-grow w-full h-full bg-background/80 overflow-hidden relative" style={{ cursor: getCursor() }}>
      <motion.div
        drag={!isPanDisabled}
        dragMomentum={false}
        onDrag={handleMapDrag}
        className={cn("absolute top-0 left-0", !mapState.url && "grass-texture")}
        style={{ 
          x: mapState.position.x, 
          y: mapState.position.y,
          scale: mapState.zoom,
          width: mapState.dimensions.width,
          height: mapState.dimensions.height,
        }}
      >
        {mapState.url && <Image 
          src={mapState.url} 
          alt="VTT Map" 
          width={mapState.dimensions.width}
          height={mapState.dimensions.height}
          className="absolute top-0 left-0 object-cover select-none"
          priority
          draggable={false}
        />}

        {layers.isGridVisible && <GridLayer gridSize={50} mapDimensions={mapState.dimensions} />}

        <div className="absolute top-0 left-0 w-full h-full">
          {tokens.map(token => (
            <Token
              key={token.id}
              id={token.id}
              name={token.name}
              imageUrl={token.imageUrl}
              color={token.color}
              initialPosition={token.position}
              onDragEnd={onTokenDragEnd}
              mapZoom={mapState.zoom}
              shape={token.shape}
              isActive={token.id === activeTokenId}
            />
          ))}
        </div>
      </motion.div>
      <DrawingLayer points={drawingPoints} setPoints={setDrawingPoints} mapZoom={mapState.zoom} activeTool={activeTool} setDistance={setDrawingDistance} />
      {activeTool === 'draw' && <DrawingToolbar onClear={() => setDrawingPoints([])} distance={drawingDistance} />}
    </div>
  );
}
