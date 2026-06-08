'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const PIPELINE_STEPS = [
  { agent: 'architect', label: 'Architecte', description: 'Conçoit le schéma de données et la structure technique' },
  { agent: 'developer', label: 'Développeur', description: 'Génère le code de la plateforme' },
  { agent: 'qa', label: 'QA', description: 'Valide la qualité et la sécurité du résultat' },
  { agent: 'documentation', label: 'Documentation', description: 'Rédige le guide utilisateur et le README' },
] as const;

type StepStatus = 'pending' | 'running' | 'success' | 'error';

interface GeneratorFormProps {
  workspaceId: string;
  projectId: string;
}

export function GeneratorForm({ workspaceId, projectId }: GeneratorFormProps) {
  const [brief, setBrief] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
  const [error, setError] = useState<string | null>(null);
  const [finalOutput, setFinalOutput] = useState<unknown>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFinalOutput(null);
    setIsRunning(true);

    // Affichage optimiste : on anime la progression pendant que le pipeline
    // tourne côté serveur (l'API ne stream pas encore étape par étape).
    const initialStatuses: Record<string, StepStatus> = {};
    PIPELINE_STEPS.forEach((s, i) => {
      initialStatuses[s.agent] = i === 0 ? 'running' : 'pending';
    });
    setStepStatuses(initialStatuses);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, request: brief }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue.');
        setStepStatuses((prev) => {
          const next = { ...prev };
          const firstPending = PIPELINE_STEPS.find((s) => next[s.agent] !== 'success');
          if (firstPending) next[firstPending.agent] = 'error';
          return next;
        });
        return;
      }

      const next: Record<string, StepStatus> = {};
      for (const step of PIPELINE_STEPS) {
        const result = data.steps?.find((s: { agent: string }) => s.agent === step.agent);
        next[step.agent] = result ? (result.success ? 'success' : 'error') : 'pending';
      }
      setStepStatuses(next);
      setFinalOutput(data.finalOutput ?? null);

      if (!data.success) {
        setError("Le pipeline s'est arrêté avant la fin — voir le détail des étapes ci-dessous.");
      }
    } catch (err) {
      setError("Impossible de contacter le service de génération.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Décrivez votre besoin</CardTitle>
          <CardDescription>
            Plus le brief est précis (secteur d&apos;activité, fonctionnalités attendues, ton de marque),
            meilleur sera le résultat généré par les agents IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Ex: Un CRM pour une agence immobilière avec gestion des biens, des prospects et un pipeline de vente en 5 étapes..."
              rows={8}
              required
              minLength={20}
              disabled={isRunning}
            />
            <Button type="submit" size="lg" disabled={isRunning} className="self-start">
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Génération en cours…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Lancer la génération
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline multi-agents</CardTitle>
          <CardDescription>Suivi de la progression en temps réel.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {PIPELINE_STEPS.map((step) => {
            const status = stepStatuses[step.agent] ?? 'pending';
            return (
              <div
                key={step.agent}
                className={cn(
                  'flex items-start gap-3 rounded-md border p-4 transition-colors',
                  status === 'running' && 'border-primary/50 bg-primary/5',
                  status === 'success' && 'border-emerald-500/30 bg-emerald-500/5',
                  status === 'error' && 'border-destructive/30 bg-destructive/5'
                )}
              >
                <div className="mt-0.5">
                  {status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />}
                  {status === 'running' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                  {status === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  {status === 'error' && <XCircle className="h-5 w-5 text-destructive" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{step.label}</span>
                    <Badge variant="outline" className="text-xs capitalize">{status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}

          {finalOutput ? (
            <div className="mt-2 rounded-md border bg-muted/40 p-4">
              <p className="mb-2 text-sm font-medium">Résultat final</p>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">
                {JSON.stringify(finalOutput, null, 2)}
              </pre>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
