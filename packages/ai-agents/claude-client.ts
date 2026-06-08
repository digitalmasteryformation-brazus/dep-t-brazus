// ============================================================
// BRAZUS Builder OS — Wrapper fin autour de l'API Claude
// Centralise l'appel modèle pour que tous les agents passent par
// le même point (logging, modèle, clé API, format JSON).
// ============================================================

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Modèle par défaut des agents BRAZUS — à ajuster dans .env si besoin
const DEFAULT_MODEL = process.env.BRAZUS_AGENT_MODEL ?? 'claude-sonnet-4-6';

export interface CallClaudeParams {
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  /** Si 'json', on demande explicitement une sortie JSON stricte au modèle */
  responseFormat?: 'json' | 'text';
  maxTokens?: number;
}

export async function callClaude(params: CallClaudeParams): Promise<string> {
  const { system, messages, responseFormat = 'text', maxTokens = 4096 } = params;

  const finalSystem =
    responseFormat === 'json'
      ? `${system}\n\nIMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans bloc markdown.`
      : system;

  const response = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: maxTokens,
    system: finalSystem,
    messages,
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Réponse Claude vide ou dans un format inattendu');
  }

  return textBlock.text.trim();
}
