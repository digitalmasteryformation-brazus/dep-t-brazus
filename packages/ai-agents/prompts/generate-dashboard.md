# Template — Génération Dashboard Analytics
> version: 1.0 · type: dashboard

## Variables
- `{{project_name}}` — nom du dashboard
- `{{client_industry}}` — secteur d'activité
- `{{features}}` — métriques et widgets souhaités (ex: KPIs ventes, graphiques tendance, exports)

## Prompt

Tu génères un dashboard analytics nommé **{{project_name}}** pour le secteur **{{client_industry}}**.

Métriques et widgets attendus : {{features}}

Produis :
1. La liste des KPIs principaux et leur mode de calcul
2. La disposition des widgets (grille, graphiques, tableaux)
3. Les sources de données et leur fréquence de rafraîchissement

## Format de sortie
JSON structuré : `{ kpis, layout, dataSources }`

## Exemple d'input
```json
{ "project_name": "SalesPulse", "client_industry": "e-commerce", "features": ["CA mensuel", "panier moyen", "taux de conversion"] }
```

## Exemple d'output (extrait)
```json
{
  "kpis": ["revenue_monthly", "average_basket", "conversion_rate"],
  "layout": [{ "widget": "line_chart", "metric": "revenue_monthly" }],
  "dataSources": [{ "name": "orders", "refresh": "hourly" }]
}
```
