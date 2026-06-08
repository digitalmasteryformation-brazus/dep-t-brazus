# Template — Génération Workflow Automation
> version: 1.0 · type: automation

## Variables
- `{{project_name}}` — nom du workflow/système d'automatisation
- `{{client_industry}}` — secteur d'activité
- `{{features}}` — déclencheurs et actions souhaités (ex: nouveau lead → email, facture → relance)

## Prompt

Tu génères un système de workflows automatisés nommé **{{project_name}}** pour le secteur
**{{client_industry}}**.

Déclencheurs et actions attendus : {{features}}

Produis :
1. La liste des workflows (déclencheur → conditions → actions)
2. Les intégrations nécessaires (CRM, email, calendrier, paiement...)
3. Les règles de gestion d'erreur et de retry

## Format de sortie
JSON structuré : `{ workflows, integrations, errorHandling }`

## Exemple d'input
```json
{ "project_name": "LeadFlow", "client_industry": "services B2B", "features": ["nouveau lead → email de bienvenue", "devis signé → création projet"] }
```

## Exemple d'output (extrait)
```json
{
  "workflows": [{ "trigger": "new_lead", "actions": ["send_welcome_email", "notify_sales"] }],
  "integrations": ["gmail", "calendar", "crm"],
  "errorHandling": { "retries": 3, "fallback": "notify_admin" }
}
```
