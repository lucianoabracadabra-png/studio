'use client'

import AppLayout from '@/components/layout/app-layout';
import { usePathname } from 'next/navigation';

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
  const pageTitle = getPageTitle(pathname);

  return <AppLayout pageTitle={pageTitle}>{children}</AppLayout>;
}
