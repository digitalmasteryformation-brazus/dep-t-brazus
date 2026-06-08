# Template — Génération Landing Page SaaS
> version: 1.0 · type: saas (landing)

## Variables
- `{{project_name}}` — nom du produit/service
- `{{client_industry}}` — secteur d'activité
- `{{features}}` — arguments de vente clés / sections souhaitées (ex: pricing, témoignages, FAQ)

## Prompt

Tu génères une landing page SaaS pour **{{project_name}}**, dans le secteur **{{client_industry}}**.

Sections / arguments attendus : {{features}}

Produis :
1. La structure de page (sections dans l'ordre, avec leur objectif)
2. Les titres et accroches pour chaque section
3. Les call-to-action principaux et secondaires

## Format de sortie
JSON structuré : `{ sections, copy, ctas }`

## Exemple d'input
```json
{ "project_name": "FlowAuto", "client_industry": "automatisation marketing", "features": ["hero accrocheur", "pricing 3 plans", "témoignages clients", "FAQ"] }
```

## Exemple d'output (extrait)
```json
{
  "sections": ["hero", "features", "pricing", "testimonials", "faq", "cta_final"],
  "copy": { "hero_title": "Automatisez votre marketing en 5 minutes" },
  "ctas": ["Essayer gratuitement", "Réserver une démo"]
}
```
