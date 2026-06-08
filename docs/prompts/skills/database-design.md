# Skill — Conception base de données
> version: 1.0 · composable · testable indépendamment

## Objectif
Produire un schéma de base de données PostgreSQL/Supabase robuste, sécurisé (RLS) et évolutif
à partir d'une description fonctionnelle de plateforme.

## Input attendu
```json
{ "domain": "crm | dashboard | saas | automation", "entities_hint": ["contacts", "deals", "..."], "constraints": ["multi-tenant", "soft-delete", "..."] }
```

## Tâche
1. Identifier les entités principales et leurs relations (1-N, N-N)
2. Définir les colonnes, types, contraintes (UUID, timestamps, soft delete via `deleted_at`)
3. Proposer les indexes sur les colonnes filtrées fréquemment
4. Définir les policies RLS (qui peut lire/écrire quoi, scoping par workspace)
5. Lister les triggers nécessaires (updated_at, création automatique, etc.)

## Output attendu
```json
{
  "tables": [{ "name": "...", "columns": [...], "indexes": [...] }],
  "policies": [{ "table": "...", "operation": "select|insert|update|delete", "rule": "..." }],
  "triggers": ["..."]
}
```

## Contraintes
- RLS activé sur toutes les tables exposées
- UUID pour tous les IDs, soft delete par défaut
- Pas de données sensibles stockées en clair

## Test de validation
Le schéma généré s'applique sans erreur via `apply_migration` et `get_advisors` ne remonte aucune
alerte de sécurité critique.
