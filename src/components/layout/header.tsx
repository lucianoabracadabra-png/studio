'use client';

import Link from 'next/link';

export function Header({ pageTitle }: { pageTitle: string }) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-white/10 bg-transparent px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <div className="w-full flex-1">
        <h1 className="font-headline text-2xl animate-in fade-in-down">{pageTitle}</h1>
      </div>
    </header>
  );
}
