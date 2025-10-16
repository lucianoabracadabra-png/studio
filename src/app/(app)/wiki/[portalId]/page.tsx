import { portals } from '@/lib/wiki-data';
import { notFound } from 'next/navigation';
import WikiLayout from '../_components/wiki-layout';

export default function PortalPage({ params }: { params: { portalId: string } }) {
    const portal = portals.find(p => p.id === params.portalId);

    if (!portal) {
        notFound();
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-6">
             <header className="animate-in fade-in-down">
                <h1 className="text-4xl font-headline magical-glow">{portal.title}</h1>
                <p className="text-lg text-muted-foreground mt-1">{portal.subtitle}</p>
            </header>
            <WikiLayout pages={portal.pages} />
        </div>
    );
}

export function generateStaticParams() {
  return portals.map((portal) => ({
    portalId: portal.id,
  }))
}
