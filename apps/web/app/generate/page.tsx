import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { GeneratorForm } from './generator-form';

export const metadata = { title: 'Générer une plateforme — BRAZUS Builder OS' };

/**
 * Page Générateur IA (Prompt 3.2).
 * Garantit qu'un workspace + un projet existent pour l'utilisateur avant
 * d'afficher le formulaire (créés à la volée si premier passage — onboarding minimal).
 */
export default async function GeneratePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1) Cherche un workspace existant dont l'utilisateur est membre
  let { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();

  // 2) Sinon, crée un workspace par défaut (le trigger handle_new_user a déjà créé le profil)
  //    NOTE : `slug` est UNIQUE NOT NULL en base — on en génère un à partir de l'id utilisateur
  //    pour garantir l'unicité dès le premier passage (pas de saisie manuelle à ce stade).
  if (!workspace) {
    const slug = `espace-${user.id.slice(0, 8)}`;
    const { data: created, error } = await supabase
      .from('workspaces')
      .insert({ name: 'Mon espace', slug, owner_id: user.id })
      .select('id, name')
      .single();

    if (error || !created) {
      throw new Error(`Impossible de créer un workspace par défaut : ${error?.message}`);
    }
    workspace = created;
  }

  // 3) Cherche un projet existant dans ce workspace
  let { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('workspace_id', workspace.id)
    .limit(1)
    .maybeSingle();

  // 4) Sinon, crée un projet par défaut
  if (!project) {
    const { data: created, error } = await supabase
      .from('projects')
      .insert({ workspace_id: workspace.id, name: 'Nouveau projet', status: 'draft' })
      .select('id, name')
      .single();

    if (error || !created) {
      throw new Error(`Impossible de créer un projet par défaut : ${error?.message}`);
    }
    project = created;
  }

  return (
    <main className="container flex flex-col gap-6 py-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Générateur IA</h1>
        <p className="mt-1 text-muted-foreground">
          Workspace « {workspace.name} » · Projet « {project.name} »
        </p>
      </div>
      <GeneratorForm workspaceId={workspace.id} projectId={project.id} />
    </main>
  );
}
