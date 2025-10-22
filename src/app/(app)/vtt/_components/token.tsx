'use client';

import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { TokenShape } from './vtt-layout';

interface TokenProps {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  initialPosition: { x: number; y: number };
  onDragEnd: (id: number, info: PanInfo) => void;
  mapZoom: number;
  shape: TokenShape;
  isActive: boolean;
  isDraggingDisabled?: boolean;
}

export function Token({ id, name, imageUrl, color, initialPosition, onDragEnd, mapZoom, shape, isActive, isDraggingDisabled }: TokenProps) {

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    onDragEnd(id, info);
  };
  
  const glowStyle = isActive ? { boxShadow: `0 0 20px 5px ${color}, 0 0 8px 2px ${color}` } : {};

  return (
    <motion.div
      drag={!isDraggingDisabled}
      onDragEnd={handleDragEnd}
      dragMomentum={false}
      initial={false}
      animate={{ x: initialPosition.x, y: initialPosition.y }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: isActive ? 10 : 1,
      }}
      className="cursor-pointer flex flex-col items-center group"
    >
      <div 
        className={cn(
            "w-full h-full border-2 overflow-hidden transition-all duration-200 group-hover:shadow-lg",
            shape === 'circle' ? 'rounded-full' : 'rounded-md'
        )}
        style={{ borderColor: color, ...glowStyle }}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={50}
          height={50}
          className={cn(
              "object-cover w-full h-full pointer-events-none select-none",
              shape === 'circle' ? '' : ''
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
