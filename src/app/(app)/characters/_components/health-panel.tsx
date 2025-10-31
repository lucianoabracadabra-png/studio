'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Character, BodyPartHealth, HealthState } from '@/lib/character-data';
import { PersonStanding, Hand, Footprints, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const healthStateOrder: HealthState[] = ['clean', 'simple', 'lethal', 'aggravated'];

const getNextHealthState = (currentState: HealthState): HealthState => {
    const currentIndex = healthStateOrder.indexOf(currentState);
    if (currentIndex === -1 || currentIndex === healthStateOrder.length - 1) {
        return currentState;
    }
    return healthStateOrder[currentIndex + 1];
};

const getPreviousHealthState = (currentState: HealthState): HealthState => {
    const currentIndex = healthStateOrder.indexOf(currentState);
    if (currentIndex <= 0) {
        return healthStateOrder[0];
    }
    return healthStateOrder[currentIndex - 1];
};


const HealthGrid = ({ states, onBoxClick }: { states: HealthState[], onBoxClick: (index: number) => void }) => {
    
    const stateStyles = {
        clean: 'bg-green-500/80 border-green-500',
        simple: 'bg-blue-500/80 border-blue-500',
        lethal: 'bg-yellow-500/80 border-yellow-500',
        aggravated: 'bg-red-500/80 border-red-500',
    };

    return (
        <div className="grid grid-cols-5 gap-1.5">
            {states.map((state, i) => (
                <button
                    key={i} 
                    onClick={() => onBoxClick(i)}
                    className={cn(
                        "w-5 h-5 rounded-sm border cursor-pointer transition-transform hover:scale-110",
                        stateStyles[state]
                    )}
                    aria-label={`Health box ${i+1}, state: ${state}`}
                />
            ))}
        </div>
    );
};

const BodyPartManager = ({ part, partId, onHealthChange }: { part: BodyPartHealth, partId: keyof Character['health']['bodyParts'], onHealthChange: (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => void }) => {
    
    const handleDamage = () => {
        const firstCleanIndex = part.states.findIndex(s => s === 'clean');
        if (firstCleanIndex !== -1) {
            onHealthChange(partId, firstCleanIndex, 'simple');
            return;
        }

        const firstSimpleIndex = part.states.findIndex(s => s === 'simple');
        if (firstSimpleIndex !== -1) {
            onHealthChange(partId, firstSimpleIndex, 'lethal');
            return;
        }
        
        const firstLethalIndex = part.states.findIndex(s => s === 'lethal');
        if (firstLethalIndex !== -1) {
            onHealthChange(partId, firstLethalIndex, 'aggravated');
            return;
        }
    };
    
    const handleHeal = () => {
        const lastAggravatedIndex = part.states.findLastIndex(s => s === 'aggravated');
        if (lastAggravatedIndex !== -1) {
            onHealthChange(partId, lastAggravatedIndex, 'lethal');
            return;
        }

        const lastLethalIndex = part.states.findLastIndex(s => s === 'lethal');
        if (lastLethalIndex !== -1) {
            onHealthChange(partId, lastLethalIndex, 'simple');
            return;
        }

        const lastSimpleIndex = part.states.findLastIndex(s => s === 'simple');
        if (lastSimpleIndex !== -1) {
            onHealthChange(partId, lastSimpleIndex, 'clean');
            return;
        }
    };
    
    const handleBoxClick = (index: number) => {
        const currentState = part.states[index];
        const nextState = getNextHealthState(currentState);
        onHealthChange(partId, index, nextState);
    };

    return (
        <div className='flex flex-col items-center gap-3'>
            <HealthGrid states={part.states} onBoxClick={handleBoxClick} />
            <div className='flex gap-2 items-center'>
                <Button variant='outline' size='icon' className='h-6 w-6' onClick={handleHeal}><Minus className='h-4 w-4'/></Button>
                <span className='font-semibold text-muted-foreground w-20 text-center'>{part.name}</span>
                <Button variant='outline' size='icon' className='h-6 w-6' onClick={handleDamage}><Plus className='h-4 w-4'/></Button>
            </div>
        </div>
    )
}

type HealthPanelProps = {
    healthData: Character['health'];
    onHealthChange: (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => void;
};

const BodyPartSection = ({ icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
    <div className={cn('flex flex-col items-center gap-3')}>
        {React.createElement(icon, { className: 'h-8 w-8 text-primary' })}
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
                <div className="mx-auto grid max-w-3xl grid-rows-2 grid-cols-3 items-start justify-items-center gap-y-8 py-4">
                    {/* Row 1 */}
                    <BodyPartSection icon={Hand}>
                        <BodyPartManager part={healthData.bodyParts.leftArm} onHealthChange={onHealthChange} partId="leftArm" />
                    </BodyPartSection>
                    
                    <BodyPartSection icon={PersonStanding}>
                        <BodyPartManager part={healthData.bodyParts.head} onHealthChange={onHealthChange} partId="head" />
                    </BodyPartSection>
                    
                    <BodyPartSection icon={Hand}>
                        <BodyPartManager part={healthData.bodyParts.rightArm} onHealthChange={onHealthChange} partId="rightArm" />
                    </BodyPartSection>

                    {/* Row 2 */}
                    <BodyPartSection icon={Footprints}>
                       <BodyPartManager part={healthData.bodyParts.leftLeg} onHealthChange={onHealthChange} partId="leftLeg" />
                    </BodyPartSection>
                    
                    <BodyPartSection icon={PersonStanding}>
                       <BodyPartManager part={healthData.bodyParts.torso} onHealthChange={onHealthChange} partId="torso" />
                    </BodyPartSection>

                    <BodyPartSection icon={Footprints}>
                       <BodyPartManager part={healthData.bodyParts.rightLeg} onHealthChange={onHealthChange} partId="rightLeg" />
                    </BodyPartSection>
                </div>
            </CardContent>
        </Card>
    );
}
