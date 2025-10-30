'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface BookProps {
    label: string;
    icon: LucideIcon | (() => JSX.Element);
    colorHsl: string;
    level?: number;
    isActive: boolean;
    isClickable?: boolean;
    showLabel?: boolean; // This prop might become obsolete, but let's keep it for now.
    onClick?: () => void;
}

export const Book = ({ label, icon: Icon, colorHsl, level, isActive, isClickable = true, onClick }: BookProps) => {

    const hasValue = level !== undefined && level > 0;
    const canHoverEffect = hasValue && isClickable;

    const bookContent = (
         <motion.div
            className={cn(
                "relative w-12 h-16 rounded-md flex cursor-pointer group/book transition-all overflow-hidden",
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
            <motion.div 
                className="absolute left-0 top-0 bottom-0 w-[4px]"
                animate={{
                    boxShadow: isActive ? `0px 0px 8px hsl(${colorHsl})` : 'none',
                    backgroundColor: isActive ? `hsl(${colorHsl})` : `hsl(${colorHsl} / 0.5)`
                }}
                transition={{ duration: 0.3 }}
            />
            
            <div className="flex-1 flex flex-col pl-[4px] relative">
                <motion.div
                     className='w-full h-full'
                     initial={{ opacity: 1 }}
                     animate={{ opacity: canHoverEffect ? 1 : 0 }}
                     whileHover={{ opacity: canHoverEffect ? 0 : 1 }}
                     transition={{ duration: 0.2 }}
                >
                    {hasValue ? (
                        <>
                            <div className="h-2/3 w-full flex items-center justify-center">
                                <Icon className={cn(
                                    "h-6 w-6 transition-colors duration-300", 
                                    isActive ? "text-white" : "text-neutral-400",
                                    "group-hover/book:text-white"
                                )} />
                            </div>
                            <div className="h-1/3 w-full flex items-center justify-center">
                                <span className="text-sm font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                    {level}
                                </span>
                            </div>
                        </>
                    ) : (
                         <div className="h-full w-full flex items-center justify-center">
                            <Icon className={cn(
                                "h-6 w-6 transition-colors duration-300", 
                                isActive ? "text-white" : "text-neutral-400",
                                "group-hover/book:text-white"
                            )} />
                        </div>
                    )}
                </motion.div>
                
                 {canHoverEffect && (
                    <motion.div
                        className='absolute inset-0 flex items-center justify-center text-center p-1'
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span 
                            className="text-white font-bold text-xs leading-tight"
                            style={{
                                textShadow: `0 0 6px hsl(${colorHsl}), 0 0 10px hsl(${colorHsl})`
                            }}
                        >
                            {label}
                        </span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );

    return bookContent;
};
