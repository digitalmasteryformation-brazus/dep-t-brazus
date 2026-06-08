# @brazus/db

Schéma et migrations Supabase pour BRAZUS Builder OS.

## Projet Supabase

- **Nom** : digitalmasteryformation-brazus's Project
- **Project ID** : `hhmheazriifkbeylsiok`
- **Région** : eu-west-1
- **URL API** : https://hhmheazriifkbeylsiok.supabase.co
- **Postgres** : v17

> Les clés (anon/service role) doivent être stockées uniquement dans des variables d'environnement (`.env.local`, jamais commitées). Récupérables depuis Project Settings → API dans le dashboard Supabase.

## Migrations appliquées

| Fichier | Contenu |
|---|---|
| `migrations/001_initial_schema.sql` | Tables `profiles`, `workspaces`, `workspace_members`, `projects` + indexes + triggers + RLS + hardening des fonctions internes |

## Schéma (résumé)

- **profiles** : 1 ligne par utilisateur `auth.users`, créée automatiquement via trigger `handle_new_user`
- **workspaces** : espaces de travail, un par client/agence, `owner_id → profiles`
- **workspace_members** : table de liaison (rôles : owner/admin/member/viewer)
- **projects** : plateformes générées par BRAZUS (`type`: crm/dashboard/saas/automation, `status`: draft → in_progress → review → live → archived)

## Sécurité

- RLS activé sur toutes les tables
- Fonction utilitaire `is_workspace_member(uuid)` (SECURITY DEFINER, exécutable uniquement par `authenticated`) utilisée dans les policies pour éviter la récursion RLS
- Triggers internes (`handle_new_user`, `set_updated_at`) verrouillés : `EXECUTE` révoqué pour `anon`/`authenticated`/`public`
- UUID partout, soft delete via `deleted_at`

## Auth (à activer dans le dashboard)

- Magic link : activé
- Google OAuth : activé
- Redirect URLs : `http://localhost:3000/**` + URL de production Vercel
