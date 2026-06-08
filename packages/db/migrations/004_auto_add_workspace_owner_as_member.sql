-- ============================================================
-- Gap découvert pendant la Phase 3 (frontend) — appliquée 2026-06-07
-- Un utilisateur qui crée un workspace n'était PAS automatiquement ajouté
-- à workspace_members, ce qui bloquait ensuite la création/lecture de
-- projets via is_workspace_member() (RLS sur public.projects).
-- ============================================================

create or replace function public.handle_new_workspace()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_members (workspace_id, profile_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_workspace() from public, anon, authenticated;

create trigger trg_on_workspace_created
  after insert on public.workspaces
  for each row execute function public.handle_new_workspace();
