import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export const metadata = { title: 'Mes projets — BRAZUS Builder OS' };

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // RLS (`projects_select_via_workspace`-style policy attendue) limite déjà
  // le résultat aux projets des workspaces dont l'utilisateur est membre.
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, status, created_at, workspace_id, workspaces ( name )')
    .order('created_at', { ascending: false });

  return (
    <main className="container flex flex-col gap-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes projets</h1>
          <p className="mt-1 text-muted-foreground">Plateformes générées ou en cours de génération.</p>
        </div>
        <Button asChild>
          <Link href="/generate">
            <Sparkles className="h-4 w-4" /> Nouvelle génération
          </Link>
        </Button>
      </div>

      {!projects || projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <p>Aucun projet pour le moment.</p>
            <Button asChild>
              <Link href="/generate">Lancer ma première génération</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <Badge variant="outline" className="capitalize">{p.status}</Badge>
                </div>
                <CardDescription>
                  {/* @ts-expect-error — relation Supabase typée en runtime, pas en types générés */}
                  {p.workspaces?.name ?? 'Workspace'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Créé le {new Date(p.created_at as string).toLocaleDateString('fr-FR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
