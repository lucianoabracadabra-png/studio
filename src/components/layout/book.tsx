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
            className={cn(
                "relative w-12 h-16 rounded-md flex items-center justify-center cursor-pointer group/book transition-all",
                "border-2"
            )}
            style={{
                backgroundColor: `hsl(${colorHsl} / ${isActive ? 0.25 : 0.15})`,
                borderColor: `hsl(${colorHsl} / ${isActive ? 0.8 : 0.4})`,
            }}
            whileHover={isClickable ? { 
                scale: 1.1,
                borderColor: `hsl(${colorHsl})`,
                backgroundColor: `hsl(${colorHsl} / 0.35)`
            } : {}}
            animate={isActive ? {
                scale: 1.05,
                borderColor: `hsl(${colorHsl})`,
            } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={onClick}
        >
            {/* Spine with Glow */}
            <motion.div 
                className="absolute left-0 top-0 bottom-0 w-[4px] bg-black/30"
                animate={{
                    boxShadow: isActive ? `0px 0px 8px hsl(${colorHsl})` : 'none',
                    backgroundColor: isActive ? `hsl(${colorHsl})` : 'rgba(0,0,0,0.3)'
                }}
                transition={{ duration: 0.3 }}
            />
            
            <Icon className={cn(
                "h-6 w-6 transition-colors duration-300", 
                isActive ? "text-white" : "text-neutral-400",
                "group-hover/book:text-white"
            )} />

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
                    {bookContent}
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
