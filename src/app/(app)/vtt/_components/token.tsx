'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TokenProps {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  initialPosition: { x: number; y: number };
  onDragEnd: (id: number, position: { x: number; y: number }) => void;
  mapZoom: number;
}

export function Token({ id, name, imageUrl, color, initialPosition, onDragEnd, mapZoom }: TokenProps) {
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
      className="rounded-full cursor-pointer flex flex-col items-center group"
    >
      <div 
        className="w-full h-full rounded-full border-2 overflow-hidden transition-all duration-200 group-hover:shadow-lg"
        style={{ borderColor: color, boxShadow: `0 0 15px ${color}, 0 0 5px ${color}` }}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={50}
          height={50}
          className="object-cover w-full h-full pointer-events-none select-none"
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
