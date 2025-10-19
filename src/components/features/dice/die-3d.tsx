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
  const getFaces = () => {
    switch (type) {
      case 'd4':
        return [
          [1, 2, 3],
          [1, 4, 2],
          [1, 3, 4],
          [2, 4, 3],
        ];
      case 'd10':
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      default:
        const faceCount = parseInt(type.substring(1));
        return Array.from({ length: faceCount }, (_, i) => i + 1);
    }
  };

  const faces = getFaces();

  const renderFace = (faceValue: any, index: number) => {
    if (type === 'd4') {
        return (
            <div key={index} className={`face face-${index + 1}`}>
                {faceValue.map((num: number, i: number) => (
                    <span key={i} className={`face-value-${i+1}`}>{num}</span>
                ))}
            </div>
        )
    }
    return (
        <div key={index} className={`face face-${index + 1}`}>
            {faceValue}
        </div>
    );
  }


  return (
    <div className="die-container" onClick={onClick}>
      <div
        className={cn('die', type, isRolling && 'rolling')}
        style={{ '--die-hue': colorHue } as React.CSSProperties}
      >
        {faces.map(renderFace)}
      </div>
    </div>
  );
};
