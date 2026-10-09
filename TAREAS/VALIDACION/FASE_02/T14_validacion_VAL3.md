# Validación T14 — Kiosko: cola de marcaciones sin conexión · VAL-3 · 2026-10-09

**Veredicto:** APROBADA

## Criterios de aceptación

| #   | Criterio                                                                                                                             | Estado | Evidencia                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Con la bandera en `false`, nada cambia respecto de T13.                                                                              | PASA   | `features/kiosko/consts/index.ts:66` define `COLA_SIN_CONEXION_HABILITADA = false`. En `app/kiosko/page.tsx:208,311,458-463`, el flujo sin conexión o con fallo de red mantiene inalterada la renderización de la pantalla completa `KioskoPantallaDesconectado` de T13, sin encolar ni alterar avisos. En `features/kiosko/components/kiosko-footer.tsx:30-36`, con la bandera desactivada se preservan exactamente los textos «En línea • Conectado a SGA API» o «Sin conexión • Modo sin conexión» y las clases de estilo idénticas a T13. En `features/kiosko/cola/use-cola-marcaciones.ts:45,80,121,144` y `features/kiosko/cola/gestor-cola.ts:97`, las funciones retornan inmediatamente sin registrar listeners, intervalos ni transacciones de almacenamiento.                                                                                                                                                                                   |
| 2   | El almacén no guarda nombres ni PIN; cada marcación tiene `idLocal` único.                                                           | PASA   | `features/kiosko/types/index.ts:41-49` y `features/kiosko/cola/almacen-indexeddb.ts:47-50,83-101` modelan y persisten en el object store `marcaciones-pendientes` únicamente: `idLocal` (`crypto.randomUUID()`), `codigo`, `tipo`, `marcadoEnDispositivo` (marca temporal ISO 8601), `intentos` (0) y `equipoId?`. No existen propiedades para nombre, persona ni PIN. En `app/kiosko/page.tsx:207-217,310-320`, `encolarMarcacion` recibe solo `codigo`, `tipo` y `equipoId`, descartando `pinAProcesar`. En `app/kiosko/page.tsx:218,321`, la síntesis auditiva invoca `locutarMarcacionRegistrada(undefined, sonidoHabilitado)`, locutando «Marcación registrada» sin nombres, y el aviso visual (`:224,327`) comunica el mensaje neutro «Marcación guardada. Se enviará al volver la conexión.».                                                                                                                                                      |
| 3   | El envío es FIFO, uno a la vez, con espera creciente y sin duplicar envíos simultáneos (explica en el informe cómo lo garantizaste). | PASA   | `features/kiosko/cola/almacen-indexeddb.ts:148-151` ordena las pendientes por `marcadoEnDispositivo` ascendente (más antigua primero). `features/kiosko/cola/gestor-cola.ts:20,83-168` implementa un cerrojo atómico en memoria `estaProcesando`: cualquier llamada concurrente (múltiples eventos `online` o intervalos coincidentes) retorna inmediatamente (`:102-104`). El bucle procesa secuencialmente un registro a la vez (`pendientes[0]`). Transmite `idLocal` en `servicioMarcacion.registrarMarcacion({ ..., idLocal })` como clave de idempotencia (`:136-141`). Tras un fallo, invoca `actualizarIntento`, notifica el error y ejecuta `esperar(backoffActualMs, signal)` con duplicación exponencial (`:157-158`) de 1 s a 60 s (`Math.min(60000, backoffActualMs * 2)`), deteniendo el ciclo actual hasta el próximo intervalo de 30 s o evento de red. `TAREAS/T14_informe.md:53-58` documenta y fundamenta formalmente estas garantías. |
| 4   | `TAREAS/T14_propuestas.md` tiene las 3 preguntas de negocio.                                                                         | PASA   | `TAREAS/T14_propuestas.md:5-9` plantea de forma precisa las 3 dudas de negocio en el formato estandarizado de `SGA-API/docs/requerimientos/PENDIENTES.md`: P-19 (`RF-010`, hora válida oficial de marcación tardía y ventana de tolerancia temporal), P-20 (`RF-010`, mecanismo de prevención de duplicados por idempotencia en servidor), y P-21 (`RF-010`, política estricta de privacidad que prohíbe persistir nombres o PIN en equipos públicos). Cada fila incluye N.°, RF, Pregunta, A quién, Supuesto actual, Estado («Pendiente») y columna de Respuesta.                                                                                                                                                                                                                                                                                                                                                                                        |
| 5   | `bun run typecheck` y `bunx eslint features/kiosko app/kiosko` sin errores; `git status` solo con archivos permitidos.               | PASA   | `bun run typecheck` (`tsc --noEmit`) finalizó exitosamente con código 0 sin errores de tipos en todo el proyecto. `bunx eslint features/kiosko app/kiosko` reportó 0 errores y 0 advertencias (código 0). `git status --porcelain` para la entrega T14 abarca exclusivamente modificaciones en `app/kiosko/page.tsx`, `features/kiosko/components/kiosko-footer.tsx`, `features/kiosko/consts/index.ts`, `features/kiosko/index.ts`, `features/kiosko/types/index.ts`, la creación de `features/kiosko/cola/**` y los informes `TAREAS/T14_informe.md` y `TAREAS/T14_propuestas.md`. Los archivos paralelos de T15 (`components/layouts/header/*`, `features/calendario/*`) y notas de orquestación se ignoran conforme a las instrucciones.                                                                                                                                                                                                              |

