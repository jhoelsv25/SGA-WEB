# Validación T15 — Header y calendario en celular · VAL-3 · 2026-10-09

**Veredicto:** APROBADA

## Criterios de aceptación

| #   | Criterio                                                                                                                                        | Estado | Evidencia                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | A 360 px el header no se desborda (explica en el informe el ancho de cada elemento).                                                            | PASA   | `components/layouts/header/app-header.tsx:21-39` define el encabezado sticky con padding horizontal `px-3` (24 px totales) y distribución flex `justify-between gap-2` (mínimo 8 px). En el extremo izquierdo, `SidebarTrigger` fija tamaño táctil accesible `size-11` (44 px, neto 40 px por `-ml-1`). En el extremo derecho, `HeaderLiveClock` se oculta en celulares (`hidden md:flex` en `components/layouts/header/header-live-clock.tsx:24`, 0 px) y `Separator` se oculta (`hidden sm:block` en `app-header.tsx:34`, 0 px). `HeaderUserMenu` (`components/layouts/header/header-user-menu.tsx:39,49`) oculta el bloque textual de nombre y rol en pantallas móviles (`hidden md:flex`), requiriendo únicamente 44 px de ancho (`size-8` [32 px] + `px-1.5` [12 px]). `ThemeToggle` (`components/common/theme-toggle.tsx:21,30`) mantiene botón táctil estándar `size="icon"` (`size-11` = 44 px). Para no administradores, `ChipAnioLectivo` (`components/layouts/header/header-academic-year.tsx:52,63`) presenta la insignia compacta con icono de calendario (14 px), separación (6 px), año «2026» (~30 px) y relleno `px-2.5` (20 px), consumiendo ~72 px (ancho total: 24 + 40 + 8 + 72 + 6 + 44 + 6 + 44 = **244 px ≤ 360 px**, margen libre de 116 px). Para administradores, `SelectOption` (`components/layouts/header/header-academic-year.tsx:130`) adapta su contenedor con `min-w-28 max-w-36` (112 a 144 px) y oculta la segunda línea en el botón disparador mediante `[&_span>span.text-muted-foreground]:hidden` (ancho total en el peor caso de 144 px: 24 + 40 + 8 + 144 + 6 + 44 + 6 + 44 = **316 px ≤ 360 px**, margen libre de 44 px sin ningún desbordamiento).                                                                                                   |
| 2   | En celular el calendario es legible y la lista del día seleccionado funciona con teclado.                                                       | PASA   | `features/calendario/views/mes/calendario-mes.tsx:191-262` adapta la cuadrícula mensual: las celdas de días reducen su altura a `min-h-12` (48 px) y ocultan bloques de títulos de texto en pantallas móviles (`md:hidden` en `:223-237`), mostrando puntos indicadores circulares discretos (`size-1.5 rounded-full`) con tokens de diseño (`bg-primary` para eventos regulares y `bg-warning` para suspensión de clases o días sin clases). En `:265-356`, se introduce en resoluciones menores a `md` (`md:hidden`) la sección de detalle del día seleccionado: encabezado con «Día seleccionado» y fecha completa en español (`fechaCompletaDeIso`, ej. «Martes 14 de abril de 2026»), distintivo `StatusBadge` de advertencia si es día sin clases (`:274-278`), estado vacío accesible con borde punteado si no hay actividades (`:281-286`), lista de tarjetas de eventos (`:288-343`) con título, descripción, rango de fechas y badge semántico, botones de acción «Editar» (`:317-325`) y «Eliminar» (`:327-336`) con altura táctil accesible (`pointer-coarse:h-11`), más botón de ancho completo «Registrar evento en esta fecha» (`:345-355`) con altura `h-11` (44 px). En cuanto a operabilidad por teclado: cada celda de día es un `<button type="button">` navegable por teclado (`Tab`, `Enter`, `Espacio`), con anillo de foco visible (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1`), `aria-pressed={esSeleccionado}`, `aria-current={esHoy ? "date" : undefined}` y `aria-label` descriptivo (`:177-190`, ej. «Lunes 14 de abril de 2026, 2 eventos, seleccionado»). Al activar cualquier celda mediante teclado, `handleDiaClick` actualiza inmediatamente `diaSeleccionado` y la lista inferior de eventos se sincroniza reactivamente. |
| 3   | Sin `text-[8px]`–`text-[11px]` en los archivos tocados.                                                                                         | PASA   | El comando `grep -rnE "text-\[(8                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 9   | 10  | 11)(\.[0-9]+)?px\]" components/layouts/header features/calendario/views`arrojó 0 coincidencias en la totalidad de archivos de los directorios afectados. Se eliminaron las 3 clases`text-[10px]`preexistentes en`features/calendario/views/mes/calendario-mes.tsx`(antiguas líneas 158, 165 y 171), estandarizándose a`text-xs`(12 px) en`:242,249,255`. En `components/layouts/header/header-academic-year.tsx:66`, se reemplazó la clase `text-[11px]`por`text-xs`. En `components/layouts/header/header-live-clock.tsx:32`, se actualizó la tipografía de `text-[11.5px]`a`text-xs`. |
| 4   | `bun run typecheck` y `bunx eslint components/layouts/header features/calendario/views` sin errores; `git status` solo con archivos permitidos. | PASA   | `bun run typecheck` (`tsc --noEmit`) finalizó con código de salida 0 (0 errores de tipos en todo el proyecto). `bunx eslint components/layouts/header features/calendario/views` finalizó con código de salida 0 (0 advertencias, 0 errores). Adicionalmente, `bun run build` (`next build` con Turbopack) generó satisfactoriamente las 26 rutas estáticas y dinámicas de la aplicación con código de salida 0. La verificación de `git status --porcelain` confirma que los cambios de T15 se limitan estrictamente a los archivos permitidos: `components/layouts/header/app-header.tsx`, `components/layouts/header/header-academic-year.tsx`, `components/layouts/header/header-live-clock.tsx`, `features/calendario/views/calendario-del-mes.tsx`, `features/calendario/views/mes/calendario-mes.tsx` y el informe `TAREAS/T15_informe.md`. Cero modificaciones fuera del ámbito asignado para T15 (los cambios en `features/kiosko/**` corresponden a la tarea concurrente T14 y fueron excluidos del análisis).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

## Pruebas ejecutadas

1. **Auditoría de delimitación y alcance estricto de la tarea:**
   - Archivos modificados permitidos:
     - `components/layouts/header/app-header.tsx`
     - `components/layouts/header/header-academic-year.tsx`
     - `components/layouts/header/header-live-clock.tsx`
     - `features/calendario/views/calendario-del-mes.tsx`
     - `features/calendario/views/mes/calendario-mes.tsx`
   - Archivo de documentación creado:
     - `TAREAS/T15_informe.md`
   - Resultado: 100% de cumplimiento del alcance autorizado. Cero archivos fuera de `components/layouts/header/**` o `features/calendario/views/**` modificados por la tarea T15.

2. **Auditoría de responsividad y dimensionamiento a 360 px (`tailwind-css-patterns`):**
   - Análisis de contención de desborde horizontal a 360 px:
     - Contenedor raíz: `px-3` (24 px de padding total). Ancho interno disponible = 336 px.
     - Elemento izquierdo: `SidebarTrigger` con `size-11` (44 px) y `-ml-1` (-4 px) = 40 px.
     - Separación flex central: `gap-2` = 8 px mínimo.
     - Elementos del contenedor derecho en celular:
       - `HeaderLiveClock`: Oculto en móviles mediante `hidden md:flex` = 0 px.
       - `Separator`: Oculto en móviles mediante `hidden sm:block` = 0 px.
       - `ThemeToggle`: Botón de alternancia con `size="icon"` (`size-11`) = 44 px.
       - `HeaderUserMenu`: Avatar `size-8` (32 px) + padding `px-1.5` (12 px) con textos ocultos en móvil (`hidden md:flex`) = 44 px.
       - Espaciado entre elementos derechos: 2 gaps de 6 px (`gap-1.5`) = 12 px.
     - Caso A (Usuario Docente / Apoderado - No Administrador):
       - `ChipAnioLectivo`: Icono (14 px) + gap (6 px) + texto «2026» (~30 px) + padding horizontal `px-2.5` (20 px) + bordes (2 px) = 72 px.
       - Ancho total ocupado: 24 + 40 + 8 + 72 + 6 + 44 + 6 + 44 = **244 px ≤ 360 px** (116 px de margen disponible).
     - Caso B (Usuario Administrador - Selector interactivo de año académico):
       - `SelectOption`: Contenedor responsivo `min-w-28 max-w-36` (112 px a 144 px) con ocultamiento de la segunda línea descriptiva en móvil (`[&_span>span.text-muted-foreground]:hidden`).
       - En el escenario de mayor ocupación (ancho máximo de 144 px): 24 + 40 + 8 + 144 + 6 + 44 + 6 + 44 = **316 px ≤ 360 px** (44 px de margen disponible).
   - Resultado: Ningún desbordamiento horizontal en 360 px ni en resoluciones menores (apto incluso en pantallas de 320 px).

3. **Auditoría de accesibilidad WCAG 2.2 AA (`accessibility/SKILL.md`):**
   - **Tamaño de objetivos táctiles (Target Size ≥ 44 px):**
     - Botón `SidebarTrigger`: `size-11` (44 × 44 px) en móvil.
     - Botón `ThemeToggle`: `size="icon"` (`size-11` = 44 × 44 px).
     - Botón `HeaderUserMenu`: `h-11` (44 px) de altura y 44 px de ancho efectivo.
     - Botón disparador de `SelectOption` (administrador): `h-11 min-h-11` (44 px) en móvil.
     - Botón `ChipAnioLectivo` (no administrador): `h-11` (44 px) para alineación visual con los controles circundantes.
     - Controles de navegación de mes en calendario: `size-11` (44 × 44 px) en móvil (`size-11 sm:size-9`).
     - Celdas de la cuadrícula de días: `min-h-12` (48 px de altura mínima en móvil ≥ 44 px).
     - Botones de acción en tarjetas de eventos móviles: `pointer-coarse:h-11` (44 px en dispositivos con puntero táctil/grueso).
     - Botón de registro de evento en la fecha seleccionada: `h-11` (44 px) con ancho completo.
   - **Navegación por teclado y foco visible:**
     - Cada día del mes implementa `<button type="button">` accesible con `Tab`, operable mediante `Enter` y `Espacio`.
     - Indicador de foco visible explícito: `outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1`.
     - Estados interactivos diferenciados: día seleccionado (`border-primary bg-primary/10 ring-2 ring-primary ring-offset-1`), día de hoy (`ring-primary/60 font-bold ring-2 ring-offset-1`), día sin clases (`border-warning/40 bg-warning/10 hover:bg-warning/20`).
   - **Atributos ARIA y lectura en lectores de pantalla:**
     - Botón de día: `aria-label` compuesto y comprensible (ej. «Lunes 14 de abril de 2026, sin clases, 2 eventos, seleccionado»).
     - Estado de selección del día: `aria-pressed={esSeleccionado}`.
     - Identificación del día actual: `aria-current={esHoy ? "date" : undefined}`.
     - Puntos visuales de eventos: marcados con `aria-hidden="true"` para evitar lectura redundante por lectores de pantalla.
     - Chips de estado del año académico: provistos con `role="status"` y etiquetas precisas (`ariaLabel="Año académico 2026"`, `ariaLabel="Cargando año académico"`, `ariaLabel="Sin año académico"`).
     - Botones de paginación de mes: `aria-label="Mes anterior"` y `aria-label="Mes siguiente"`.

4. **Auditoría de diseño visual y tokens del tema (`styling-icons.md`):**
   - Ausencia total de colores de paleta fijos (`grep -rnE "(slate|blue|rose|purple|emerald|amber|indigo|violet|cyan|sky|red|green|yellow|zinc|neutral|stone)-[0-9]+" components/layouts/header features/calendario/views`: 0 coincidencias).
   - Ausencia total de clases rígidas `text-white`, `bg-white`, `text-black`, `bg-black`: 0 coincidencias.
   - Uso riguroso de tokens institucionales semánticos: `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`, `bg-muted`, `bg-primary`, `text-primary`, `bg-warning`, `text-warning-text`.
   - Compatibilidad completa con modo claro y oscuro a través de variables CSS del sistema.

5. **Auditoría de Clean Code, ciclo de vida y tipado estricto (`clean-code.md`):**
   - Cero uso de `any` en los archivos de la entrega.
   - Cero directivas de evasión (`@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `eslint-disable`).
   - Cero `console.log`, `TODO` o `FIXME` en el código.
   - Memoización óptima de valores derivados (`useMemo` para opciones ordenadas en `header-academic-year.tsx:76-95`, y para `diaSeleccionadoEfectivo` y `eventosDiaSeleccionado` en `calendario-mes.tsx:102-126`).
   - Sincronización segura de cambio de mes: cuando el usuario navega a otro mes, `diaSeleccionadoEfectivo` se recalcula automáticamente hacia el día 1 (o la fecha de hoy si coincide con el mes corriente), evitando selecciones desfasadas fuera del mes visible.

6. **Preservación de la lógica del año lectivo (`anio-lectivo.md`):**
   - La lógica de negocio del selector de año lectivo no fue alterada.
   - Continúa consumiendo `useAnioLectivo()` de `@/features/anio-escolar/anio-lectivo-context`, `useEsAdministrador()` de `@/features/anio-escolar/hooks` y las reglas de selección de `anioDeReferencia` y `sePuedeElegir`.
   - No se introdujo estado local redundante ni se modificó el envío del encabezado `x-anio-academico-id` por el interceptor de peticiones API.

7. **Terminología e idioma español (`_comun_DEV.md`):**
   - Textos de interfaz y etiquetas accesibles 100% en español.
   - Uso fiel y exclusivo de los términos normativos «Año académico» y «Rol».
   - Propuesta de commit en `TAREAS/T15_informe.md` redactada conforme a Conventional Commits con viñetas claras y firmas de sesión.

8. **Verificación de comandos automatizados:**
   - `bun run typecheck`: código 0 (0 errores de tipos en todo el proyecto).
   - `bunx eslint components/layouts/header features/calendario/views`: código 0 (0 errores, 0 advertencias).
   - `bun run build`: código 0 (compilación de producción Next.js 16.3.6 Turbopack exitosa, 26/26 páginas generadas).
   - Búsqueda de tamaños menores a 12 px: 0 coincidencias.

## Hallazgos

| #   | Severidad | Archivo:Línea                                            | Detalle                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | --------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | baja      | `features/calendario/views/mes/calendario-mes.tsx:47-56` | La función auxiliar `fechaCompletaDeIso` implementa formateo de fecha con arreglos manuales locales (`DIAS_SEMANA_COMPLETOS` y `MESES`) en lugar de utilizar el helper centralizado `formatDate` de `@/lib/formatters/date` (ej. `formatDate(fecha, "EEEE d 'de' MMMM 'de' yyyy")`), conforme a la recomendación general de `components-guidelines.md` §2. No bloquea la entrega dado que es una función pura, correcta y sin librerías externas. |

## Recomendación al DEV

La entrega de la tarea T15 cumple plenamente con los objetivos de adaptación móvil (360 px) para la cabecera y la vista de calendario, manteniendo objetivos táctiles de 44 px, accesibilidad integral por teclado (WCAG 2.2 AA), tipografía mínima de 12 px y fidelidad absoluta a las reglas de negocio del año lectivo.

Como mejora opcional no bloqueante para una futura iteración de refactorización:

- Considerar migrar la función auxiliar `fechaCompletaDeIso` en `features/calendario/views/mes/calendario-mes.tsx:47-56` hacia el módulo centralizado `@/lib/formatters/date` para consolidar todos los patrones de formato de fechas de la aplicación en una sola fuente de verdad.

Se recomienda proceder con la confirmación de la tarea T15 y la ejecución del commit propuesto tras recibir el comando «CONFIRMADO».
