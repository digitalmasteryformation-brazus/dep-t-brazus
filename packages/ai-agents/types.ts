// ============================================================
// BRAZUS Builder OS — Types partagés du système multi-agents
// ============================================================

export type AgentRole = 'supervisor' | 'architect' | 'developer' | 'qa' | 'documentation';

export interface AgentMessage {
  /** Rôle de l'émetteur du message */
  role: AgentRole;
  /** Contenu structuré (JSON sérialisable) ou texte */
  content: string;
  /** Métadonnées : projectId, workspaceId, step, timestamps, etc. */
  metadata: Record<string, unknown>;
}

export interface AgentRunContext {
  workspaceId: string;
  projectId: string;
  /** Requête initiale du fondateur (ex: "génère-moi un CRM pour une agence immo") */
  request: string;
}

export interface AgentResult {
  agent: AgentRole;
  success: boolean;
  output: unknown;
  /** Texte d'erreur si success === false */
  error?: string;
  durationMs: number;
}

export interface PipelineResult {
  success: boolean;
  steps: AgentResult[];
  finalOutput?: unknown;
}

/** Sortie attendue de l'Architecte : description complète de l'architecture cible */
export interface ArchitectureSpec {
  database: Record<string, unknown>;
  frontend: Record<string, unknown>;
  api: Record<string, unknown>;
  techChoices: string[];
}

/** Sortie attendue du QA : verdict de validation */
export interface ValidationReport {
  pass: boolean;
  issues: Array<{ severity: 'low' | 'medium' | 'high' | 'critical'; message: string }>;
  testsProposed: string[];
}
