<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Seguimiento de requerimientos (obligatorio)

- Las skills del proyecto están en `.agents/skills/` y las reglas en `.agents/rules/`. Léelas cuando la tarea lo requiera.
- Al terminar o avanzar cualquier tarea que implemente un Requerimiento Funcional (RF), sigue **`.agents/skills/actualizar-backlog-rf/SKILL.md`** y actualiza el avance en el backlog vivo: `../SGA-API/docs/00-Plan-y-Backlog-RF.md`.
- Los RF (escenarios Gherkin) están en `../SGA-API/docs/requerimientos/` y las dudas abiertas en `../SGA-API/docs/requerimientos/PENDIENTES.md`. No inventes reglas de negocio: si falta una, agrégala como pendiente.
- **Ramas:** una rama por RF con el estándar de `.agents/skills/nombre-rama-rf/SKILL.md`, el mismo nombre que en SGA-API.
- **Año lectivo de trabajo:** el encabezado lo elige y `apiClient` lo manda en `x-anio-academico-id`. No lo pongas en cada llamada. Regla en `.agents/rules/anio-lectivo.md`.
