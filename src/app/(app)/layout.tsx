'use client'

import AppLayout from '@/components/layout/app-layout';
import { MovableWindowProvider } from '@/context/movable-window-context';
import { MovableWindowManager } from '@/components/layout/movable-window';

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MovableWindowProvider>
      <AppLayout>
        <div className="flex-grow flex flex-col">
          {children}
        </div>
      </AppLayout>
      <MovableWindowManager />
    </MovableWindowProvider>
  );
}
