// ============================================================
// BRAZUS Builder OS — Agent Développeur
// Rôle : implémentation du code à partir de l'ARCHITECTURE.json
// ============================================================

import { BaseAgent } from './base-agent';
import type { AgentMessage, AgentRunContext, AgentRole, ArchitectureSpec } from './types';
import { callClaude } from './claude-client';

export interface GeneratedCodebase {
  files: Array<{ path: string; content: string }>;
  notes: string[];
}

export class DeveloperAgent extends BaseAgent {
  readonly role: AgentRole = 'developer';

  readonly systemPrompt = `Tu es le Développeur de BRAZUS. Tu reçois un ARCHITECTURE.json et tu génères
le code complet : composants React, API routes, requêtes Supabase, configuration Vercel.
Code production-ready uniquement — pas de pseudo-code, pas de TODO. Réponds en JSON structuré
{ files: [{ path, content }], notes: string[] }.`;

  protected async run(input: AgentMessage, ctx: AgentRunContext): Promise<GeneratedCodebase> {
    const architecture = JSON.parse(input.content) as ArchitectureSpec;

    const response = await callClaude({
      system: this.systemPrompt,
      messages: [
        {
          role: 'user',
          content: `ARCHITECTURE.json reçue :\n${JSON.stringify(architecture, null, 2)}\n\nGénère le code complet (fichiers + contenu) pour le projet "${ctx.request}".`,
        },
      ],
      responseFormat: 'json',
    });

    return JSON.parse(response) as GeneratedCodebase;
  }
}
