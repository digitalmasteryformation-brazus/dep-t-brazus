// ============================================================
// BRAZUS Builder OS — Agent de base
// Tous les agents héritent de cette classe.
// Agents stateless : aucune mémoire conservée entre les runs
// (la persistance passe exclusivement par MemoryManager / Supabase).
// ============================================================

import type { AgentMessage, AgentResult, AgentRole, AgentRunContext } from './types';

const TIMEOUT_MS = 60_000;
const MAX_RETRIES = 3;

export abstract class BaseAgent {
  abstract readonly role: AgentRole;
  abstract readonly systemPrompt: string;

  /**
   * Envoie une requête à Claude pour ce rôle d'agent et retourne
   * un message structuré. Implémente timeout + retry automatique.
   */
  async send(input: AgentMessage, ctx: AgentRunContext): Promise<AgentResult> {
    const startedAt = Date.now();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const output = await this.withTimeout(this.run(input, ctx), TIMEOUT_MS);
        return {
          agent: this.role,
          success: true,
          output,
          durationMs: Date.now() - startedAt,
        };
      } catch (err) {
        if (attempt === MAX_RETRIES) {
          return {
            agent: this.role,
            success: false,
            output: null,
            error: err instanceof Error ? err.message : String(err),
            durationMs: Date.now() - startedAt,
          };
        }
        // backoff exponentiel simple avant retry
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }

    // Inatteignable — satisfait le compilateur TypeScript
    throw new Error('unreachable');
  }

  /** Implémentation spécifique de chaque agent (appel Claude API). */
  protected abstract run(input: AgentMessage, ctx: AgentRunContext): Promise<unknown>;

  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Agent ${this.role} timeout après ${ms}ms`)), ms);
      promise.then(
        (v) => { clearTimeout(timer); resolve(v); },
        (e) => { clearTimeout(timer); reject(e); }
      );
    });
  }
}
