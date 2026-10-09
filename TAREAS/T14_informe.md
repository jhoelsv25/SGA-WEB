# Informe T14 · Kiosko: Cola de marcaciones sin conexión (DEV-1 · Fase 3)

## 1. Archivos cambiados y acciones realizadas

| Archivo                                        | Acción     | Descripción                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `features/kiosko/cola/almacen-indexeddb.ts`    | Creado     | Almacén nativo IndexedDB (`sga-kiosko`, object store `marcaciones-pendientes`) con funciones tipadas envueltas en Promises (`encolar`, `listarPendientes`, `marcarEnviada`, `contarPendientes`, `actualizarIntento`, `limpiarCola`, `estaDisponibleIndexedDB`). **No guarda nombres ni PIN**. Genera `idLocal` único (`crypto.randomUUID()`) como clave de idempotencia. |
| `features/kiosko/cola/gestor-cola.ts`          | Creado     | Procesador y sincronizador de cola en estricto orden FIFO. Garantiza **un solo envío a la vez (sin carreras)** mediante cerrojo de exclusión mutua en memoria (`estaProcesando`). Implementa espera creciente con backoff exponencial (1 s, 2 s, 4 s... hasta 60 s) ante fallas, respetando `AbortSignal`.                                                               |
| `features/kiosko/cola/use-cola-marcaciones.ts` | Creado     | Hook React `useColaMarcaciones` que monitorea el conteo de pendientes y estado de envío. Gestiona listeners (`window.addEventListener('online')`), intervalo periódico de 30 s mientras haya pendientes y suscripciones con limpieza total (cleanups) en desmontaje. Maneja degradación limpia si IndexedDB no está disponible.                                          |
| `features/kiosko/cola/index.ts`                | Creado     | Barrel export público del sub-módulo de la cola sin conexión.                                                                                                                                                                                                                                                                                                            |
| `features/kiosko/consts/index.ts`              | Modificado | Declaración de la bandera `COLA_SIN_CONEXION_HABILITADA = false`, nombres de base de datos (`sga-kiosko`), almacén (`marcaciones-pendientes`), versión y tiempos de revisión (30 s) y backoff exponencial (1 s a 60 s).                                                                                                                                                  |
| `features/kiosko/types/index.ts`               | Modificado | Declaración de la interfaz `MarcacionPendiente`, `EstadoColaMarcaciones` y extensión de `DatosRegistroMarcacion` con el campo `idLocal` para la clave de idempotencia.                                                                                                                                                                                                   |
| `features/kiosko/components/kiosko-footer.tsx` | Modificado | Soporte de propiedades `totalPendientes` y `enviandoCola`. Con bandera en `false`, mantiene la visualización original de T13. Con bandera en `true`, muestra `Sin conexión · N pendientes` o `En línea · enviando N` con `aria-live="polite"` y tokens de tema accesibles.                                                                                               |
| `features/kiosko/index.ts`                     | Modificado | Exportación del módulo `./cola` a través del barril general de kiosko.                                                                                                                                                                                                                                                                                                   |
| `app/kiosko/page.tsx`                          | Modificado | Integración de `useColaMarcaciones`. Con la bandera en `false`, nada cambia respecto de T13. Con `true`, encola marcaciones ante desconexión o fallas de red mostrando el aviso «Marcación guardada. Se enviará al volver la conexión.» y pasa datos de cola al pie.                                                                                                     |
| `TAREAS/T14_propuestas.md`                     | Creado     | Formulación de las 3 preguntas de negocio pendientes (hora oficial válida de marcación desfasada, prevención de duplicados por idempotencia en servidor, y política de no guardar nombres/datos personales en el terminal) en formato estándar de fila de `PENDIENTES.md`.                                                                                               |
| `TAREAS/T14_informe.md`                        | Creado     | Informe técnico y de conformidad de la tarea T14.                                                                                                                                                                                                                                                                                                                        |

---

## 2. Skills leídas y reglas aplicadas

| Skill leída                 | Reglas aplicadas (resumen)                                                                                                                                                                                           | Dónde (archivo)                                                                             |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `react-best-practices`      | Inicialización perezosa de estado (`useState(() => fn())`), eliminación de renders en cascada (`react-hooks/set-state-in-effect`), control de cancelaciones con `AbortSignal`, callbacks estables con `useCallback`. | `features/kiosko/cola/use-cola-marcaciones.ts`, `app/kiosko/page.tsx`                       |
| `tanstack-query`            | Respeto al ciclo de validación de tokens y caché del equipo sin sobreescrituras innecesarias en modo sin conexión.                                                                                                   | `app/kiosko/page.tsx`                                                                       |
| `typescript-advanced-types` | Tipado estricto cero `any`, contratos de interfaces discriminadas, manejo de errores tipados con `unknown` y guards de tipo.                                                                                         | `features/kiosko/types/index.ts`, `features/kiosko/cola/almacen-indexeddb.ts`               |
| `accessibility` (a11y)      | Anuncio dinámico para lectores de pantalla mediante `aria-live="polite"` y `aria-atomic="true"` en el pie de conexión, preservación de foco accesible y contraste semántico AA con tokens del tema.                  | `features/kiosko/components/kiosko-footer.tsx`                                              |
| `clean-code`                | Limpieza estricta de efectos (`useEffect` cleanup de listeners `online`/`offline`, `clearInterval`, `AbortController.abort()`), cierre inmediato de conexiones de base de datos (`db.close()`) en cada transacción.  | `features/kiosko/cola/almacen-indexeddb.ts`, `features/kiosko/cola/use-cola-marcaciones.ts` |
| `api-client-mutations`      | Conexión segura con el contrato de servicio existente sin alertas directas de navegador (`window.alert` prohibido), propagación de clave de idempotencia `idLocal`.                                                  | `features/kiosko/cola/gestor-cola.ts`, `app/kiosko/page.tsx`                                |

