'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import type { LucideIcon } from 'lucide-react';

interface BookProps {
    label: string;
    icon: LucideIcon | (() => JSX.Element);
    colorHsl: string;
    isActive: boolean;
    isClickable?: boolean;
    showLabel?: boolean;
    onClick?: () => void;
}

export const Book = ({ label, icon: Icon, colorHsl, isActive, isClickable = true, showLabel = true, onClick }: BookProps) => {

    const bookContent = (
        <motion.div 
            className="relative w-14 h-14 rounded-md overflow-hidden group/book"
            whileHover={isClickable ? "hover" : "inactive"}
            animate={isActive ? "active" : "inactive"}
            onClick={onClick}
        >
            {/* Glow Effect */}
            <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                    backgroundColor: `hsl(${colorHsl})`,
                    boxShadow: `0 0 15px hsl(${colorHsl})`
                }}
                variants={{
                    inactive: { opacity: 0, scale: 0.95 },
                    active: { opacity: 0.7, scale: 1 },
                    hover: { opacity: 0.8, scale: 1.05 }
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Book Spine */}
            <div 
                className="absolute left-0 top-0 h-full w-[18px] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-l-md transform-gpu"
                style={{ 
                    backgroundColor: `hsl(${colorHsl} / 0.3)`,
                    borderRight: `2px solid hsl(${colorHsl} / 0.15)`,
                }}
            />
            
            {/* Book Cover */}
            <motion.div 
                className="absolute right-0 top-0 h-full w-[calc(100%-12px)] origin-left flex items-center justify-center rounded-r-md"
                style={{ 
                    backgroundColor: `hsl(${colorHsl} / 0.1)`,
                    borderTop: `2px solid hsl(${colorHsl} / 0.15)`,
                    borderBottom: `2px solid hsl(${colorHsl} / 0.15)`,
                    borderRight: `2px solid hsl(${colorHsl} / 0.15)`,
                }}
                variants={{
                    inactive: { },
                    active: { },
                    hover: { }
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Icon className={cn("h-6 w-6 text-neutral-400 transition-colors duration-300 group-hover/book:text-white", isActive && "text-white")} />
            </motion.div>

             {showLabel && (
                <div className="absolute -bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
                    {label}
                </div>
            )}
        </motion.div>
    );

    if (!isClickable) {
        return bookContent;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn("relative cursor-pointer", isClickable && "group/book")}>
                        {bookContent}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
