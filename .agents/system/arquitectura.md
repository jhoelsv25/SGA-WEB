# Arquitectura y comandos — SGA-WEB

- Next.js 16 (App Router), React 19, Tailwind CSS 4, radix-ui, iconos @hugeicons, TanStack Query/Table, React Hook Form + Zod.
- Estructura por feature en `features/<feature>/` (ver `.agents/rules/clean-code.md`).
- Componentes base en `components/ui/` (primitivas shadcn) y `components/common/` (componentes del SGA).
- Tokens de tema en `app/globals.css` (`@theme inline`, `:root`, `.dark`). Color institucional `--primary` = #881337.
- Gestor: bun (prohibido npm/yarn/pnpm).

## Comandos de verificación

- Tipos: `bun run typecheck`
- Lint: `bun run lint` (o `bunx eslint <rutas>`)
- Build: `bun run build`
- No hay runner de pruebas en este proyecto (plan de mejoras UI: opción b, sin pruebas automáticas).
