import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, LayoutDashboard, Workflow, Rocket } from 'lucide-react';

const PLATFORM_TYPES = [
  {
    icon: LayoutDashboard,
    title: 'CRM',
    description: 'Gestion de contacts, pipelines de vente et opportunités sur-mesure.',
  },
  {
    icon: Sparkles,
    title: 'Dashboard',
    description: 'Tableaux de bord analytiques connectés aux données de vos clients.',
  },
  {
    icon: Workflow,
    title: 'Automatisation',
    description: 'Workflows métier générés et orchestrés automatiquement.',
  },
  {
    icon: Rocket,
    title: 'Landing & SaaS',
    description: 'Pages et applications complètes prêtes à déployer.',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <section className="container flex flex-col items-center gap-6 py-24 text-center">
        <Badge variant="secondary" className="px-3 py-1">
          BRAZUS Builder OS
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          L'usine intelligente qui génère vos plateformes digitales
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Décrivez le besoin de votre client. Notre équipe d'agents IA conçoit,
          développe, teste et documente automatiquement le CRM, le dashboard ou
          l'automatisation correspondant — prêt à déployer.
        </p>
        <div className="flex gap-3">
          <Button size="lg" asChild>
            <Link href="/generate">Générer une plateforme</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">Voir mes projets</Link>
          </Button>
        </div>
      </section>

      <section className="container grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_TYPES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>
    </main>
  );
}
