'use client';

import { SidebarNav } from './sidebar-nav';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type AppLayoutProps = {
  children: React.ReactNode;
  activePath: string | null;
  colorHue: number;
  isClosing: boolean;
};

export default function AppLayout({ children, activePath, colorHue, isClosing }: AppLayoutProps) {
  const pageStyle = {
    '--page-primary-color': `hsl(${colorHue}, 90%, 70%)`,
    '--page-accent-color': `hsl(${(colorHue + 40) % 360}, 90%, 70%)`,
  } as React.CSSProperties;

  const showContent = activePath !== null;

  return (
    <div className="min-h-screen w-full bg-background relative">
      <SidebarNav activePath={activePath} />
      <main className="pl-24">
        <AnimatePresence>
          {showContent && (
             <motion.div
                key={activePath}
                className="page-content-wrapper h-screen w-[calc(100%-6rem)] fixed top-0 left-24 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
             >
                <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-6">
                    <div 
                        className="page-container flex-1 flex flex-col"
                        style={pageStyle}
                    >
                        {children}
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