## Pruebas ejecutadas

1. **Revisión estricta de alcance y archivos permitidos (`TAREAS/T14_kiosko_cola.md`):**
   - Modificados permitidos:
     - `app/kiosko/page.tsx` (conexión de la cola con `useColaMarcaciones` e inyección de datos al pie).
     - `features/kiosko/components/kiosko-footer.tsx` (soporte de conteo y estado de transmisión).
     - `features/kiosko/consts/index.ts` (bandera `COLA_SIN_CONEXION_HABILITADA = false`, constantes de base de datos y backoff).
     - `features/kiosko/index.ts` (exportación de sub-módulo `./cola`).
     - `features/kiosko/types/index.ts` (interfaces `MarcacionPendiente`, `EstadoColaMarcaciones`, extensión de `DatosRegistroMarcacion`).
   - Creados en `features/kiosko/cola/**`:
     - `features/kiosko/cola/almacen-indexeddb.ts` (operaciones nativas IndexedDB envueltas en Promises).
     - `features/kiosko/cola/gestor-cola.ts` (sincronizador FIFO, cerrojo mutex, idempotencia y backoff exponencial).
     - `features/kiosko/cola/use-cola-marcaciones.ts` (hook React con ciclo de vida, listeners y cleanups).
     - `features/kiosko/cola/index.ts` (barrel export público).
   - Documentación técnica:
     - `TAREAS/T14_informe.md` (informe técnico del DEV).
     - `TAREAS/T14_propuestas.md` (preguntas de negocio P-19, P-20 y P-21).
   - Cero archivos fuera del ámbito asignado para T14 (los archivos pertenecientes a T15 fueron excluidos de la evaluación).

2. **Auditoría de ciclo de vida, limpieza de recursos y prevención de memory leaks (`clean-code.md` regla 6):**
   - **IndexedDB (`almacen-indexeddb.ts`):** Todas las operaciones de base de datos (`encolar`, `listarPendientes`, `marcarEnviada`, `contarPendientes`, `actualizarIntento`, `limpiarCola`) invocan explícitamente `db.close()` tanto en `tx.oncomplete` como en `tx.onerror` y en el bloque `catch`, previniendo conexiones huérfanas en el navegador. Además, `abrirBaseDatos` registra `db.onversionchange = () => { db.close(); };` para evitar bloqueos ante migraciones de esquema.
   - **Listeners del navegador (`use-cola-marcaciones.ts`):** `window.addEventListener("online", handleOnline)` cuenta con su correspondiente `window.removeEventListener("online", handleOnline)` en la función de limpieza del efecto (`:108`).
   - **Temporizadores (`use-cola-marcaciones.ts`, `gestor-cola.ts`):** El intervalo periódico de 30 segundos `setInterval` es limpiado con `clearInterval(intervaloId)` en el retorno del efecto (`:109-111`). La función `esperar(ms, signal)` utiliza `setTimeout` vinculado a la señal de cancelación `AbortSignal` con `clearTimeout(timerId)`.
   - **Suscripciones y señales:** `suscribirEstadoCola` retorna su desuscripción `suscriptores.delete(suscriptor)` ejecutada al desmontar el componente (`:74`). El efecto de retransmisión cancela operaciones en vuelo con `abortController.abort()` en su cleanup (`:107`).
   - **Degradación ante IndexedDB bloqueado:** `estaDisponibleIndexedDB()` verifica `typeof window !== "undefined"` y la existencia de `window.indexedDB.open`. Si el entorno no soporta almacenamiento o está en modo de navegación privada estricta, la cola se deshabilita limpiamente sin excepciones no controladas.

3. **Auditoría de privacidad y seguridad de datos:**
   - Inspección estricta de campos persistidos en IndexedDB: Se confirmó que el almacén `marcaciones-pendientes` almacena únicamente `idLocal`, `codigo`, `tipo`, `marcadoEnDispositivo`, `intentos`, `ultimoError?` y `equipoId?`.
   - Cero persistencia de nombres de docentes o estudiantes (`grep -i "nombre" features/kiosko/cola/*` arrojó 0 asignaciones).
   - Cero persistencia o propagación de PIN o contraseñas (`grep -i "pin" features/kiosko/cola/*` arrojó 0 ocurrencias).
   - En `app/kiosko/page.tsx:207-234,310-337`, el parámetro `pinAProcesar` no se propaga a `encolarMarcacion`. La síntesis de voz en modo cola offline omite nombres de personas (`locutarMarcacionRegistrada(undefined, ...)`).

