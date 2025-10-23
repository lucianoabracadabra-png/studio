'use client';
import { BookCopy, User, DraftingCompass, ScrollText, Map, type LucideIcon } from "lucide-react";
import wikiData from '@/lib/data/wiki-data.json';

export type WikiPage = {
    id: string;
    title: string;
    summary: string;
    content: string;
};

export type Portal = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: keyof typeof iconMap;
    colorHue: number;
    pages: WikiPage[];
    href?: string;
};

export const portals: Portal[] = wikiData.portals as Portal[];

export const iconMap: { [key: string]: LucideIcon } = {
    BookCopy,
    User,
    DraftingCompass,
    ScrollText,
    Map
};

export const pointsOfInterest: { id: string; name: string; position: { x: number; y: number; }; portalId: string; }[] = wikiData.pointsOfInterest;