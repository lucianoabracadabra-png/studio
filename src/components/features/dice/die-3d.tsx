'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type DiceType = 4 | 6 | 8 | 10 | 12 | 20;

interface Die3DProps {
  type: DiceType;
  colorHue: number;
  isRolling: boolean;
  onClick: () => void;
}

const Face = ({ children, face }: { children?: React.ReactNode, face: string }) => (
  <div className={cn('die-face', `face-${face}`)}>{children}</div>
);

const D4 = ({ colorHue }: { colorHue: number }) => (
  <div className="die d4" style={{ '--die-hue': colorHue } as React.CSSProperties}>
    <div className="faces">
      <Face face="front">1</Face>
      <Face face="right">2</Face>
      <Face face="back">3</Face>
      <Face face="bottom">4</Face>
    </div>
  </div>
);

const D6 = ({ colorHue }: { colorHue: number }) => (
  <div className="die d6" style={{ '--die-hue': colorHue } as React.CSSProperties}>
    <div className="faces">
      <Face face="front">1</Face>
      <Face face="back">6</Face>
      <Face face="right">2</Face>
      <Face face="left">5</Face>
      <Face face="top">3</Face>
      <Face face="bottom">4</Face>
    </div>
  </div>
);

const D8 = ({ colorHue }: { colorHue: number }) => (
  <div className="die d8" style={{ '--die-hue': colorHue } as React.CSSProperties}>
    <div className="faces">
      <Face face="1">1</Face>
      <Face face="2">2</Face>
      <Face face="3">3</Face>
      <Face face="4">4</Face>
      <Face face="5">5</Face>
      <Face face="6">6</Face>
      <Face face="7">7</Face>
      <Face face="8">8</Face>
    </div>
  </div>
);

const D10 = ({ colorHue }: { colorHue: number }) => (
  <div className="die d10" style={{ '--die-hue': colorHue } as React.CSSProperties}>
    <div className="faces">
      {[...Array(10)].map((_, i) => <Face key={i} face={`${i}`}>{i}</Face>)}
    </div>
  </div>
);

const D12 = ({ colorHue }: { colorHue: number }) => (
  <div className="die d12" style={{ '--die-hue': colorHue } as React.CSSProperties}>
    <div className="faces">
      <Face face="1">1</Face>
      <Face face="2">2</Face>
      <Face face="3">3</Face>
      <Face face="4">4</Face>
      <Face face="5">5</Face>
      <Face face="6">6</Face>
      <Face face="7">7</Face>
      <Face face="8">8</Face>
      <Face face="9">9</Face>
      <Face face="10">10</Face>
      <Face face="11">11</Face>
      <Face face="12">12</Face>
    </div>
  </div>
);

const D20 = ({ colorHue }: { colorHue: number }) => (
  <div className="die d20" style={{ '--die-hue': colorHue } as React.CSSProperties}>
    <div className="faces">
      <Face face="1">1</Face>
      <Face face="2">2</Face>
      <Face face="3">3</Face>
      <Face face="4">4</Face>
      <Face face="5">5</Face>
      <Face face="6">6</Face>
      <Face face="7">7</Face>
      <Face face="8">8</Face>
      <Face face="9">9</Face>
      <Face face="10">10</Face>
      <Face face="11">11</Face>
      <Face face="12">12</Face>
      <Face face="13">13</Face>
      <Face face="14">14</Face>
      <Face face="15">15</Face>
      <Face face="16">16</Face>
      <Face face="17">17</Face>
      <Face face="18">18</Face>
      <Face face="19">19</Face>
      <Face face="20">20</Face>
    </div>
  </div>
);


export const Die3D = ({ type, colorHue, isRolling, onClick }: Die3DProps) => {
  const dieMap = {
    4: D4,
    6: D6,
    8: D8,
    10: D10,
    12: D12,
    20: D20,
  };

  const DieComponent = dieMap[type];

  return (
    <div className="die-container" onClick={onClick}>
      <div className={cn('die-wrapper', isRolling && 'rolling')}>
        <DieComponent colorHue={colorHue} />
      </div>
      <p className="die-label">d{type}</p>
    </div>
  );
};
