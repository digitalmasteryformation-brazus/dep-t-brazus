# Skill — Déploiement
> version: 1.0 · composable · testable indépendamment

## Objectif
Préparer et documenter le déploiement d'une plateforme générée : export GitHub, configuration
Vercel, variables d'environnement, et checklist de mise en production.

## Input attendu
```json
{ "project_name": "...", "stack": ["Next.js", "Supabase", "Vercel"], "env_vars_needed": ["NEXT_PUBLIC_SUPABASE_URL", "..."] }
```

## Tâche
1. Générer la configuration de déploiement (vercel.json si nécessaire, scripts de build)
2. Lister les variables d'environnement requises (sans jamais inclure de valeurs sensibles)
3. Définir la checklist pré-déploiement (build OK, tests passés, RLS vérifié, domaine configuré)
4. Documenter la procédure de rollback en cas de problème

## Output attendu
```json
{
  "deployConfig": { "framework": "nextjs", "buildCommand": "pnpm build" },
  "envVars": ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "ANTHROPIC_API_KEY"],
  "checklist": ["build local OK", "migrations Supabase appliquées", "RLS testé", "domaine + SSL configurés"],
  "rollback": "redéployer le dernier commit stable depuis Vercel (Instant Rollback)"
}
```

## Contraintes
- Jamais de secrets en clair dans le code ou la config versionnée
- HTTPS forcé, domaine custom configuré via Vercel
- Toujours fournir une procédure de rollback documentée

## Test de validation
Le déploiement de staging réussit, l'app répond en HTTPS, et la checklist est cochée à 100%
avant bascule en production.
