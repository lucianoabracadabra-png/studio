'use client'

import AppLayout from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function getPageTitle(pathname: string): string {
    const segment = pathname.split('/').pop() || 'dashboard';
    const title = segment.replace(/-/g, ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
}

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // pathname will be null on initial load in this setup
    // We only show content when a path is selected
    if (pathname && pathname !== '/_error') { // /_error can be a path on initial load sometimes
        setPageTitle(getPageTitle(pathname));
        setShowContent(true);
    } else {
        setShowContent(false);
    }
  }, [pathname]);

  return <AppLayout pageTitle={pageTitle} showContent={showContent}>{children}</AppLayout>;
}
