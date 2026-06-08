// ============================================================
// BRAZUS Builder OS — Agent Architecte
// Rôle : décisions techniques et design système
// ============================================================

import { BaseAgent } from './base-agent';
import type { AgentMessage, AgentRunContext, AgentRole, ArchitectureSpec } from './types';
import { callClaude } from './claude-client';

export class ArchitectAgent extends BaseAgent {
  readonly role: AgentRole = 'architect';

  readonly systemPrompt = `Tu es l'Architecte de BRAZUS. Tu analyses les besoins et produis : schéma de
base de données, architecture frontend, structure API, choix techniques.
Tu output un ARCHITECTURE.json complet et valide. Pas de prose, uniquement du JSON structuré.`;

  protected async run(input: AgentMessage, ctx: AgentRunContext): Promise<ArchitectureSpec> {
    const response = await callClaude({
      system: this.systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Demande client : "${ctx.request}"\n\nContexte additionnel : ${input.content}\n\nProduis un ARCHITECTURE.json avec les clés: database, frontend, api, techChoices.`,
        },
      ],
      responseFormat: 'json',
    });

    return JSON.parse(response) as ArchitectureSpec;
  }
}
