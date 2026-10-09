# T14 · Kiosko: cola de marcaciones sin conexión (DEV-1 · Fase 3)

Lee primero `TAREAS/_comun_DEV.md` y cúmplelo.

## Objetivo

Que el kiosko siga aceptando marcaciones con 3G intermitente (más de 10 docentes por minuto): guardarlas en el equipo y enviarlas en orden cuando vuelva la conexión, sin duplicados. Todo detrás de una bandera desactivada por defecto, porque la API aún no tiene el endpoint de marcación (RF-010).

## Skills obligatorias (leer COMPLETAS antes de escribir código)

- `/home/heverlima/DEV_LINUX/Tesis/SGA-WEB/.agents/skills/react-best-practices/SKILL.md`
- `/home/heverlima/DEV_LINUX/Tesis/SGA-WEB/.agents/skills/tanstack-query/SKILL.md`
- `/home/heverlima/DEV_LINUX/Tesis/SGA-WEB/.agents/skills/typescript-advanced-types/SKILL.md`
- `/home/heverlima/DEV_LINUX/Tesis/SGA-WEB/.agents/skills/accessibility/SKILL.md`
- `/home/heverlima/DEV_LINUX/Tesis/SGA-WEB/.agents/rules/clean-code.md` (cleanups de listeners, timers e IndexedDB)
- `/home/heverlima/DEV_LINUX/Tesis/SGA-WEB/.agents/rules/api-client-mutations.md`

## Contexto

- T13 ya creó `features/kiosko/` con `ServicioMarcacion` (`features/kiosko/api/servicio-marcacion.ts`), `MarcacionNoDisponibleError`, `use-conexion-red.ts` y el pie con el estado de conexión. Léelos antes de empezar.
- No hay dependencias para IndexedDB: usa la API nativa (`indexedDB`) envuelta en funciones con `Promise`. No instales nada.

## Reglas de negocio que NO se inventan

La hora válida de una marcación enviada tarde, cómo evitar duplicados en el servidor y si se guardan nombres en el equipo son decisiones de negocio pendientes. **No las decidas en el código**: implementa la mecánica con valores neutros y anota las 3 preguntas en `TAREAS/T14_propuestas.md` (formato de fila de `PENDIENTES.md`: N.°, RF, Pregunta, A quién, Supuesto actual) para que el usuario las lleve a `SGA-API/docs/requerimientos/PENDIENTES.md`.

## Archivos permitidos

- Crear o modificar dentro de `features/kiosko/**`.
- Modificar `app/kiosko/page.tsx` solo para conectar la cola si hace falta.
- Crear: `TAREAS/T14_informe.md`, `TAREAS/T14_propuestas.md`.
- Prohibido cualquier otro archivo.

## Cambios esperados

1. `features/kiosko/cola/`: almacén en IndexedDB (`sga-kiosko`, almacén `marcaciones-pendientes`) con `encolar`, `listarPendientes`, `marcarEnviada`, `contarPendientes`. Cada registro: `idLocal` (`crypto.randomUUID()`), `codigo`, `tipo`, `marcadoEnDispositivo` (ISO), `intentos`, `ultimoError?`. **No guarda nombres ni PIN.**
2. Envío en orden (FIFO) cuando hay conexión (`online`) y cada 30 s mientras haya pendientes, con espera creciente (1 s, 2 s, 4 s… hasta 60 s); un solo envío a la vez (sin carreras); el `idLocal` viaja como clave de idempotencia en los datos de `registrarMarcacion`.
3. Bandera `COLA_SIN_CONEXION_HABILITADA = false` en `features/kiosko/consts`. Con la bandera en `false`, el kiosko se comporta como en T13. Con `true`, si no hay conexión o el servicio falla por red, la marcación se encola y el aviso dice: «Marcación guardada. Se enviará al volver la conexión.»
4. El pie muestra «Sin conexión · N pendientes» o «En línea · enviando N» con datos reales de la cola (`aria-live="polite"`).
5. Limpieza correcta de timers y listeners; si IndexedDB no está disponible (navegación privada), se desactiva la cola sin romper el kiosko.

## Criterios de aceptación

1. Con la bandera en `false`, nada cambia respecto de T13.
2. El almacén no guarda nombres ni PIN; cada marcación tiene `idLocal` único.
3. El envío es FIFO, uno a la vez, con espera creciente y sin duplicar envíos simultáneos (explica en el informe cómo lo garantizaste).
4. `TAREAS/T14_propuestas.md` tiene las 3 preguntas de negocio.
5. `bun run typecheck` y `bunx eslint features/kiosko app/kiosko` sin errores; `git status` solo con archivos permitidos.
