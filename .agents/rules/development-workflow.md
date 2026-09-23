# Flujo de Desarrollo, Bun y Control de Calidad

## 1. Gestor de Paquetes: Bun Obligatorio

- Este repositorio utiliza exclusivamente **`bun`** como runtime y gestor de paquetes (`bun.lock`, `"packageManager": "bun@1.3.1"`).
- **Prohibido ejecutar o documentar comandos con `npm`, `yarn` o `pnpm`**.
- Comandos oficiales:
  - Instalación: `bun install`
  - Agregar dependencia: `bun add <paquete>` o `bun add -d <paquete>`
  - Servidor de desarrollo: `bun run dev`
  - Build de producción: `bun run build`
  - Typecheck: `bun run typecheck`
  - Linter: `bun run lint` o `bun run lint:fix`
  - Formateo: `bun run format`

## 2. Validación de Calidad y Cero Regresiones

- **Chequeo de Tipos Obligatorio**:
  - Todo cambio o nueva característica debe pasar exitosamente `bun run typecheck` (`tsc --noEmit`) sin advertencias ni errores.
- **Formateo y Linter**:
  - Respeta las reglas de ESLint 9 (`eslint.config.mjs`) y Prettier con Tailwind plugin.
  - Ejecuta `bun run lint:fix` y `bun run format` antes de concluir cualquier tarea.
- **Husky y Pre-commit**:
  - No uses flags como `--no-verify` para forzar commits si fallan los hooks de Husky o lint-staged. Corrige los errores en el código fuente.
