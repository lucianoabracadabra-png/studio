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
    vttState: VttState;
    setVttState: React.Dispatch<React.SetStateAction<VttState>>;
}

const panelVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
};

export function ToolPanelContainer({ 
    activeTool, 
    vttState,
    setVttState
}: ToolPanelContainerProps) {

    const renderPanel = () => {
        if (!activeTool || activeTool === 'pan') return null;

        switch (activeTool) {
            case 'tokens':
                return <TokenPanel />;
            case 'drawing':
                return <DrawingPanel vttState={vttState} setVttState={setVttState} />;
            case 'fog':
                return <FogPanel />;
            case 'layers':
                return <LayersPanel vttState={vttState} setVttState={setVttState} />;
            case 'combat':
                return <CombatPanel />;
            case 'settings':
                return <SettingsPanel />;
            default:
                return <div className='p-4'>Panel for {activeTool}</div>;
        }
    }

    return (
        <AnimatePresence>
            {activeTool && activeTool !== 'pan' && (
                 <motion.div 
                    key={activeTool}
                    className='absolute top-0 left-16 z-10 h-full w-80 bg-card shadow-lg border-r'
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
    );
}
