# Skill — Conception API
> version: 1.0 · composable · testable indépendamment

## Objectif
Définir la structure des routes API (Next.js App Router / Supabase) nécessaires pour exposer
les fonctionnalités d'une plateforme générée par BRAZUS.

## Input attendu
```json
{ "schema": { "tables": ["..."] }, "features": ["liste contacts", "création opportunité", "..."] }
```

## Tâche
1. Lister les endpoints nécessaires (méthode + chemin + objectif)
2. Définir les schémas de requête/réponse (validation via zod)
3. Préciser l'auth requise par endpoint (public, authenticated, role-based)
4. Identifier les besoins de streaming (ex: génération IA en temps réel)

## Output attendu
```json
{
  "endpoints": [{ "method": "GET", "path": "/api/contacts", "auth": "authenticated", "input": {}, "output": {} }],
  "streaming": ["/api/generate"]
}
```

## Contraintes
- Validation stricte des entrées (zod ou équivalent)
- Réponses d'erreur structurées et cohérentes
- Pas de logique métier dans les routes — déléguer aux services/packages

## Test de validation
Chaque endpoint listé correspond à une route existante ou planifiée, avec un contrat
entrée/sortie clair et testable unitairement.
