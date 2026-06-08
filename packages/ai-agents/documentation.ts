// ============================================================
// BRAZUS Builder OS — Agent Documentation
// Rôle : génère la documentation du projet livré (README, guide d'utilisation)
// ============================================================

import { BaseAgent } from './base-agent';
import type { AgentMessage, AgentRunContext, AgentRole } from './types';
import { callClaude } from './claude-client';
import type { GeneratedCodebase } from './developer';

export interface GeneratedDocs {
  readme: string;
  userGuide: string;
}

export class DocumentationAgent extends BaseAgent {
  readonly role: AgentRole = 'documentation';

  readonly systemPrompt = `Tu es l'agent Documentation de BRAZUS. Tu reçois le code généré et tu
rédiges une documentation claire en français : README technique + guide d'utilisation pour le
client final (non technique). Réponds en JSON { readme: string, userGuide: string }.`;

  protected async run(input: AgentMessage, ctx: AgentRunContext): Promise<GeneratedDocs> {
    const codebase = JSON.parse(input.content) as GeneratedCodebase;

    const response = await callClaude({
      system: this.systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Projet : "${ctx.request}"\nFichiers générés : ${JSON.stringify(codebase.files.map((f) => f.path))}\n\nRédige le README technique et le guide d'utilisation.`,
        },
      ],
      responseFormat: 'json',
    });

    return JSON.parse(response) as GeneratedDocs;
  }
}
