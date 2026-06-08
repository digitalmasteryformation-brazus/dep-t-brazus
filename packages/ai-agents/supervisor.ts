// ============================================================
// BRAZUS Builder OS — Agent Superviseur
// Rôle : coordonne Architecte → Développeur → QA → Documentation
// et orchestre le pipeline complet de génération de plateforme.
// ============================================================

import { BaseAgent } from './base-agent';
import { ArchitectAgent } from './architect';
import { DeveloperAgent } from './developer';
import { QAAgent } from './qa';
import { DocumentationAgent } from './documentation';
import { MemoryManager } from './memory';
import type { AgentMessage, AgentResult, AgentRole, AgentRunContext, PipelineResult } from './types';
import { callClaude } from './claude-client';

export class SupervisorAgent extends BaseAgent {
  readonly role: AgentRole = 'supervisor';

  readonly systemPrompt = `Tu es le Superviseur de BRAZUS Builder OS. Tu reçois une demande de
génération de plateforme et tu coordonnes les agents Architecte, Développeur, QA et Documentation
pour produire le résultat final. Tu valides chaque étape avant de passer à la suivante.
Tu communiques en JSON structuré.`;

  // Le superviseur ne fait pas d'appel Claude direct dans run() — il orchestre.
  // (méthode requise par BaseAgent, déléguée à runPipeline)
  protected async run(input: AgentMessage, ctx: AgentRunContext): Promise<unknown> {
    return this.orchestrate(ctx);
  }

  private async orchestrate(ctx: AgentRunContext): Promise<PipelineResult> {
    const memory = new MemoryManager();
    const steps: AgentResult[] = [];

    const log = async (agent: AgentRole, type: 'context' | 'decision' | 'error', content: string) => {
      await memory.store({
        workspaceId: ctx.workspaceId,
        projectId: ctx.projectId,
        agentType: agent,
        memoryType: type,
        content,
        importance: type === 'error' ? 0.9 : 0.5,
      });
    };

    // 1) Architecte
    const architect = new ArchitectAgent();
    const architectResult = await architect.send(
      { role: 'supervisor', content: 'Démarrage du pipeline — étape architecture', metadata: {} },
      ctx
    );
    steps.push(architectResult);
    if (!architectResult.success) {
      await log('supervisor', 'error', `Architecte en échec: ${architectResult.error}`);
      return { success: false, steps };
    }
    await log('architect', 'decision', JSON.stringify(architectResult.output));

    // 2) Développeur
    const developer = new DeveloperAgent();
    const developerResult = await developer.send(
      { role: 'architect', content: JSON.stringify(architectResult.output), metadata: {} },
      ctx
    );
    steps.push(developerResult);
    if (!developerResult.success) {
      await log('supervisor', 'error', `Développeur en échec: ${developerResult.error}`);
      return { success: false, steps };
    }

    // 3) QA
    const qa = new QAAgent();
    const qaResult = await qa.send(
      { role: 'developer', content: JSON.stringify(developerResult.output), metadata: {} },
      ctx
    );
    steps.push(qaResult);
    if (!qaResult.success) {
      await log('supervisor', 'error', `QA en échec: ${qaResult.error}`);
      return { success: false, steps };
    }

    const validation = qaResult.output as { pass: boolean };
    if (!validation.pass) {
      await log('supervisor', 'error', 'QA a refusé le code généré — pipeline arrêté avant documentation');
      return { success: false, steps };
    }

    // 4) Documentation
    const documentation = new DocumentationAgent();
    const docResult = await documentation.send(
      { role: 'developer', content: JSON.stringify(developerResult.output), metadata: {} },
      ctx
    );
    steps.push(docResult);

    await log('supervisor', 'decision', 'Pipeline terminé avec succès');

    return {
      success: true,
      steps,
      finalOutput: {
        architecture: architectResult.output,
        codebase: developerResult.output,
        validation: qaResult.output,
        docs: docResult.output,
      },
    };
  }
}

/**
 * Point d'entrée principal : lance le pipeline complet de génération
 * de plateforme à partir d'une requête en langage naturel.
 */
export async function runPipeline(
  request: string,
  ctx: Pick<AgentRunContext, 'workspaceId' | 'projectId'>
): Promise<PipelineResult> {
  const supervisor = new SupervisorAgent();
  const fullCtx: AgentRunContext = { ...ctx, request };

  const result = await supervisor.send(
    { role: 'supervisor', content: request, metadata: {} },
    fullCtx
  );

  if (!result.success) {
    return { success: false, steps: [result] };
  }

  return result.output as PipelineResult;
}

// Ré-exports pratiques pour les consommateurs du package
export { ArchitectAgent, DeveloperAgent, QAAgent, DocumentationAgent };
export { callClaude };
