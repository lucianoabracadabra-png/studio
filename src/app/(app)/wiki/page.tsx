import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import { portals, iconMap } from "@/lib/wiki-data";
import { ArrowRight } from "lucide-react";

export default function WikiPage() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-6">
      <div className="text-center animate-in fade-in-down">
        <h1 className="text-4xl font-headline magical-glow">O Bruxo Nexus Wiki</h1>
        <p className="mt-2 text-muted-foreground text-lg">O seu guia completo para o universo, regras e segredos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-up" style={{ animationDelay: '200ms' }}>
        {portals.map((portal, i) => {
          const Icon = iconMap[portal.icon];
          return (
            <Link href={`/wiki/${portal.id}`} key={portal.id} className="block group">
              <Card className="glassmorphic-card h-full flex flex-col" style={{ animationDelay: `${i * 100}ms`}}>
                <CardHeader className="flex-row items-center gap-4">
                  <div className="p-3 rounded-md">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{portal.title}</CardTitle>
                    <CardDescription>{portal.subtitle}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{portal.description}</p>
                </CardContent>
                <CardFooter>
                    <p className="text-sm font-bold text-accent flex items-center gap-2">
                        Explorar Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </p>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
