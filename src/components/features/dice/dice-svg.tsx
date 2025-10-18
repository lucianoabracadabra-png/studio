'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

interface DiceSvgProps {
  type: DiceType;
  colorHue: number;
  isRolling: boolean;
  onClick: () => void;
  size?: number;
}

export const DiceSvg = ({
  type,
  colorHue,
  isRolling,
  onClick,
  size = 80,
}: DiceSvgProps) => {
  const variants = {
    rolling: {
      rotate: [0, -10, 10, -5, 5, 0],
      x: [0, 5, -5, 3, -3, 0],
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    idle: {
      rotate: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer group"
      onClick={onClick}
      animate={isRolling ? 'rolling' : 'idle'}
      variants={variants}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transition-transform duration-200 group-hover:scale-110"
      >
        <defs>
            <linearGradient id={`grad-${colorHue}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: `hsl(${colorHue}, 90%, 80%)`, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: `hsl(${colorHue}, 90%, 60%)`, stopOpacity: 1 }} />
            </linearGradient>
            <filter id={`glow-${colorHue}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g style={{ filter: `url(#glow-${colorHue})` }}>
            <rect 
                x="10" 
                y="10" 
                width="80" 
                height="80" 
                rx="15" 
                ry="15" 
                fill={`url(#grad-${colorHue})`}
                stroke={`hsl(${colorHue}, 90%, 85%)`}
                strokeWidth="3"
            />
        </g>
        <text
          x="50"
          y="58"
          fontFamily="Metamorphous, serif"
          fontSize="40"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
        >
          {type}
        </text>
      </svg>
      <p className="mt-2 font-headline font-bold text-foreground/80">{type.toUpperCase()}</p>
    </motion.div>
  );
};