4. **Auditoría de tokens semánticos de diseño (`styling-icons.md`):**
   - Búsqueda regex de clases de paleta fija (`slate-*`, `blue-*`, `emerald-*`, `amber-*`, `red-*`, etc.): 0 coincidencias en `features/kiosko/cola/` y en las adiciones a `features/kiosko/components/kiosko-footer.tsx`.
   - Se utilizan exclusivamente tokens semánticos del sistema: `bg-destructive`, `text-destructive`, `bg-warning`, `shadow-warning/40`, `bg-success`, `shadow-success/40`, `text-foreground`, `text-muted-foreground`, `border-border/80`.

5. **Auditoría de accesibilidad WCAG 2.2 AA (`accessibility/SKILL.md`):**
   - En `features/kiosko/components/kiosko-footer.tsx:52-56`, el bloque de estado de conexión y cola cuenta con `aria-live="polite"` y `aria-atomic="true"`, informando cambios de conectividad y conteo de pendientes de forma no intrusiva a lectores de pantalla.
   - El indicador luminoso circular decorativo posee `aria-hidden="true"` (`:57-60`), evitando lectura redundante de elementos puramente visuales.
   - Contraste semántico de texto garantizado para modo claro y oscuro (`text-destructive font-semibold` y `text-foreground`).

6. **Auditoría de Clean Code y tipado estricto (`clean-code.md`, `typescript-advanced-types`):**
   - Cero `any`: contratos tipados exhaustivos en `features/kiosko/types/index.ts` e inferencia tipada en todas las promesas nativas de IndexedDB.
   - Cero directivas de evasión (`@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `eslint-disable`).
   - Cero llamadas a `console.log`, `alert()`, `confirm()` o comentarios residuales tipo `TODO` / `FIXME`.
   - Manejo de excepciones tipado mediante `unknown` y validación de tipos con `error instanceof Error`.

7. **Verificación de responsividad móvil (360 px), modo oscuro e internacionalización:**
   - **360 px:** El contenedor del pie (`KioskoFooter`) utiliza `flex flex-wrap items-center justify-between gap-3 text-xs`, ajustándose de manera fluida sin desbordamiento horizontal en pantallas móviles estrechas.
   - **Modo oscuro:** Estilos semánticos vinculados a variables CSS institucionales (`bg-background`, `text-foreground`, `text-muted-foreground`), garantizando legibilidad óptima en ambos modos.
   - **Textos en español:** Redacción coherente y formal en español institucional («Sin conexión · N pendientes», «En línea · enviando N», «Marcación guardada. Se enviará al volver la conexión.»).

8. **Comandos de verificación ejecutados:**
   - `bun run typecheck`: código 0 (0 errores de tipado).
   - `bunx eslint features/kiosko app/kiosko`: código 0 (0 errores, 0 advertencias de linter).

## Hallazgos

1. **[Baja] Dependencia de `totalPendientes` en el efecto de sincronización (`features/kiosko/cola/use-cola-marcaciones.ts:113`):**
   - _Detalle:_ El hook `useColaMarcaciones` incluye `totalPendientes` en el array de dependencias del `useEffect` que gestiona el `abortController` y el intervalo de 30 s. Cada vez que una marcación es enviada con éxito y se descuenta el conteo, el efecto se limpia llamando a `abortController.abort()` y se vuelve a ejecutar. Aunque el procesador de cola (`gestor-cola.ts`) previene carreras y el bucle reanuda el siguiente registro gracias a que `totalPendientes > 0`, esta reactividad aborta la iteración actual en lugar de permitir que el bucle `while (!signal?.aborted)` drene de forma continua y fluida la lista completa de pendientes.
   - _Impacto:_ No bloquea la funcionalidad ni genera fallos de consistencia, pero produce recreación innecesaria del controlador de aborto y reinicio de temporizadores por cada ítem transmitido.

2. **[Baja] Cleanup del listener de abort en `esperar` (`features/kiosko/cola/gestor-cola.ts:71-78`):**
   - _Detalle:_ La función `esperar(ms, signal)` adjunta un listener `{ once: true }` al evento `abort` de `signal`. Si el temporizador de reintento (`setTimeout`) expira normalmente, la promesa se resuelve sin remover explícitamente dicho listener. Dado que la señal está asociada al ciclo de vida del controlador, no genera un memory leak persistente, pero resulta más higiénico remover el event listener si el timer concluye primero.
   - _Impacto:_ Menor, no bloqueante.

## Recomendación al DEV

La entrega de la tarea T14 está **APROBADA** por VAL-3. Se recomienda considerar en futuros refinamientos las dos observaciones menores de severidad baja (estabilizar el ciclo continuo de drenado en `useColaMarcaciones` sin recrear el `AbortController` por cada ítem individual, y desuscribir el listener en `esperar`), pero la solución cumple rigurosamente con todos los criterios de aceptación, estándares de seguridad, limpieza de recursos nativos y aislamiento de datos personales.
