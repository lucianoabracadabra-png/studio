import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden" style={{'--page-accent-color': 'hsl(var(--primary))'}}>
      <div className="container relative z-10 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-8 flex items-center justify-center gap-4">
          <Icons.logo className="h-16 w-16 text-primary" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            O Bruxo Nexus
          </h1>
        </div>

        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
          Seu kit de ferramentas tudo-em-um para jogos de RPG de mesa imersivos. Forje lendas, rastreie batalhas e dê vida ao seu mundo.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button asChild size="lg" className="font-bold group">
            <Link href="/dashboard">
              Abrir App <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold border-2 group">
            <Link href="/login">
              Login ou Cadastro
            </Link>
          </Button>
        </div>

        <div className="mt-24 text-center w-full">
            <h2 className="text-3xl font-bold">Recursos</h2>
            <p className="mt-2 text-muted-foreground">Tudo que você precisa para sua próxima sessão de TTRPG.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard title="Gerenciamento de Campanhas" description="Crie e gerencie suas campanhas com facilidade." icon={Zap} />
                <FeatureCard title="Fichas de Personagem Interativas" description="Fichas dinâmicas com atualizações em tempo real e rolagem de dados." icon={Zap} />
                <FeatureCard title="Mesa de Jogo Virtual" description="Mapas imersivos com tokens, névoa de guerra e ferramentas de desenho." icon={Zap} />
                <FeatureCard title="Geração com IA" description="Gere NPCs, itens e descrições com um único clique." icon={Zap} />
            </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <Card className="p-6">
      <div className="flex justify-center mb-4">
        <Icon className="h-8 w-8 text-accent" />
      </div>
      <h3 className="text-xl font-bold text-primary">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </Card>
  )
}
