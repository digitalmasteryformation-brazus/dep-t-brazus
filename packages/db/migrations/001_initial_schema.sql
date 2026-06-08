-- ============================================================
-- BRAZUS Builder OS — Migration initiale (Phase 1 / Prompt 1.3)
-- Profiles, Workspaces, Workspace Members, Projects + RLS
-- Appliquée sur Supabase project: hhmheazriifkbeylsiok
-- ============================================================

create extension if not exists "pgcrypto";

-- Profiles (liés à auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'member' check (role in ('admin', 'member', 'viewer')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- Workspaces
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_id uuid references public.profiles(id) on delete set null,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- Workspace members (liaison)
create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz default now(),
  primary key (workspace_id, profile_id)
);

-- Projects (plateformes générées)
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  type text check (type in ('crm', 'dashboard', 'saas', 'automation')),
  status text default 'draft' check (status in ('draft', 'in_progress', 'review', 'live', 'archived')),
  config jsonb default '{}'::jsonb,
  github_repo text,
  vercel_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- Indexes
create index idx_workspaces_owner_id on public.workspaces(owner_id);
create index idx_workspace_members_profile_id on public.workspace_members(profile_id);
create index idx_projects_workspace_id on public.projects(workspace_id);
create index idx_projects_status on public.projects(status);
create index idx_profiles_deleted_at on public.profiles(deleted_at);
create index idx_workspaces_deleted_at on public.workspaces(deleted_at);
create index idx_projects_deleted_at on public.projects(deleted_at);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_workspaces_updated_at before update on public.workspaces
  for each row execute function public.set_updated_at();
create trigger trg_projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is current user a member of a workspace?
create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace_id and wm.profile_id = auth.uid()
  );
$$;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.projects enable row level security;

create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (deleted_at is null);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "workspaces_select_members" on public.workspaces
  for select to authenticated using (public.is_workspace_member(id) or owner_id = auth.uid());
create policy "workspaces_insert_own" on public.workspaces
  for insert to authenticated with check (owner_id = auth.uid());
create policy "workspaces_update_owner" on public.workspaces
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "workspace_members_select_members" on public.workspace_members
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "workspace_members_insert_owner" on public.workspace_members
  for insert to authenticated with check (
    exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid())
  );

create policy "projects_select_workspace_members" on public.projects
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "projects_insert_workspace_members" on public.projects
  for insert to authenticated with check (public.is_workspace_member(workspace_id));
create policy "projects_update_workspace_members" on public.projects
  for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

-- ============================================================
-- 002 — Lock down internal helper functions (security hardening)
-- ============================================================
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.is_workspace_member(uuid) from public, anon;
grant execute on function public.is_workspace_member(uuid) to authenticated;
