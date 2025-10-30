import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import wikiData from "@/lib/data/wiki-data.json";
import { iconMap } from "@/lib/wiki-data";
import { ArrowRight, BookCopy } from "lucide-react";

export default function WikiPage() {
  const { portals } = wikiData;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">O Bruxo Nexus Wiki</h1>
        <p className="mt-2 text-muted-foreground text-lg">O seu guia completo para o universo, regras e segredos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portals.map((portal) => {
          const Icon = iconMap[portal.icon as keyof typeof iconMap] || BookCopy;
          const href = portal.href || `/wiki/${portal.id}`;
          return (
            <Link href={href} key={portal.id} className="block group">
              <Card className="h-full flex flex-col transition-all hover:border-[var(--page-accent-color)]">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="p-3 rounded-md bg-muted">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl transition-colors">{portal.title}</CardTitle>
                    <CardDescription>{portal.subtitle}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{portal.description}</p>
                </CardContent>
                <CardFooter>
                    <p className="text-sm font-semibold flex items-center gap-2 text-[var(--page-accent-color)]">
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
