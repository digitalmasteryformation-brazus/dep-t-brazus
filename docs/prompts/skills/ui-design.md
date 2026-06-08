# Skill — Conception UI
> version: 1.0 · composable · testable indépendamment

## Objectif
Définir la structure des écrans, composants et parcours utilisateur d'une plateforme générée,
en cohérence avec le design system BRAZUS (Tailwind + shadcn/ui, mobile-first).

## Input attendu
```json
{ "platform_type": "crm | dashboard | saas | automation", "features": ["..."], "brand": { "primary_color": "#f97316", "tone": "professionnel" } }
```

## Tâche
1. Lister les pages/écrans nécessaires et leur hiérarchie de navigation
2. Identifier les composants réutilisables (cartes, tableaux, formulaires, modales)
3. Définir le parcours utilisateur principal (du premier écran à l'objectif clé)
4. Préciser les états (chargement, vide, erreur, succès) pour chaque écran clé

## Output attendu
```json
{
  "pages": [{ "path": "/dashboard", "components": ["Sidebar", "StatsCards", "RecentActivity"] }],
  "components": ["ProjectCard", "GeneratorForm", "..."],
  "userFlow": ["login", "select_type", "configure", "generate", "preview", "deploy"]
}
```

## Contraintes
- Mobile-first, Server Components par défaut (Next.js App Router)
- Réutiliser shadcn/ui plutôt que recréer des composants de base
- Couleur d'accent : orange-500 (`#f97316`), base zinc, police Inter

## Test de validation
La structure proposée couvre 100% des fonctionnalités listées en input et chaque écran a un état
de chargement/erreur/vide défini.
