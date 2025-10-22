'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Character, BodyPartHealth, HealthState } from '@/lib/character-data';

const healthStateOrder: HealthState[] = ['clean', 'simple', 'lethal', 'aggravated'];

const getNextHealthState = (currentState: HealthState): HealthState => {
    const currentIndex = healthStateOrder.indexOf(currentState);
    if (currentIndex === -1) return 'simple'; 
    if (currentIndex === healthStateOrder.length - 1) return 'clean';
    return healthStateOrder[currentIndex + 1];
};

const BodyPartIcon = ({ part }: { part: keyof Character['health']['bodyParts'] }) => {
    const abstractIcons: Record<keyof Character['health']['bodyParts'], JSX.Element> = {
        head: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><circle cx="12" cy="7" r="5" /></svg>,
        torso: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M7 3h10v7H7z M9 11h6v9H9z" /></svg>,
        leftArm: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" transform="scale(-1, 1) translate(-24, 0)"><path d="M15 4h4v12h-4z" /></svg>,
        rightArm: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M5 4h4v12H5z" /></svg>,
        leftLeg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" transform="scale(-1, 1) translate(-24, 0)"><path d="M15 11h4v10h-4z" /></svg>,
        rightLeg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M5 11h4v10H5z" /></svg>
    }
    return <div className="w-10 h-10 md:w-12 md:h-12 text-white/80">{abstractIcons[part]}</div>
}

const HealthGrid = ({ part, partId, onHealthChange }: { part: BodyPartHealth, partId: keyof Character['health']['bodyParts'], onHealthChange: (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => void }) => {
    
    const handleClick = (boxIndex: number) => {
        const currentState = part.states[boxIndex];
        const newState = getNextHealthState(currentState);
        onHealthChange(partId, boxIndex, newState);
    };

    const stateStyles = {
        clean: 'bg-green-500/20 border-green-500/40',
        simple: 'bg-blue-500/20 border-blue-500/40',
        lethal: 'bg-yellow-500/20 border-yellow-500/40',
        aggravated: 'bg-red-500/20 border-red-500/40',
    };

    const stateFillStyles = {
        clean: 'bg-green-500/80',
        simple: 'bg-blue-500/80',
        lethal: 'bg-yellow-500/80',
        aggravated: 'bg-red-500/80',
    }
    
    return (
        <div className="health-grid" style={{ '--grid-cols': partId === 'torso' ? 4 : 3 } as React.CSSProperties}>
            {part.states.map((state, i) => (
                <button
                    key={i} 
                    className={cn("health-box", stateStyles[state])}
                    onClick={() => handleClick(i)}
                    aria-label={`Health box ${i+1} for ${part.name}, state: ${state}`}
                >
                    <div className={cn("inner-box", stateFillStyles[state])}></div>
                </button>
            ))}
        </div>
    );
};


const BodyPartDisplay = ({ part, onHealthChange, partId }: { part: BodyPartHealth, onHealthChange: (partId: any, boxIndex: number, newState: HealthState) => void, partId: keyof Character['health']['bodyParts'] }) => {
    return (
        <div className={cn("body-part-container", `body-part-${partId}`)}>
             <div className="icon-container">
                <BodyPartIcon part={partId} />
             </div>
             <HealthGrid part={part} partId={partId} onHealthChange={onHealthChange} />
        </div>
    );
}

type HealthPanelProps = {
    healthData: Character['health'];
    onHealthChange: (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => void;
};

export function HealthPanel({ healthData, onHealthChange }: HealthPanelProps) {

    return (
        <Card className="glassmorphic-card">
             <CardHeader>
                <CardTitle className='font-headline text-2xl magical-glow'>Vitalidade</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-gray-900/30 rounded-b-lg">
                <div className="health-diagram">
                    <BodyPartDisplay part={healthData.bodyParts.leftArm} onHealthChange={onHealthChange} partId="leftArm" />
                    <BodyPartDisplay part={healthData.bodyParts.head} onHealthChange={onHealthChange} partId="head" />
                    <BodyPartDisplay part={healthData.bodyParts.rightArm} onHealthChange={onHealthChange} partId="rightArm" />
                    <BodyPartDisplay part={healthData.bodyParts.leftLeg} onHealthChange={onHealthChange} partId="leftLeg" />
                    <BodyPartDisplay part={healthData.bodyParts.torso} onHealthChange={onHealthChange} partId="torso" />
                    <BodyPartDisplay part={healthData.bodyParts.rightLeg} onHealthChange={onHealthChange} partId="rightLeg" />
                </div>
            </CardContent>
        </Card>
    );
}
