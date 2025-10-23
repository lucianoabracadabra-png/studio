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
        <div className={cn("grid gap-1.5", {
            'grid-cols-3': part.states.length === 6, // Head
            'grid-cols-4': part.states.length === 12, // Torso
            'grid-cols-3': part.states.length === 9, // Limbs
        })}>
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
                <div className="mx-auto grid max-w-lg grid-cols-[1fr_auto_1fr] grid-rows-3 items-center justify-center gap-x-4 gap-y-2">
                    {/* Row 1 */}
                    <div className='col-start-2 row-start-1 justify-self-center'>
                         <HealthGrid part={healthData.bodyParts.head} onHealthChange={onHealthChange} partId="head" />
                    </div>
                    
                    {/* Row 2 */}
                    <div className='col-start-1 row-start-2 justify-self-end'>
                         <HealthGrid part={healthData.bodyParts.leftArm} onHealthChange={onHealthChange} partId="leftArm" />
                    </div>
                    <div className='col-start-2 row-start-2 justify-self-center'>
                        <HealthGrid part={healthData.bodyParts.torso} onHealthChange={onHealthChange} partId="torso" />
                    </div>
                    <div className='col-start-3 row-start-2 justify-self-start'>
                        <HealthGrid part={healthData.bodyParts.rightArm} onHealthChange={onHealthChange} partId="rightArm" />
                    </div>

                    {/* Row 3 */}
                    <div className='col-start-1 row-start-3 justify-self-end'>
                        <HealthGrid part={healthData.bodyParts.leftLeg} onHealthChange={onHealthChange} partId="leftLeg" />
                    </div>
                    <div className='col-start-3 row-start-3 justify-self-start'>
                        <HealthGrid part={healthData.bodyParts.rightLeg} onHealthChange={onHealthChange} partId="rightLeg" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
