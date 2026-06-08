# BRAZUS Builder OS

> Une usine intelligente qui construit automatiquement des systèmes digitaux personnalisés pour des entreprises (CRM, dashboards, automations).

## 🎯 Mission

Devenir le premier système de génération automatisée de plateformes IA pour les agences francophones — du formulaire client au système livré, sans intervention manuelle lourde.

## 🧱 Stack technique

| Couche | Techno |
|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind |
| Backend | Supabase (Auth, Postgres, Storage, Realtime) |
| IA | Claude API + Claude Code + Claude Cowork |
| Déploiement | Vercel (frontend) + Supabase (backend) |
| Source control | GitHub (monorepo pnpm workspaces) |

## 📁 Structure du repo

```
/brazus-builder-os
├── apps/
│   ├── web/           # Next.js frontend
│   └── api/           # API Routes
├── packages/
│   ├── ai-agents/     # Agents Claude (superviseur, architecte, dev, QA, doc)
│   ├── ui/            # Composants partagés
│   └── db/            # Client + schéma + migrations Supabase
├── docs/
│   ├── prompts/       # Prompts système des agents
│   └── architecture/  # Décisions d'architecture (ADR)
├── scripts/           # Scripts d'automatisation
├── .github/workflows/ # CI/CD
└── CLAUDE.md          # Mémoire projet pour Claude
```

## 🚀 Démarrage

```bash
pnpm install
pnpm dev
```

## 📜 Conventions

- TypeScript strict mode partout
- Composants en `PascalCase`, fonctions en `camelCase`, fichiers en `kebab-case`
- Commits conventionnels (`feat:`, `fix:`, `docs:`, `chore:`...)
- Documentation en français, code et identifiants en anglais
- MVP d'abord, optimisation ensuite

## 🧠 Mémoire projet

Voir [`CLAUDE.md`](./CLAUDE.md) — c'est la référence que Claude lit avant chaque session de travail sur ce projet.

## 📋 Statut

MVP en construction — Phase 1 (Foundation).
