'use client';

import React, { useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Token } from './token';
import { DrawingLayer } from './drawing-layer';
import type { Token as TokenType, VttState, Point, VttTool } from './vtt-layout';
import type { DraftShape } from './drawing-layer'; // Import DraftShape
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
  onAddShape: (shape: DraftShape) => void; // Correctly use DraftShape
  activeTool: VttTool | null;
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
    activeTool
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleMapDrag = (event: any, info: any) => {
    if(activeTool === 'select') {
        const currentPosition = mapState.position;
        setMapState(prev => ({ ...prev, position: { x: currentPosition.x + info.delta.x, y: currentPosition.y + info.delta.y }}));
    }
  };
  
  const getCursor = () => {
    if (drawingState.activeTool) return 'crosshair';
    if (activeTool === 'select') return 'grab';
    return 'default';
  }

  const isPanDisabled = activeTool !== 'select' || !!drawingState.activeTool;

  return (
    <div ref={canvasRef} className="flex-grow w-full h-full bg-background/80 overflow-hidden relative" style={{ cursor: getCursor() }}>
      <motion.div
        drag={!isPanDisabled}
        dragMomentum={false}
        onDrag={handleMapDrag}
        onDragStart={() => {
            if(activeTool === 'select') document.body.style.cursor = 'grabbing';
        }}
        onDragEnd={() => {
            if(activeTool === 'select') document.body.style.cursor = 'grab';
        }}
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
        
        <motion.div 
            className="absolute top-0 left-0"
            style={{
                width: mapState.dimensions.width,
                height: mapState.dimensions.height,
                x: -mapState.position.x / mapState.zoom,
                y: -mapState.position.y / mapState.zoom,
            }}
        >
            {drawingState.shapes.map(shape => (
                <div key={shape.id}></div>
            ))}
        </motion.div>

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
              isDraggingDisabled={!!drawingState.activeTool}
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
