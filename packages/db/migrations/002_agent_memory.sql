-- ============================================================
-- BRAZUS Builder OS — Memory System (Phase 2 / Prompt 2.2)
-- Mémoire persistante des agents, segmentée par workspace/projet
-- Appliquée sur Supabase project: hhmheazriifkbeylsiok
-- ============================================================

create extension if not exists "vector";

create table public.agent_memory (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  agent_type text not null check (agent_type in ('supervisor', 'architect', 'developer', 'qa', 'documentation')),
  memory_type text check (memory_type in ('context', 'decision', 'preference', 'error')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  importance float default 0.5 check (importance >= 0 and importance <= 1),
  embedding vector(1024),
  created_at timestamptz default now()
);

create index idx_agent_memory_workspace on public.agent_memory(workspace_id);
create index idx_agent_memory_project on public.agent_memory(project_id);
create index idx_agent_memory_agent_type on public.agent_memory(agent_type);
create index idx_agent_memory_importance on public.agent_memory(importance desc);
create index idx_agent_memory_embedding on public.agent_memory using hnsw (embedding vector_cosine_ops);

alter table public.agent_memory enable row level security;

create policy "agent_memory_select_workspace_members" on public.agent_memory
  for select to authenticated using (workspace_id is null or public.is_workspace_member(workspace_id));
create policy "agent_memory_insert_workspace_members" on public.agent_memory
  for insert to authenticated with check (workspace_id is null or public.is_workspace_member(workspace_id));
create policy "agent_memory_delete_workspace_members" on public.agent_memory
  for delete to authenticated using (workspace_id is null or public.is_workspace_member(workspace_id));

-- Recherche sémantique par similarité cosinus (RAG)
create or replace function public.match_agent_memory(
  query_embedding vector(1024),
  match_workspace_id uuid,
  match_project_id uuid default null,
  match_count int default 5
)
returns table (id uuid, content text, memory_type text, agent_type text, importance float, similarity float)
language sql security invoker stable set search_path = public as $$
  select m.id, m.content, m.memory_type, m.agent_type, m.importance,
         1 - (m.embedding <=> query_embedding) as similarity
  from public.agent_memory m
  where m.workspace_id = match_workspace_id
    and (match_project_id is null or m.project_id = match_project_id)
    and m.embedding is not null
  order by m.embedding <=> query_embedding
  limit match_count;
$$;

revoke execute on function public.match_agent_memory(vector, uuid, uuid, int) from public, anon;
grant execute on function public.match_agent_memory(vector, uuid, uuid, int) to authenticated;
