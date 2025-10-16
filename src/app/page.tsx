import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full" />
      <div className="container relative z-10 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-8 flex items-center justify-center gap-4 animate-in fade-in-down">
          <Icons.logo className="h-16 w-16 text-primary" />
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-500">
            O Bruxo Nexus
          </h1>
        </div>

        <p className="max-w-2xl text-lg md:text-xl text-foreground/80 mb-10 animate-in fade-in-down" style={{ animationDelay: '200ms' }}>
          Your all-in-one toolkit for immersive tabletop role-playing games. Forge legends, track battles, and bring your world to life.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in-down" style={{ animationDelay: '400ms' }}>
          <Button asChild size="lg" className="font-bold group">
            <Link href="/dashboard">
              Launch App <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold border-2 group">
            <Link href="/login">
              Login or Sign Up
            </Link>
          </Button>
        </div>

        <div className="mt-24 text-center w-full animate-in fade-in-up" style={{ animationDelay: '600ms' }}>
            <h2 className="font-headline text-3xl font-bold text-foreground">Features</h2>
            <p className="mt-2 text-muted-foreground">Everything you need for your next TTRPG session.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard title="Campaign Management" description="Create and manage your campaigns with ease." icon={Zap} delay={700} />
                <FeatureCard title="Interactive Character Sheets" description="Dynamic sheets with real-time updates and dice rolling." icon={Zap} delay={800} />
                <FeatureCard title="Virtual Tabletop" description="Immersive maps with tokens, fog of war, and drawing tools." icon={Zap} delay={900} />
                <FeatureCard title="AI-Powered Generation" description="Generate NPCs, items, and descriptions with a single click." icon={Zap} delay={1000} />
            </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon: Icon, delay }: { title: string; description: string; icon: React.ElementType, delay: number }) {
  return (
    <div className="p-6 rounded-lg glassmorphic-card animate-in fade-in-up" style={{ animationDelay: `${delay}ms`}}>
      <div className="flex justify-center mb-4">
        <Icon className="h-8 w-8 text-accent" />
      </div>
      <h3 className="font-headline text-xl font-bold text-primary">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}
