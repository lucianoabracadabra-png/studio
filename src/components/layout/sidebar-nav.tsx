'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  BookOpen,
  FlaskConical,
  LayoutDashboard,
  Map,
  Swords,
  Users,
  WandSparkles,
  FileText,
  Volume2,
} from 'lucide-react';
import { Icons } from '../icons';

const links = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Characters',
    href: '/characters',
    icon: Users,
  },
  {
    label: 'Virtual Tabletop',
    href: '/vtt',
    icon: Map,
  },
  {
    label: 'Wiki',
    href: '/wiki',
    icon: BookOpen,
  },
];

const gmTools = [
  {
    label: 'Combat Tracker',
    href: '/gm/combat-tracker',
    icon: Swords,
  },
  {
    label: 'Generators',
    href: '/tools/generator',
    icon: FlaskConical,
  },
  {
    label: 'Describer',
    href: '/tools/description-generator',
    icon: FileText,
  },
  {
    label: 'Soundboard',
    href: '/tools/soundboard',
    icon: Volume2,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarGroup>
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-semibold">O Bruxo Nexus</span>
        </Link>
      </SidebarGroup>

      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  tooltip={link.label}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <WandSparkles />
            <span>GM Tools</span>
          </SidebarGroupLabel>
          <SidebarMenu>
            {gmTools.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === link.href}
                    tooltip={link.label}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
