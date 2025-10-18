'use client';

import React, { useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Token } from './token';
import type { Token as TokenType, VttState } from './vtt-layout';
import type { VttTool } from './vtt-layout';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MapCanvasProps {
  tokens: TokenType[];
  activeTokenId?: number;
  onTokenDragEnd: (id: number, info: PanInfo) => void;
  mapState: VttState['map'];
  setMapState: React.Dispatch<React.SetStateAction<VttState['map']>>;
  activeTool: VttTool;
  layers: VttState['layers'];
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

export function MapCanvas({ tokens, activeTokenId, onTokenDragEnd, mapState, setMapState, activeTool, layers }: MapCanvasProps) {
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
    </div>
  );
}
