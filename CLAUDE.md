# CLAUDE.md — BRAZUS Builder OS

> Ce fichier est lu automatiquement par Claude au début de chaque session de travail sur ce projet. Il fait foi sur les conventions, l'architecture et les décisions prises. À mettre à jour à chaque sprint.

## 1. Projet

- **Nom** : BRAZUS Builder OS
- **Mission** : Générer automatiquement des plateformes digitales (CRM, dashboards, automatisations) personnalisées pour des entreprises clientes, du formulaire d'onboarding à la livraison du système opérationnel.
- **Statut** : MVP en construction — Phase 1 (Foundation)
- **Fondateur** : Non technique (TJC) — Claude agit comme Directeur Technique Virtuel et équipe de développement complète.

## 2. Stack technique

- **Frontend** : Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend** : Supabase (PostgreSQL, Auth, Storage, Realtime)
- **IA** : Claude API + Claude Code + Claude Cowork (orchestration multi-agents)
- **Déploiement** : Vercel (frontend/API) + Supabase (backend managé)
- **Repo** : GitHub — monorepo en pnpm workspaces (Node.js 20+)

## 3. Architecture — décisions

- **Monorepo** : oui (`apps/*` + `packages/*`), géré avec pnpm workspaces
- **Auth** : Supabase Auth — magic link + Google OAuth
- **Base de données** : PostgreSQL via Supabase, RLS activé sur **toutes** les tables
- **State management** : Zustand (état client) + React Query / TanStack Query (état serveur)
- **Style** : Tailwind CSS + shadcn/ui
- **IDs** : UUID partout, soft delete via colonne `deleted_at`

## 4. Conventions de code

- TypeScript strict mode obligatoire
- Composants React : `PascalCase`
- Fonctions / variables : `camelCase`
- Noms de fichiers : `kebab-case`
- Commits : Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
- Code et identifiants en anglais, commentaires et documentation en français
- Pas d'over-engineering : MVP d'abord, optimisation ensuite

## 5. Système multi-agents IA

BRAZUS orchestre 5 agents Claude spécialisés, coordonnés par un superviseur :

| Agent | Rôle |
|---|---|
| **Superviseur** | Coordonne les autres agents, distribue les tâches, valide les livrables |
| **Architecte** | Prend les décisions techniques et de structure |
| **Développeur** | Implémente le code |
| **QA** | Teste et valide chaque livrable |
| **Documentation** | Génère et maintient la documentation |

Règles : chaque agent a un seul rôle clairement défini, la communication se fait via des messages structurés, et toutes les actions sont loguées dans `/docs/`.

## 6. Mémoire projet

- `CLAUDE.md` (ce fichier) = mémoire système racine
- `apps/web/CLAUDE.md`, `packages/ai-agents/CLAUDE.md` = mémoires locales par module
- `/docs/` = journal des décisions, specs, prompts système des agents

## 7. Instructions pour Claude

1. Toujours lire ce fichier en entier avant de commencer une tâche sur ce projet.
2. Créer/mettre à jour des fichiers `.md` de suivi dans `/docs/` pour toute décision ou étape significative.
3. Valider chaque étape (build, lint, tests de base) avant de passer à la suivante.
4. Prioriser : MVP fonctionnel d'abord, refactor/optimisation ensuite.
5. Sécurité par défaut : RLS activé, secrets en variables d'environnement, jamais de données sensibles en clair.
6. Présenter au CEO (TJC) uniquement les décisions nécessitant son approbation (accès, paiements, actions irréversibles) — exécuter le reste de manière autonome.

## 8. Roadmap (vue d'ensemble)

1. **Phase 1 — Foundation** : structure GitHub, CLAUDE.md, Supabase initial *(en cours)*
2. **Phase 2 — AI System** : architecture multi-agents, memory system, orchestration Cowork
3. **Phase 3 — Infrastructure** : pipeline GitHub → Supabase → Vercel complet
4. **Phase 4 — V1 / Vision long terme** : industrialisation, multi-clients, scalabilité
