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
            className="relative w-12 h-[68px] rounded-md overflow-hidden group/book"
            whileHover={isClickable ? "hover" : "inactive"}
            animate={isActive ? "active" : "inactive"}
            onClick={onClick}
            variants={{
                inactive: { scale: 1 },
                active: { scale: 1.05 },
                hover: { scale: 1.1 }
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
            {/* Main Book Body */}
            <div 
                className="absolute inset-0 rounded-md flex items-center justify-center transition-colors"
                style={{ 
                    backgroundColor: `hsl(${colorHsl} / ${isActive ? 0.25 : 0.15})`,
                    borderColor: `hsl(${colorHsl} / ${isActive ? 0.8 : 0.4})`,
                    borderWidth: '2px'
                }}
            >
                <Icon className={cn(
                    "h-6 w-6 transition-colors duration-300", 
                    isActive ? "text-white" : "text-neutral-400",
                    "group-hover/book:text-white"
                )} />
            </div>

            {/* Spine */}
            <div 
                className="absolute left-0 top-0 h-full w-[4px] rounded-l-sm"
                style={{ backgroundColor: `hsl(${colorHsl})` }}
            />

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
