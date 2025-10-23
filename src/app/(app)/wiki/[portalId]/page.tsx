import { portals } from '@/lib/wiki-data';
import { notFound } from 'next/navigation';
import WikiClientLayout from '../_components/wiki-client-layout';
import wikiData from '@/lib/data/wiki-data.json';

export default function PortalPage({ params }: { params: { portalId: string } }) {
    const portal = wikiData.portals.find(p => p.id === params.portalId);

    if (!portal) {
        notFound();
    }

    return <WikiClientLayout portal={portal} />;
}

export function generateStaticParams() {
  return wikiData.portals.map((portal) => ({
    portalId: portal.id,
  }))
}
