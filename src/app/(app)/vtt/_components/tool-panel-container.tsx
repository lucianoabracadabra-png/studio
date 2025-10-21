'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VttTool } from './vtt-toolbar';
import { TokenPanel } from './panels/token-panel';
import { DrawingPanel } from './panels/drawing-panel';
import { FogPanel } from './panels/fog-panel';
import { LayersPanel } from './panels/layers-panel';
import { CombatPanel } from './panels/combat-panel';
import { SettingsPanel } from './panels/settings-panel';
import type { VttState } from './vtt-layout';

interface ToolPanelContainerProps {
    activeTool: VttTool | null;
    drawingState: VttState['drawing'];
    setDrawingState: (updater: React.SetStateAction<VttState['drawing']>) => void;
}

const panelVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
}

export function ToolPanelContainer({ 
    activeTool, 
    drawingState,
    setDrawingState 
}: ToolPanelContainerProps) {

    const renderPanel = () => {
        if (!activeTool) return null;

        switch (activeTool) {
            case 'tokens':
                return <TokenPanel />;
            case 'drawing':
                return <DrawingPanel drawingState={drawingState} setDrawingState={setDrawingState} />;
            case 'fog':
                return <FogPanel />;
            case 'layers':
                return <LayersPanel />;
            case 'combat':
                return <CombatPanel />;
            case 'settings':
                return <SettingsPanel />;
            default:
                return <div className='p-4 text-white'>Panel for {activeTool}</div>
        }
    }

    return (
        <AnimatePresence>
            {activeTool && (
                 <motion.div 
                    className='absolute top-0 left-16 z-10 h-full w-80 bg-gray-800/90 shadow-lg backdrop-blur-sm'
                    variants={panelVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                 >
                    {renderPanel()}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
