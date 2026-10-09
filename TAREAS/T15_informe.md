# Informe de Tarea T15: Header y calendario en celular (DEV-2 · Fase 4)

## Archivos cambiados y qué se hizo en cada uno

1. **`components/layouts/header/app-header.tsx`**
   - Se aseguró que `SidebarTrigger` cuente explícitamente con tamaño táctil de 44 px (`size-11` = 44 × 44 px) en celular.
   - Mantiene la disposición y espaciados responsivos del header sin desbordar el contenedor flex.

2. **`components/layouts/header/header-academic-year.tsx`**
   - Se adaptó la visualización del chip del año lectivo para usuarios no administradores: por debajo de `sm` se muestra compacto («2026» con icono de calendario y `aria-label="Año académico 2026"`), y a partir de `sm` se muestra la descripción en dos líneas.
   - Se eliminó el tamaño de fuente arbitrario sub-12px (`text-[11px]`), reemplazándolo por `text-xs` (12 px).
   - Se adaptó el selector `SelectOption` para administradores con un ancho mínimo menor responsivo (`min-w-28 max-w-36 sm:min-w-44 sm:max-w-64`) y altura mínima de 44 px en celular (`h-11 min-h-11 sm:h-auto sm:min-h-8`), ocultando la segunda línea descriptiva en el botón disparador en móvil (`[&_span>span.text-muted-foreground]:hidden sm:[&_span>span.text-muted-foreground]:block`) para un botón compacto de una línea manteniendo todas las opciones y descripciones completas al abrir el menú desplegable.

3. **`components/layouts/header/header-live-clock.tsx`**
   - Se reemplazó `text-[11.5px]` por `text-xs` (12 px) para cumplir con el estándar de tipografía mínima accesible.

4. **`features/calendario/views/calendario-del-mes.tsx`**
   - Se conectaron los callbacks `onEditar` y `onEliminar` a `CalendarioMes` para permitir acciones directas desde la lista móvil de eventos del día seleccionado.

5. **`features/calendario/views/mes/calendario-mes.tsx`**
   - Se implementó la vista responsiva del calendario:
     - **Por debajo de `md`:** la grilla muestra los días con puntos indicadores de eventos (y sin clases) sin títulos de texto dentro de las celdas, con altura táctil accesible de 48 px (`min-h-12`).
     - **Lista del día seleccionado:** debajo de la grilla de días, se agregó la sección móvil (`md:hidden`) con el día elegido formateado con fecha completa en español (ej. «Martes 14 de abril de 2026»), insignia de «Sin clases» si aplica, lista accesible de eventos con botones de acción y botón de registro de evento.
     - **Desde `md`:** se mantiene la vista completa actual con títulos truncados de eventos dentro de las celdas.
     - **Accesibilidad y navegación por teclado:** cada celda de día es un `<button>` con `aria-label` completo (incluye fecha, eventos y si está seleccionado), `aria-pressed`, `aria-current="date"`, foco visible con `focus-visible:ring-2`, y operable mediante teclado (`Tab`, `Enter`, `Espacio`).
     - **Tipografía:** se eliminaron todas las clases `text-[10px]` (líneas 158, 165, 171), estandarizándolas a `text-xs` (12 px).

---

## Skills leídas y reglas aplicadas