---

## 3. Garantías de los criterios de aceptación

### 1. Comportamiento intacto con la bandera desactivada

La constante `COLA_SIN_CONEXION_HABILITADA` está fijada en `false` en `features/kiosko/consts/index.ts`.

- En `app/kiosko/page.tsx`, si la bandera es `false`, la verificación de conexión ejecuta exactamente la lógica de T13: ante `!estaEnLinea` muestra la pantalla completa `KioskoPantallaDesconectado`. No se encola ninguna marcación ni se alteran los mensajes.
- En `features/kiosko/components/kiosko-footer.tsx`, con la bandera en `false`, muestra textualmente `En línea • Conectado a SGA API` o `Sin conexión • Modo sin conexión`, exactamente igual a T13.
- En `useColaMarcaciones`, si la bandera es `false`, retorna inmediatamente sin registrar ningún listener ni intervalo de temporizador.

### 2. Privacidad y estructura del registro local

El esquema del objeto `MarcacionPendiente` y la función `encolar` almacenan únicamente:

- `idLocal`: `string` generado con `crypto.randomUUID()`.
- `codigo`: `string` digitado por el usuario.
- `tipo`: `TipoMarcacion` (`"entrada"` o `"salida"`).
- `marcadoEnDispositivo`: `string` (marca temporal en formato ISO 8601).
- `intentos`: `number` (iniciado en 0).
- `ultimoError?`: `string` opcional tras fallas.
- `equipoId?`: `string` opcional correspondiente al terminal.
  **Bajo ninguna circunstancia se almacena nombre, apellidos, foto, perfil ni PIN.**

### 3. Envío FIFO, uno a la vez (sin carreras) y backoff exponencial

- **Estricto FIFO**: `listarPendientes()` consulta todos los registros y los ordena ascendente por `marcadoEnDispositivo`. El procesador toma siempre el primer elemento `pendientes[0]` (el más antiguo).
- **Un solo envío a la vez (sin carreras)**: `gestor-cola.ts` mantiene la bandera en memoria `estaProcesando = true` durante toda la ejecución de `procesarCola()`. Cualquier llamada concurrente (por ejemplo, múltiples eventos `online` o disparos simultáneos del temporizador) detecta el cerrojo activo y retorna inmediatamente sin duplicar la ejecución.
- **Idempotencia**: Cada llamada a `servicioMarcacion.registrarMarcacion` envía `idLocal: siguiente.idLocal`. Si el servidor procesó la petición previamente pero la respuesta se perdió por 3G intermitente, el backend puede descartar la duplicidad usando este identificador único.
- **Espera creciente (backoff exponencial)**: Si una petición falla, `gestor-cola.ts` incrementa el contador de intentos, registra el mensaje de error en IndexedDB y entra en una pausa calculada con `esperar(backoffActualMs, signal)`. La espera comienza en 1000 ms (1 s) y se duplica en cada fallo (2 s, 4 s, 8 s, 16 s, 32 s, hasta un tope de 60 s con `Math.min(60000, backoffActualMs * 2)`), deteniendo el ciclo actual de vaciado para reanudarlo en el próximo intervalo de 30 s o evento de red.

### 4. Tolerancia y modo privado

La función `estaDisponibleIndexedDB()` verifica `typeof window !== "undefined"` y la existencia de `window.indexedDB.open`. Si el navegador está en navegación privada estricta o sin soporte de almacenamiento, la cola se desactiva silenciosamente sin provocar errores no controlados ni romper la interfaz del kiosko.

---

## 4. Salida de los comandos de verificación

### Verificación de tipos (`bun run typecheck`)

```text
$ tsc --noEmit
(salida limpia, código de salida 0)
```

### Verificación de linter (`bunx eslint features/kiosko app/kiosko`)

```text
(salida limpia, 0 problemas, 0 advertencias, código de salida 0)
```

### Estado de control de versiones (`git status --porcelain`)

Archivos de la tarea T14 en el working tree:

```text
 M app/kiosko/page.tsx
 M features/kiosko/components/kiosko-footer.tsx
 M features/kiosko/consts/index.ts
 M features/kiosko/index.ts
 M features/kiosko/types/index.ts
?? features/kiosko/cola/
```

_(Nota: `TAREAS/T14_propuestas.md` y `TAREAS/T14_informe.md` creados en disco; la carpeta `TAREAS/` está excluida en `.git/info/exclude`. Archivos ajenos preexistentes de otras tareas en paralelo en `.agents/memory/`, `components/layouts/header/` y `features/calendario/` no fueron modificados)._

---

## Commit propuesto

```text
feat(kiosko): cola de marcaciones sin conexión en IndexedDB

- Implementar almacén nativo IndexedDB 'sga-kiosko' con orden FIFO y clave de idempotencia
- Sincronizar cola ante evento online y cada 30 s con backoff exponencial sin carreras
- Conectar estado real de pendientes al pie con aria-live y bandera de activación
- Anotar preguntas de negocio en T14_propuestas.md y mantener aislamiento de nombres y PIN

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KMcYEyxxxQcyrp9TQj7msR
```
