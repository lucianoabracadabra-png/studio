'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Token } from './token';
import type { Token as TokenType, VttState } from './vtt-layout';
import Image from 'next/image';

interface MapCanvasProps {
  tokens: TokenType[];
  onTokenDragEnd: (id: number, newPosition: { x: number; y: number }) => void;
  mapState: VttState['map'];
  setMapState: React.Dispatch<React.SetStateAction<VttState['map']>>;
}

export function MapCanvas({ tokens, onTokenDragEnd, mapState, setMapState }: MapCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleDragEnd = (event: any, info: any) => {
    setMapState(prev => ({ ...prev, position: { x: info.point.x, y: info.point.y }}));
  };
  
  return (
    <div ref={canvasRef} className="flex-grow w-full h-full bg-background/80 overflow-hidden relative cursor-grab active:cursor-grabbing">
      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        className="w-full h-full relative"
        style={{ 
          x: mapState.position.x, 
          y: mapState.position.y,
          scale: mapState.zoom,
          width: mapState.dimensions.width,
          height: mapState.dimensions.height
        }}
      >
        {mapState.url && <Image 
          src={mapState.url} 
          alt="VTT Map" 
          width={mapState.dimensions.width}
          height={mapState.dimensions.height}
          className="absolute top-0 left-0 object-cover select-none pointer-events-none"
          priority
        />}

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
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
