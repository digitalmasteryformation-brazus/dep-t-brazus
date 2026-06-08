// ============================================================
// BRAZUS Builder OS — Memory Manager
// Persistance + récupération de la mémoire des agents via Supabase
// (table agent_memory, recherche sémantique par pgvector).
// Plafond : ~10k tokens de contexte récupéré par projet (voir summarize()).
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type MemoryType = 'context' | 'decision' | 'preference' | 'error';
export type AgentType = 'supervisor' | 'architect' | 'developer' | 'qa' | 'documentation';

export interface AgentMemoryRecord {
  id?: string;
  workspaceId: string | null;
  projectId: string | null;
  agentType: AgentType;
  memoryType: MemoryType;
  content: string;
  metadata?: Record<string, unknown>;
  importance?: number; // 0..1, défaut 0.5
}

const MAX_CONTEXT_CHARS = 10_000 * 4; // approx. 4 caractères / token

export class MemoryManager {
  private client: SupabaseClient;

  constructor(client?: SupabaseClient) {
    this.client =
      client ??
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
      );
  }

  /** Enregistre un souvenir (décision, contexte, préférence ou erreur). */
  async store(memory: AgentMemoryRecord): Promise<void> {
    const { error } = await this.client.from('agent_memory').insert({
      workspace_id: memory.workspaceId,
      project_id: memory.projectId,
      agent_type: memory.agentType,
      memory_type: memory.memoryType,
      content: memory.content,
      metadata: memory.metadata ?? {},
      importance: memory.importance ?? 0.5,
      // L'embedding est calculé côté Edge Function (séparation des responsabilités) :
      // voir /docs/architecture/memory-embeddings.md
    });

    if (error) throw new Error(`MemoryManager.store: ${error.message}`);
  }

  /**
   * Récupère les souvenirs les plus pertinents pour une requête, par ordre
   * d'importance et de récence (recherche textuelle simple — la recherche
   * sémantique passe par `searchSimilar` une fois l'embedding calculé).
   */
  async retrieve(query: string, limit = 10): Promise<AgentMemoryRecord[]> {
    const { data, error } = await this.client
      .from('agent_memory')
      .select('*')
      .ilike('content', `%${query}%`)
      .order('importance', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`MemoryManager.retrieve: ${error.message}`);
    return (data ?? []).map(MemoryManager.fromRow);
  }

  /** Recherche sémantique (RAG) via la fonction SQL match_agent_memory. */
  async searchSimilar(
    embedding: number[],
    workspaceId: string,
    projectId?: string,
    limit = 5
  ): Promise<AgentMemoryRecord[]> {
    const { data, error } = await this.client.rpc('match_agent_memory', {
      query_embedding: embedding,
      match_workspace_id: workspaceId,
      match_project_id: projectId ?? null,
      match_count: limit,
    });

    if (error) throw new Error(`MemoryManager.searchSimilar: ${error.message}`);
    return (data ?? []).map((row: Record<string, unknown>) => ({
      workspaceId,
      projectId: projectId ?? null,
      agentType: row.agent_type as AgentType,
      memoryType: row.memory_type as MemoryType,
      content: row.content as string,
      importance: row.importance as number,
    }));
  }

  /**
   * Construit un résumé de contexte (≤ ~10k tokens) pour un projet,
   * trié par importance décroissante puis tronqué.
   */
  async summarize(projectId: string): Promise<string> {
    const { data, error } = await this.client
      .from('agent_memory')
      .select('agent_type, memory_type, content, importance, created_at')
      .eq('project_id', projectId)
      .order('importance', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw new Error(`MemoryManager.summarize: ${error.message}`);

    let summary = '';
    for (const row of data ?? []) {
      const line = `[${row.agent_type}/${row.memory_type}] (importance ${row.importance}) ${row.content}\n`;
      if (summary.length + line.length > MAX_CONTEXT_CHARS) break;
      summary += line;
    }

    return summary.trim();
  }

  /** Efface toute la mémoire d'un projet (ex: nouvelle génération from scratch). */
  async clear(projectId: string): Promise<void> {
    const { error } = await this.client.from('agent_memory').delete().eq('project_id', projectId);
    if (error) throw new Error(`MemoryManager.clear: ${error.message}`);
  }

  private static fromRow(row: Record<string, unknown>): AgentMemoryRecord {
    return {
      id: row.id as string,
      workspaceId: row.workspace_id as string | null,
      projectId: row.project_id as string | null,
      agentType: row.agent_type as AgentType,
      memoryType: row.memory_type as MemoryType,
      content: row.content as string,
      metadata: row.metadata as Record<string, unknown>,
      importance: row.importance as number,
    };
  }
}
