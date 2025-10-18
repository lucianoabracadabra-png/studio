'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

interface Die3DProps {
  type: DiceType;
  colorHue: number;
  isRolling: boolean;
  onClick: () => void;
}

export const Die3D = ({ type, colorHue, isRolling, onClick }: Die3DProps) => {
  const dieFace = (face: number | string, index: number) => <div key={index} className={`face face-${face}`}>{face}</div>;
  
  let faces: (string|number)[] = Array.from({length: parseInt(type.substring(1))}, (_, i) => i + 1);

  if (type === 'd10') {
    faces = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  }
  if (type === 'd4') {
    faces = [1, 2, 3, 4]
  }
   if (type === 'd8') {
    faces = [1,2,3,4,5,6,7,8]
  }
  if (type === 'd12') {
    faces = [1,2,3,4,5,6,7,8,9,10,11,12]
  }


  return (
    <div className="die-container" onClick={onClick}>
      <div
        className={cn('die', type, isRolling && 'rolling')}
        style={{ '--die-hue': colorHue } as React.CSSProperties}
      >
        {faces.map((face, index) => dieFace(face, index))}
      </div>
    </div>
  );
};
