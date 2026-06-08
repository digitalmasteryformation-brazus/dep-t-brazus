# Skills système — BRAZUS Builder OS

> Les "skills" sont des prompts réutilisables et autonomes que les agents peuvent invoquer pour
> une sous-tâche précise (composables : un agent peut en chaîner plusieurs).

| Skill | Fichier | Utilisé par |
|---|---|---|
| Conception base de données | [`skills/database-design.md`](./skills/database-design.md) | Architecte |
| Conception API | [`skills/api-design.md`](./skills/api-design.md) | Architecte, Développeur |
| Conception UI | [`skills/ui-design.md`](./skills/ui-design.md) | Architecte, Développeur |
| Déploiement | [`skills/deployment.md`](./skills/deployment.md) | Développeur, Superviseur |

## Principes

- Chaque skill est testable individuellement (input → output déterministe)
- Chaque skill est versionné (`> version: x.y` en en-tête)
- Un agent peut composer plusieurs skills pour une tâche complexe (ex: Architecte = database-design + api-design)
