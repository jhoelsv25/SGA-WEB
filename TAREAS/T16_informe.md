# Informe de Tarea T16: Barrido final de accesibilidad y tokens (DEV-1 · Fase 4)

## Archivos cambiados y qué se hizo en cada uno

Se modificaron únicamente clases de estilo y atributos de accesibilidad (`aria-*`, `title`, `role`) en 35 archivos del proyecto, sin alterar lógica de negocio, hooks, API ni tipos:

### 1. `app/**` (Páginas de error y portal)

- **`app/global-error.tsx`**: Reemplazo de colores de paleta manual (`neutral-*`, `rose-*`) por tokens semánticos del tema (`bg-background`, `text-foreground`, `text-destructive`, `border-destructive/20`, `bg-destructive/10`, `text-muted-foreground`, `bg-muted`); sustitución de tipografía sub-12px `text-[11px]` por `text-xs`.
- **`app/error.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en mensajes de ayuda y subtítulos.
- **`app/not-found.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en código y ayuda.
- **`app/(portal)/privacy/page.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en fecha de actualización.
- **`app/(portal)/terms/page.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en fecha de actualización.

### 2. `components/ui/**` (Primitivos de interfaz)

- **`components/ui/alert-dialog.tsx`**: Reemplazo de `bg-black/10` en el overlay por el token temático `bg-foreground/15`.
- **`components/ui/dialog.tsx`**: Reemplazo de `bg-black/10` por `bg-foreground/15` en overlay; adición de `aria-label="Cerrar"` en el botón de cierre.
- **`components/ui/sheet.tsx`**: Reemplazo de `bg-black/10` por `bg-foreground/15` en overlay; adición de `aria-label="Cerrar"` en el botón de cierre.
- **`components/ui/sidebar.tsx`**: Adición de `aria-label="Mostrar u ocultar menú lateral"` en el botón disparador `SidebarTrigger`.
- **`components/ui/tabs.tsx`**: Adición de foco visible (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`) en `TabsContent`.

### 3. `components/common/**` (Componentes transversales)

- **`components/common/brand/brand.tsx`**: Estandarización de subtítulo de marca para tamaños `xs`, `sm`, `md` de tamaños arbitrarios (`text-[9px]`, `text-[10px]`, `text-[11px]`) a `text-xs`.
- **`components/common/copy-button/copy-button.tsx`**: Reemplazo de clases manuales de paleta verde (`emerald-*`) por tokens de éxito semánticos (`text-success`, `bg-success/10`, `border-success/30`, `border-success/40`).
- **`components/common/date-time-picker/date-time-picker.tsx`**: Reemplazo de clases de texto arbitrarias `text-[10px]` y `text-[11px]` por `text-xs` en botones de presets rápidos, cabeceras de hora/minuto, selector AM/PM y resumen del pie.
- **`components/common/file-dropzone/file-dropzone.tsx`**: Reemplazo de `text-emerald-*` por `text-success`; reemplazo de clases sub-12px (`text-[9px]`, `text-[11px]`) por `text-xs`; adición de foco visible en la zona de soltar archivos (`focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary`).
- **`components/common/list-toolbar/components/filter-fields.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en etiquetas de filtros.
- **`components/common/list-toolbar/components/list-toolbar.tsx`**: Reemplazo de `text-[10px]` por `text-xs` en contador de filtros activos.
- **`components/common/list-toolbar/components/view-toggle.tsx`**: Adición de nombres accesibles explícitos (`aria-label="Vista de tabla"`, `aria-label="Vista de tarjetas"`), `aria-pressed` y anillos de foco visibles (`focus-visible:ring-2`).
- **`components/common/row-actions/table-row-actions.tsx`**: Reemplazo de `text-[10px]` por `text-xs` en cabecera de menú y submenús.
- **`components/common/select/select-option.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en descripciones secundarias de opciones y disparadores.
- **`components/common/theme-toggle.tsx`**: Reemplazo de clase de paleta manual `text-amber-400` por el token semántico `text-warning`.
- **`components/common/user-avatar/user-avatar.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en iniciales fallback.

### 4. `components/layouts/**` (Estructura de panel)

- **`components/layouts/admin-guard.tsx`**: Reemplazo de `bg-zinc-100` por `bg-muted`; reemplazo de `bg-white dark:bg-background` por `bg-background`; unificación de insignia a `text-[11px] font-bold tracking-widest uppercase` (excepción permitida de mayúsculas con espaciado) y pie a `text-xs`.
- **`components/layouts/sidebar/nav-main.tsx`**: Reemplazo de clases manuales de paleta (`emerald-*`, `amber-*`, `sky-*`) por tokens semánticos (`success`, `warning`, `info`); reemplazo de `text-[11px]` y `text-[9.5px]` por `text-xs`.
- **`components/layouts/sidebar/sidebar-search.tsx`**: Adición de `aria-label="Buscar módulo o función (Ctrl + K)"` en el botón disparador; adición de `aria-label="Limpiar búsqueda"` en el botón de limpieza; reemplazo de clases sub-12px (`text-[9.5px]`, `text-[10px]`, `text-[11px]`, `text-[10.5px]`) por `text-xs`.

### 5. `features/**` (Módulos funcionales)

- **`features/anio-escolar/components/anio/anio-lista.tsx`**: Adición de foco visible (`outline-none focus-visible:ring-2 focus-visible:ring-primary/40`) en los botones de selección de año.
- **`features/auth/components/auth-page-shell.tsx`**: Ajuste de insignia a `text-[11px] font-bold tracking-widest uppercase` (excepción permitida con tracking); actualización del copyright de pie de página a `text-xs`.
- **`features/curriculum/curriculum-page.tsx`**: Remoción de `outline-none` redundante sin foco en `TabsContent`, heredando el foco accesible de la primitiva `TabsContent`.
- **`features/cursos/components/forms/curso-form.tsx`**: Reemplazo de `border-black/10 dark:border-white/10` por `border-foreground/10`; adición de foco visible (`outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring`) en la botonera de colores preestablecidos.
- **`features/equipos/components/forms/equipo-form.tsx`**: Estandarización de textos descriptivos y casillas a `text-xs`; adición de foco accesible en botones de selección de rol de usuario.
- **`features/equipos/views/table/columns/equipos-columns.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en etiquetas de usuarios autorizados.
- **`features/equipos/views/table/equipos-table.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en texto secundario de número de serie.
- **`features/portal/components/footer/portal-footer.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en horario de atención.
- **`features/portal/components/navbar/portal-navbar.tsx`**: Reemplazo de `text-[11px]` por `text-xs` en pie del menú móvil.
- **`features/turnos/components/forms/turno-form.tsx`**: Reemplazo de subtítulos de sección y ayudas a `text-xs`; adición de foco accesible (`outline-none focus-visible:ring-2 focus-visible:ring-primary/40`) y tamaño `text-xs` en la botonera de días de la semana.
- **`features/turnos/components/turnos-grid.tsx`**: Reemplazo de tamaños arbitrarios `text-[10px]` y `text-[11px]` por `text-xs` en estados, ventanas horarias, tolerancia y chips de días activos.

---

## Skills leídas y reglas aplicadas

| Skill leída                                                        | Reglas aplicadas (resumen)                                                                                                                                                                                                                                                                          | Dónde (archivo)                                                                                                                                                             |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessibility` (`.agents/skills/accessibility/SKILL.md`)          | WCAG 2.2: textos con legibilidad mínima de 12 px (`text-xs`); todo control interactivo y botón de solo icono con nombre accesible (`aria-label`, `title`, `sr-only`); todo elemento con `outline-none` tiene foco visible con `focus-visible:ring-2`; estados con `aria-pressed` y `aria-expanded`. | `app/**`, `components/ui/**`, `components/common/**`, `components/layouts/**`, `features/**`                                                                                |
| `styling-icons` (`.agents/rules/styling-icons.md`)                 | Uso estricto del sistema de tokens semánticos (`primary`, `destructive`, `success`, `warning`, `info`, `foreground`, `muted`); erradicación de colores de paleta directa (`emerald-*`, `amber-*`, `sky-*`, `neutral-*`, `rose-*`, `bg-black`, `bg-white`).                                          | `components/common/theme-toggle.tsx`, `components/common/copy-button/copy-button.tsx`, `components/layouts/sidebar/nav-main.tsx`, `app/global-error.tsx`, `components/ui/*` |
| `components-guidelines` (`.agents/rules/components-guidelines.md`) | Consistencia visual de componentes modales, diálogos y barras de herramientas; preservación de estructura de diseño sin alterar la lógica.                                                                                                                                                          | `components/ui/dialog.tsx`, `components/ui/alert-dialog.tsx`, `components/ui/sheet.tsx`, `components/common/list-toolbar/*`                                                 |
| `clean-code` (`.agents/rules/clean-code.md`)                       | Cero `any`, sin modificaciones a tipos de TypeScript, sin `@ts-ignore`, sin efectos colaterales de renderizado.                                                                                                                                                                                     | Todos los archivos modificados                                                                                                                                              |

---

## Verificación de comandos

### 1. Detección de fuentes sub-12px (`text-[...px]`)

```bash
grep -rnE "text-\[(8|9|10|11)(\.5)?px\]" app components features
```

**Resultado:**

```text
components/layouts/admin-guard.tsx:81:          <div className="border-primary/20 bg-primary/10 text-primary mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-widest uppercase">
features/auth/components/auth-page-shell.tsx:97:            <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-widest uppercase">
features/auth/components/auth-slider.tsx:81:        <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
features/portal/components/sections/cta-section.tsx:15:          <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase">
```

_Comprobación:_ Exactamente las 4 excepciones autorizadas por la tarea (insignias en MAYÚSCULAS con `tracking` a 11px). Cero ocurrencias no autorizadas.

### 2. Detección de colores de paleta manual

```bash
grep -rnE "\b(bg|text|border|ring|from|to|via|fill|stroke)-(red|green|blue|emerald|amber|yellow|orange|sky|indigo|violet|purple|pink|rose|slate|gray|zinc|neutral|stone|teal|cyan|lime|fuchsia)-[0-9]{2,3}" app components features
```

**Resultado:** Salida vacía (código de retorno 1, 0 coincidencias).

### 3. Detección de colores planos absolutos (`text-white`, `bg-white`, `bg-black`)

```bash
grep -rnE "text-white|bg-white\b|bg-black\b" app components features
```

**Resultado:** Salida vacía (código de retorno 1, 0 coincidencias).

### 4. Botones de solo icono y foco visible

- Todos los botones con `size="icon*"` y botones de solo icono cuentan con `aria-label`, `title` o texto accesible para lectores de pantalla.
- Todo elemento interactivo con `outline-none` cuenta con clases de foco visible `focus-visible:ring-2` (o contenedor asociado con `focus-within:ring-2`).

### 5. Verificación de compilación y linters

#### `bun run typecheck`

```text
$ tsc --noEmit
(Código de salida: 0 - Sin errores de tipo)
```

#### `bun run lint`

```text
$ eslint .
(Código de salida: 0 - Sin advertencias ni errores de lint)
```

#### `bun run build`

```text
$ next build
▲ Next.js 16.3.6 (Turbopack)
- Environments: .env.local
✓ Running next.config.ts took 29ms
  Creating an optimized production build ...
✓ Compiled successfully in 1061ms
✓ Finished TypeScript in 4.7s
✓ Collecting page data using 15 workers in 1226ms
✓ Generating static pages using 15 workers (26/26) in 789ms
  Finalizing page optimization in 13ms
(Código de salida: 0 - Compilación de producción exitosa)
```

---

## Commit propuesto

```git
style(a11y): estandarizar tokens de color, tipografía y foco visible

- Reemplazar fuentes sub-12px por text-xs respetando excepciones en insignias
- Sustituir colores manuales de paleta y fondos fijos por tokens semánticos
- Añadir nombres accesibles a botones de icono y asegurar foco visible

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KMcYEyxxxQcyrp9TQj7msR
```
