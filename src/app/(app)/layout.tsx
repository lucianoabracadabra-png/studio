
'use client';

import AppLayout from '@/components/layout/app-layout';
import ClientProviders from '@/context/client-providers';
import { CharacterProvider } from '@/context/character-context';

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CharacterProvider>
      <ClientProviders>
        <AppLayout>
          <div className="flex-grow flex flex-col">
            {children}
          </div>
        </AppLayout>
      </ClientProviders>
    </CharacterProvider>
  );
}
