'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Character, BodyPartHealth, HealthState } from '@/lib/character-data';
import { PersonStanding, Heart, Hand, Footprints } from 'lucide-react';

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

type HealthPanelProps = {
    healthData: Character['health'];
    onHealthChange: (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => void;
};

const BodyPartSection = ({ icon, children, alignment = 'center' }: { icon: React.ElementType, children: React.ReactNode, alignment?: 'center' | 'start' | 'end' }) => (
    <div className={cn('flex flex-col gap-2 items-center', {
        'items-center': alignment === 'center',
        'items-start': alignment === 'start',
        'items-end': alignment === 'end',
    })}>
        {React.createElement(icon, { className: 'h-6 w-6 text-primary' })}
        {children}
    </div>
);


export function HealthPanel({ healthData, onHealthChange }: HealthPanelProps) {
    return (
        <Card>
             <CardHeader>
                <CardTitle>Vitalidade</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mx-auto grid max-w-lg grid-cols-[1fr_auto_1fr] grid-rows-3 items-start justify-center gap-x-4 gap-y-4">
                    {/* Row 1: Head */}
                    <div className='col-start-2 row-start-1 justify-self-center'>
                         <BodyPartSection icon={Heart}>
                             <HealthGrid part={healthData.bodyParts.head} onHealthChange={onHealthChange} partId="head" />
                         </BodyPartSection>
                    </div>
                    
                    {/* Row 2: Arms & Torso */}
                    <div className='col-start-1 row-start-2 justify-self-end'>
                         <BodyPartSection icon={Hand} alignment="end">
                            <HealthGrid part={healthData.bodyParts.leftArm} onHealthChange={onHealthChange} partId="leftArm" />
                         </BodyPartSection>
                    </div>
                    <div className='col-start-2 row-start-2 justify-self-center'>
                        <BodyPartSection icon={PersonStanding}>
                           <HealthGrid part={healthData.bodyParts.torso} onHealthChange={onHealthChange} partId="torso" />
                        </BodyPartSection>
                    </div>
                    <div className='col-start-3 row-start-2 justify-self-start'>
                        <BodyPartSection icon={Hand} alignment="start">
                           <HealthGrid part={healthData.bodyParts.rightArm} onHealthChange={onHealthChange} partId="rightArm" />
                        </BodyPartSection>
                    </div>

                    {/* Row 3: Legs */}
                    <div className='col-start-1 row-start-3 justify-self-end'>
                        <BodyPartSection icon={Footprints} alignment="end">
                           <HealthGrid part={healthData.bodyParts.leftLeg} onHealthChange={onHealthChange} partId="leftLeg" />
                        </BodyPartSection>
                    </div>
                    <div className='col-start-3 row-start-3 justify-self-start'>
                         <BodyPartSection icon={Footprints} alignment="start">
                           <HealthGrid part={healthData.bodyParts.rightLeg} onHealthChange={onHealthChange} partId="rightLeg" />
                        </BodyPartSection>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}