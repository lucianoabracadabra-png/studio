import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
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
          Seu kit de ferramentas tudo-em-um para jogos de RPG de mesa imersivos. Forje lendas, rastreie batalhas e dê vida ao seu mundo.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in-down" style={{ animationDelay: '400ms' }}>
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

        <div className="mt-24 text-center w-full animate-in fade-in-up" style={{ animationDelay: '600ms' }}>
            <h2 className="font-headline text-3xl font-bold text-foreground">Recursos</h2>
            <p className="mt-2 text-muted-foreground">Tudo que você precisa para sua próxima sessão de TTRPG.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard title="Gerenciamento de Campanhas" description="Crie e gerencie suas campanhas com facilidade." icon={Zap} delay={700} />
                <FeatureCard title="Fichas de Personagem Interativas" description="Fichas dinâmicas com atualizações em tempo real e rolagem de dados." icon={Zap} delay={800} />
                <FeatureCard title="Mesa de Jogo Virtual" description="Mapas imersivos com tokens, névoa de guerra e ferramentas de desenho." icon={Zap} delay={900} />
                <FeatureCard title="Geração com IA" description="Gere NPCs, itens e descrições com um único clique." icon={Zap} delay={1000} />
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
