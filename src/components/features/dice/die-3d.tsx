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
  const dieFace = (face: number | string, index: number) => (
    <div key={index} className={`face face-${index + 1}`}>
      {face}
    </div>
  );

  let faces: (string | number)[] = [];
  const faceCount = parseInt(type.substring(1));

  if (type === 'd10') {
    faces = Array.from({ length: 10 }, (_, i) => `${i}0`);
    faces[0] = '0';
  } else {
    faces = Array.from({ length: faceCount }, (_, i) => i + 1);
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
