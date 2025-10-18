'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { TokenShape } from './vtt-layout';

interface TokenProps {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  initialPosition: { x: number; y: number };
  onDragEnd: (id: number, position: { x: number; y: number }) => void;
  mapZoom: number;
  shape: TokenShape;
}

export function Token({ id, name, imageUrl, color, initialPosition, onDragEnd, mapZoom, shape }: TokenProps) {
  const tokenRef = useRef(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: any) => {
    onDragEnd(id, { x: info.point.x, y: info.point.y });
  };
  
  return (
    <motion.div
      ref={tokenRef}
      drag
      onDragEnd={handleDragEnd}
      style={{
        x: initialPosition.x,
        y: initialPosition.y,
        position: 'absolute',
        width: 50 / mapZoom,
        height: 50 / mapZoom,
      }}
      className="cursor-pointer flex flex-col items-center group"
    >
      <div 
        className={cn(
            "w-full h-full border-2 overflow-hidden transition-all duration-200 group-hover:shadow-lg",
            shape === 'circle' ? 'rounded-full' : 'rounded-md'
        )}
        style={{ borderColor: color, boxShadow: `0 0 15px ${color}, 0 0 5px ${color}` }}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={50}
          height={50}
          className={cn(
              "object-cover w-full h-full pointer-events-none select-none",
              shape === 'circle' ? 'rounded-full' : ''
            )}
        />
      </div>
      <div
        className="absolute -bottom-5 bg-background/80 text-foreground text-xs font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ transform: `scale(${1 / mapZoom})` }}
      >
        {name}
      </div>
    </motion.div>
  );
}
