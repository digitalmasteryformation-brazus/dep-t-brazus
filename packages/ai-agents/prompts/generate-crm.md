# Template — Génération CRM
> version: 1.0 · type: crm

## Variables
- `{{project_name}}` — nom du projet/plateforme
- `{{client_industry}}` — secteur d'activité du client (ex: immobilier, e-commerce, services B2B)
- `{{features}}` — liste des fonctionnalités souhaitées (ex: gestion contacts, pipeline de vente, emails automatisés)

## Prompt

Tu génères l'architecture et le code d'un CRM sur-mesure nommé **{{project_name}}** pour le secteur
**{{client_industry}}**.

Fonctionnalités attendues : {{features}}

Produis :
1. Le schéma de données (entités : contacts, opportunités, interactions, pipelines)
2. Les vues principales (liste contacts, fiche contact, tableau pipeline kanban, rapports)
3. Les automatisations de base (relances, notifications, scoring simple)

## Format de sortie
JSON structuré : `{ architecture, pages, automations }`

## Exemple d'input
```json
{ "project_name": "ImmoCRM", "client_industry": "immobilier", "features": ["gestion contacts", "pipeline de vente", "relances automatiques"] }
```

## Exemple d'output (extrait)
```json
{
  "architecture": { "entities": ["contacts", "opportunities", "interactions"] },
  "pages": ["dashboard", "contacts", "pipeline", "reports"],
  "automations": ["relance J+3 sans réponse", "notification nouvelle opportunité"]
}
```
