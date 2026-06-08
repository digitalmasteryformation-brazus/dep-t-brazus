// ============================================================
// BRAZUS Builder OS — Agent QA
// Rôle : tests, validation sécurité et performance du code généré
// ============================================================

import { BaseAgent } from './base-agent';
import type { AgentMessage, AgentRunContext, AgentRole, ValidationReport } from './types';
import { callClaude } from './claude-client';
import type { GeneratedCodebase } from './developer';

export class QAAgent extends BaseAgent {
  readonly role: AgentRole = 'qa';

  readonly systemPrompt = `Tu es le QA de BRAZUS. Tu reçois du code et tu : identifies les bugs,
proposes des tests, valides la sécurité (RLS, injections, secrets en clair), vérifies les
performances (N+1, indexes manquants). Tu output un VALIDATION.json avec { pass, issues, testsProposed }.`;

  protected async run(input: AgentMessage, _ctx: AgentRunContext): Promise<ValidationReport> {
    const codebase = JSON.parse(input.content) as GeneratedCodebase;

    const response = await callClaude({
      system: this.systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Code à valider (${codebase.files.length} fichiers) :\n${JSON.stringify(codebase.files.map((f) => f.path))}\n\nContenu complet :\n${JSON.stringify(codebase, null, 2)}\n\nProduis un VALIDATION.json.`,
        },
      ],
      responseFormat: 'json',
    });

    return JSON.parse(response) as ValidationReport;
  }
}
