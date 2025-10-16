'use client';

import { SidebarNav } from './sidebar-nav';
import { motion } from 'framer-motion';

type AppLayoutProps = {
  children: React.ReactNode;
  activePath: string | null;
  colorHue: number;
};

const PageContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="page-content-wrapper h-screen w-full absolute top-0 left-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-6">
        <div 
            className="page-container flex-1 flex flex-col"
        >
            {children}
        </div>
      </div>
    </motion.div>
  );
};


export default function AppLayout({ children, activePath, colorHue }: AppLayoutProps) {
  const pageStyle = {
    '--page-primary-color': `hsl(${colorHue}, 90%, 70%)`,
    '--page-accent-color': `hsl(${(colorHue + 40) % 360}, 90%, 70%)`,
  } as React.CSSProperties;


  return (
    <div className="min-h-screen w-full bg-background" style={pageStyle}>
      <div className="relative z-20">
        <SidebarNav activePath={activePath} />
      </div>
      <main className="pl-24 h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}

AppLayout.PageContent = PageContent;
