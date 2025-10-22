'use client';

import React, { useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Token } from './token';
import { DrawingLayer } from './drawing-layer';
import type { Token as TokenType, VttState } from './vtt-layout';
import type { DraftShape } from './drawing-layer';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MapCanvasProps {
  tokens: TokenType[];
  activeTokenId?: number;
  onTokenDragEnd: (id: number, info: PanInfo) => void;
  mapState: VttState['map'];
  setMapState: React.Dispatch<React.SetStateAction<VttState['map']>>;
  layers: VttState['layers'];
  drawingState: VttState['drawing'];
  onAddShape: (shape: DraftShape) => void;
  isPanEnabled: boolean;
  isTokenInteractionEnabled: boolean;
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

export function MapCanvas({ 
    tokens, 
    activeTokenId, 
    onTokenDragEnd, 
    mapState, 
    setMapState, 
    layers, 
    drawingState, 
    onAddShape,
    isPanEnabled,
    isTokenInteractionEnabled,
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleMapDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if(isPanEnabled) {
        setMapState(prev => ({ ...prev, position: { x: prev.position.x + info.delta.x, y: prev.position.y + info.delta.y }}));
    }
  };
  
  const getCursor = () => {
    if (drawingState.activeTool) return 'crosshair';
    if (isPanEnabled) return 'grab';
    return 'default';
  }

  return (
    <div ref={canvasRef} className="flex-grow w-full h-full bg-background/80 overflow-hidden relative" style={{ cursor: getCursor() }}>
      <motion.div
        drag={isPanEnabled}
        dragMomentum={false}
        onDrag={handleMapDrag}
        onDragStart={() => {
            if(isPanEnabled) document.body.style.cursor = 'grabbing';
        }}
        onDragEnd={() => {
            if(isPanEnabled) document.body.style.cursor = 'grab';
        }}
        className={cn(
            "absolute top-0 left-0", 
            !mapState.url && "grass-texture"
        )}
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
        
        {/* Placeholder for saved shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Render saved shapes here in the future */}
        </div>

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
              isDraggingDisabled={!isTokenInteractionEnabled || !!drawingState.activeTool}
            />
          ))}
        </div>

         <DrawingLayer 
            width={mapState.dimensions.width}
            height={mapState.dimensions.height}
            activeDrawingTool={drawingState.activeTool}
            drawingOptions={drawingState.options}
            onShapeAdd={onAddShape}
        />

      </motion.div>
    </div>
  );
}
