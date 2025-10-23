'use client';

import { MovableWindowProvider } from '@/context/movable-window-context';
import { MovableWindowManager } from '@/components/layout/movable-window';
import type { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <MovableWindowProvider>
            {children}
            <MovableWindowManager />
        </MovableWindowProvider>
    );
}
