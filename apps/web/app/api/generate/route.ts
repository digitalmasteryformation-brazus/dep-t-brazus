import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runPipeline } from '@brazus/ai-agents';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 300; // pipeline multi-agents : peut prendre plusieurs minutes

const requestSchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  request: z.string().min(20, 'Décrivez le besoin en au moins 20 caractères.'),
});

/**
 * POST /api/generate
 * Lance le pipeline multi-agents (Architecte → Développeur → QA → Documentation)
 * pour produire une plateforme à partir du brief fourni.
 *
 * Auth requise : utilisateur connecté + membre du workspace ciblé (vérifié via RLS).
 */
export async function POST(req: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Requête invalide.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { workspaceId, projectId, request: brief } = parsed.data;

  // Vérifie l'appartenance au workspace — la RLS bloquerait de toute façon,
  // mais on retourne ici un message clair plutôt qu'une erreur opaque.
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('workspace_id', workspaceId)
    .eq('profile_id', user.id) // colonne réelle du schéma : profile_id (pas user_id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json(
      { error: "Vous n'êtes pas membre de ce workspace." },
      { status: 403 }
    );
  }

  try {
    const result = await runPipeline(brief, { workspaceId, projectId, request: brief });
    return NextResponse.json(result);
  } catch (err) {
    console.error('[api/generate] pipeline error', err);
    return NextResponse.json(
      { error: 'Le pipeline de génération a échoué.', details: String(err) },
      { status: 500 }
    );
  }
}