| Skill leída             | Reglas aplicadas (resumen)                                                                                                                                                                                                                        | Dónde (archivo)                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessibility`         | Objetivos táctiles de 44 px en celular (`size-11`, `min-h-12`); contraste AA; foco visible (`focus-visible:ring-2`); atributos ARIA (`aria-label`, `aria-pressed`, `aria-current`, `role="status"`); soporte completo para teclado en calendario. | `components/layouts/header/app-header.tsx`, `components/layouts/header/header-academic-year.tsx`, `features/calendario/views/mes/calendario-mes.tsx` |
| `tailwind-css-patterns` | Diseño mobile-first con prefijos responsivos (`sm:`, `md:`); uso estricto de tokens de tema (`bg-primary`, `bg-warning`, `text-warning-text`); tamaños consistentes en la escala de espaciado.                                                    | Todos los archivos modificados                                                                                                                       |
| `components-guidelines` | Reutilización de componentes estándar del SGA (`StatusBadge`, `Button`, `Card`); formateo de fechas con helpers consistentes en español.                                                                                                          | `features/calendario/views/mes/calendario-mes.tsx`, `features/calendario/views/calendario-del-mes.tsx`                                               |
| `anio-lectivo`          | Se preservó la lógica intacta del contexto de año académico, selección de año y headers de sesión (`x-anio-academico-id`).                                                                                                                        | `components/layouts/header/header-academic-year.tsx`                                                                                                 |
| `clean-code`            | Cero `any`, tipado estricto con TypeScript, memoización con `useMemo` de fechas y eventos filtrados, sin fugas de memoria.                                                                                                                        | `features/calendario/views/mes/calendario-mes.tsx`, `components/layouts/header/header-academic-year.tsx`                                             |

---

## Verificación de criterios de aceptación

### 1. Desglose de ancho a 360 px en el Header (sin desborde)

- **Ancho total disponible de pantalla:** 360 px.
- **Relleno horizontal del contenedor (`px-3`):** 12 px (izq) + 12 px (der) = 24 px.
- **Espacio interior útil:** 336 px.
- **Elemento lateral izquierdo:**
  - `SidebarTrigger`: 44 px de ancho × 44 px de alto (`size-11`).
- **Separación flex central (`justify-between gap-2`):** mínimo 8 px.
- **Elementos del contenedor derecho (`gap-1.5` = 6 px):**
  - `HeaderLiveClock`: `hidden md:flex` = 0 px.
  - `ThemeToggle`: `Button size="icon"` = 44 px.
  - `Separator`: `hidden sm:block` = 0 px.
  - `HeaderUserMenu`: Avatar de 32 px + `px-1.5` = 44 px (`h-11`).
  - Gaps entre elementos derechos: 2 × 6 px = 12 px.
  - Subtotal fijo del contenedor derecho (sin selector de año): 44 px + 6 px + 44 px = 94 px.

**Cálculo por rol:**

- **Caso A: Docente / Apoderado (no administrador):**
  - `ChipAnioLectivo`: Icono (14 px) + gap (6 px) + «2026» (~28 px) + `px-2.5` (20 px) + borde (2 px) = 70 px.
  - Ancho total ocupado: 24 px (padding) + 44 px (Sidebar) + 8 px (gap) + 70 px (chip) + 6 px (gap) + 44 px (Theme) + 6 px (gap) + 44 px (User) = **246 px ≤ 360 px**.
  - **Margen libre:** 114 px sin riesgo de desborde.
- **Caso B: Administrador (selector de año):**
  - `SelectOption`: Ancho mínimo en móvil `min-w-28` (112 px) hasta `max-w-36` (144 px).
  - Con ancho medio de 128 px:
    - Ancho total ocupado: 24 px (padding) + 44 px (Sidebar) + 8 px (gap) + 128 px (selector) + 6 px (gap) + 44 px (Theme) + 6 px (gap) + 44 px (User) = **304 px ≤ 360 px**.
    - **Margen libre:** 56 px sin riesgo de desborde.
  - Incluso con ancho máximo de 144 px: **320 px ≤ 360 px** (40 px libres).

### 2. Calendario en celular y accesibilidad con teclado

- Celdas de días compactas con altura táctil `min-h-12` (48 px ≥ 44 px) con puntos indicadores de eventos.
- Sección inferior con el día seleccionado mostrando fecha completa (ej. «Martes 14 de abril de 2026»), estado de clases, lista de eventos con badges y botones de acción.
- Navegación completa por teclado con `Tab`, activación con `Enter`/`Espacio`, indicador de foco visible (`focus-visible:ring-2`) y atributos `aria-label`, `aria-pressed`, `aria-current`.

### 3. Verificación de tamaños de texto

- Búsqueda `grep -rnE "text-\[(8|9|10|11)(\.[0-9]+)?px\]" components/layouts/header features/calendario/views`: **0 coincidencias**. Todos los textos tienen al menos 12 px (`text-xs`).

---

## Salida de los comandos de verificación

```bash
$ bunx eslint components/layouts/header features/calendario/views
# (Salida limpia, 0 errores, 0 advertencias)

$ bun run typecheck
$ tsc --noEmit
# (Salida limpia, exit code 0)

$ grep -rnE "text-\[(8|9|10|11)(\.[0-9]+)?px\]" components/layouts/header features/calendario/views
# (Exit code 1: 0 coincidencias)
```

---

## Commit propuesto

```text
feat(header-calendario): adaptar cabecera y calendario para pantallas móviles

- Optimizar cabecera en pantallas menores a 640px con año lectivo compacto y selector ajustado sin desbordes a 360px
- Implementar vista móvil del calendario menor a 768px con puntos de eventos y lista detallada por día seleccionado
- Asegurar objetivos táctiles de 44px, foco visible accesible por teclado y tipografía mínima de 12px

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KMcYEyxxxQcyrp9TQj7msR
```
