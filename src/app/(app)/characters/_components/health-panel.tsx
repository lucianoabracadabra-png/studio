'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Character, BodyPartHealth, HealthState } from '@/lib/character-data';

const healthStateOrder: HealthState[] = ['clean', 'simple', 'lethal', 'aggravated'];

const getNextHealthState = (currentState: HealthState): HealthState => {
    const currentIndex = healthStateOrder.indexOf(currentState);
    if (currentIndex === -1 || currentIndex === healthStateOrder.length - 1) {
        return healthStateOrder[0];
    }
    return healthStateOrder[currentIndex + 1];
};

const BodyPartIcon = ({ part }: { part: keyof Character['health']['bodyParts'] }) => {
    const abstractIcons: Record<keyof Character['health']['bodyParts'], JSX.Element> = {
        head: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><circle cx="12" cy="7" r="4" /></svg>,
        torso: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><rect x="7" y="4" width="10" height="16" rx="2" /></svg>,
        leftArm: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" transform="scale(-1, 1) translate(-24, 0)"><path d="M16 6h4v10h-4z" /></svg>,
        rightArm: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M4 6h4v10H4z" /></svg>,
        leftLeg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" transform="scale(-1, 1) translate(-24, 0)"><path d="M15 8h4v12h-4z" /></svg>,
        rightLeg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M5 8h4v12H5z" /></svg>
    }
    return <div className="w-10 h-10 text-muted-foreground">{abstractIcons[part]}</div>
}

const HealthGrid = ({ part, partId, onHealthChange }: { part: BodyPartHealth, partId: keyof Character['health']['bodyParts'], onHealthChange: (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => void }) => {
    
    const handleClick = (boxIndex: number) => {
        const currentState = part.states[boxIndex];
        const newState = getNextHealthState(currentState);
        onHealthChange(partId, boxIndex, newState);
    };

    const stateStyles = {
        clean: 'bg-green-500/80 border-green-500',
        simple: 'bg-blue-500/80 border-blue-500',
        lethal: 'bg-yellow-500/80 border-yellow-500',
        aggravated: 'bg-red-500/80 border-red-500',
    };

    return (
        <div className="grid grid-cols-4 gap-1.5">
            {part.states.map((state, i) => (
                <button
                    key={i} 
                    className={cn(
                        "w-4 h-4 rounded-sm cursor-pointer transition-all border",
                        stateStyles[state]
                    )}
                    onClick={() => handleClick(i)}
                    aria-label={`Health box ${i+1} for ${part.name}, state: ${state}`}
                />
            ))}
        </div>
    );
};


const BodyPartDisplay = ({ part, onHealthChange, partId }: { part: BodyPartHealth, onHealthChange: (partId: any, boxIndex: number, newState: HealthState) => void, partId: keyof Character['health']['bodyParts'] }) => {
    return (
        <div className={cn("grid items-center gap-2")} style={{ gridTemplateColumns: 'auto 1fr'}}>
             <BodyPartIcon part={partId} />
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
        <Card>
             <CardHeader>
                <CardTitle>Vitalidade</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mx-auto grid max-w-lg grid-cols-[1fr_auto_1fr] grid-rows-2 items-center justify-center gap-x-4 gap-y-2">
                    <div className='justify-self-end'>
                        <BodyPartDisplay part={healthData.bodyParts.leftArm} onHealthChange={onHealthChange} partId="leftArm" />
                    </div>
                    <BodyPartDisplay part={healthData.bodyParts.head} onHealthChange={onHealthChange} partId="head" />
                    <div className='justify-self-start'>
                        <BodyPartDisplay part={healthData.bodyParts.rightArm} onHealthChange={onHealthChange} partId="rightArm" />
                    </div>
                    <div className='justify-self-end'>
                        <BodyPartDisplay part={healthData.bodyParts.leftLeg} onHealthChange={onHealthChange} partId="leftLeg" />
                    </div>
                    <BodyPartDisplay part={healthData.bodyParts.torso} onHealthChange={onHealthChange} partId="torso" />
                    <div className='justify-self-start'>
                        <BodyPartDisplay part={healthData.bodyParts.rightLeg} onHealthChange={onHealthChange} partId="rightLeg" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
