-- ============================================================
-- Correctifs suite à get_advisors (Supabase) — appliqués 2026-06-07
-- Appliquée sur Supabase project: hhmheazriifkbeylsiok
--
-- 1) Performance : auth.uid() était ré-évalué à chaque ligne dans les
--    policies RLS → remplacé par (select auth.uid()) (calcul unique/requête)
-- 2) Sécurité : rls_auto_enable() (event trigger pré-existant du projet)
--    était exécutable via /rest/v1/rpc/rls_auto_enable → verrouillé
-- ============================================================

-- --- Profiles ---
drop policy "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- --- Workspaces ---
drop policy "workspaces_select_members" on public.workspaces;
create policy "workspaces_select_members" on public.workspaces
  for select to authenticated
  using (public.is_workspace_member(id) or owner_id = (select auth.uid()));

drop policy "workspaces_insert_own" on public.workspaces;
create policy "workspaces_insert_own" on public.workspaces
  for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy "workspaces_update_owner" on public.workspaces;
create policy "workspaces_update_owner" on public.workspaces
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

-- --- Workspace members ---
drop policy "workspace_members_insert_owner" on public.workspace_members;
create policy "workspace_members_insert_owner" on public.workspace_members
  for insert to authenticated
  with check (
    exists (
      select 1 from public.workspaces w
      where w.id = workspace_id and w.owner_id = (select auth.uid())
    )
  );

-- --- Lock down rls_auto_enable (event trigger interne, pas une RPC publique) ---
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
