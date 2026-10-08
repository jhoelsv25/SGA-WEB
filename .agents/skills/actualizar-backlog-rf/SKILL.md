---
name: actualizar-backlog-rf
description: Actualiza el avance de los Requerimientos Funcionales (RF) en el backlog vivo del SGA Colegio (SGA-API/docs/00-Plan-y-Backlog-RF.md) cada vez que se implementa, avanza, prueba o termina parte de un RF en SGA-WEB (frontend Next.js) (capa Front). Úsala SIEMPRE al cerrar una tarea de desarrollo que toque un RF ("ya terminé el login", "avancé el registro de sesiones", "implementa el RF-011", "¿cuánto falta del RF-007?"), al resolver un pendiente de PENDIENTES.md, o cuando el usuario pida ver o recalcular el avance.
---

# Habilidad: Actualizar el avance del backlog de RF (capa Front)

El backlog vivo del proyecto es **`../SGA-API/docs/00-Plan-y-Backlog-RF.md`**. Es la fuente de verdad del avance:
cada RF tiene una columna **Back %**, una **Front %** y un **Estado**. Esta skill se usa
en **SGA-WEB (frontend Next.js)**, así que solo actualiza la columna **Front %** (la otra capa la
actualiza la misma skill en SGA-API (backend)).

Archivos relacionados:

| Archivo | Para qué |
|---|---|
| `../SGA-API/docs/00-Plan-y-Backlog-RF.md` | Tabla de RF con avance y registro de avance |
| `../SGA-API/docs/requerimientos/RF-XXX_Nombre/V*/RF-XXX_Nombre.md` | Especificación del RF (escenarios Gherkin). Usar la **versión más alta** (`V2/` sobre `V1/`) |
| `../SGA-API/docs/requerimientos/PENDIENTES.md` | Preguntas abiertas al colegio que pueden bloquear un RF |

## Cuándo actuar

1. **Al terminar una tarea de desarrollo** que implemente o modifique comportamiento de un RF
   (aunque el usuario no lo pida): antes de dar la tarea por cerrada, actualizar el backlog.
2. Cuando el usuario pregunte **cuánto falta** de un RF o del proyecto.
3. Cuando se **resuelva un pendiente** (P-XX) o se cree una nueva versión de un RF.

Si la tarea no toca ningún RF (refactor interno, configuración, dependencias), no se actualiza;
decirlo en una línea.

## Paso 0 — Cambios en un RF que ya tiene desarrollo (nueva versión)

Si la especificación de un RF cambia (respuesta de un pendiente, nueva regla, nuevo escenario)
y ese RF ya tiene desarrollo (Back % o Front % mayor que 0):

1. **No editar la versión vigente.** Crear una carpeta nueva junto a la anterior
   (`V1/` → `V2/` → `V3/`…), copiar el `.md`, subir la versión en la cabecera
   (`**Versión:** 2.0` y `**Fecha:** actualización v2.0: AAAA-MM-DD`), agregar el bloque
   `> **Cambios de la versión 2.0 sobre la 1.0 (...)**` y marcar lo nuevo con `(v2.0)`.
2. **Apuntar todo a la nueva versión:** el enlace del RF en el backlog, la fuente de
   `docs/pruebas/casos/RF-XXX_*/casos-de-prueba.md` (regenerarlo conservando los IDs; los
   escenarios nuevos toman números nuevos) y cualquier otro `.md` que enlace a `/V1/`.
3. **Marcar el backlog:** columna *Documento* = `V2` (o `V2 (con pendientes)`), *Estado* =
   `Pendiente (V2)`, *Pendientes* = qué falta implementar, y **recalcular** Back % y Front %
   con los escenarios de la nueva versión (los escenarios nuevos cuentan como no
   implementados hasta verificarlos en el código).
4. Registrar la fila en el *Registro de avance* explicando por qué bajó el porcentaje.

Si el RF todavía no tiene desarrollo (0 %), también se crea la nueva versión cuando el
cambio viene de un pendiente resuelto, pero el estado sigue `Por desarrollar`.

## Paso 1 — Identificar el RF

Deducirlo de lo implementado (módulo, pantalla, endpoint) comparándolo con la columna
*Requerimiento* del backlog y con los escenarios del RF. Si el trabajo toca varios RF,
actualizar cada uno. Si no es claro a qué RF pertenece, **preguntar** antes de escribir.

## Paso 2 — Medir el avance con los escenarios (no a ojo)

El porcentaje se calcula sobre los **escenarios Gherkin** del RF (`### Escenario:`), no por
sensación:

1. Leer el RF (versión más alta) y listar sus escenarios.
2. Marcar cuáles **aplican a la capa Front**:
   - Aplican al **Front** los escenarios con algo que el usuario ve o hace: pantallas, formularios,
     botones, mensajes literales, listados y filtros, opciones ocultas por permiso, confirmaciones
     y estados de carga, vacío o error de conexión.
   - No aplican los que son solo del servidor (procesos automáticos, cálculos internos, auditoría
     sin pantalla).
3. Marcar cuáles están **implementados y verificados** en SGA-WEB (frontend Next.js). "Verificado" = existe una
   prueba que lo cubre o se comprobó ejecutando la aplicación. Un escenario escrito pero sin
   verificar cuenta como **no implementado**.
4. **Front % = escenarios implementados y verificados ÷ escenarios que aplican a la capa × 100**,
   redondeado al entero.

Mostrar al usuario la lista en el chat antes de escribir, así:

```
RF-011 — capa Front (9 de 14 escenarios = 64 %)
✅ Firmar ingreso con código y PIN          (test: sesiones.service.spec.ts)
✅ Firma fuera de horario
⬜ Sesión no firmada al cierre del día      ← falta
⬜ Bloque doble                              ← bloqueado por P-04
```

## Paso 3 — Actualizar el backlog

En `../SGA-API/docs/00-Plan-y-Backlog-RF.md`:

1. **Fila del RF en la tabla "Backlog de RF y avance":** cambiar solo la columna **Front %**.
2. **Estado** de la fila, según ambas columnas:
   - `Por desarrollar` → Back y Front en 0 %.
   - `En desarrollo` → alguna entre 1 % y 99 %.
   - `Completado` → Back **y** Front al 100 %.
   - `Pendiente (Vn)` → estaba desarrollado y el RF pasó a una nueva versión; falta implementar lo nuevo.
   - `Bloqueado` → no se puede avanzar porque un escenario depende de un pendiente (P-XX) sin respuesta. Indicar el P-XX en la columna *Pendientes*.
3. **Resumen de avance:** recalcular RF completados, y el promedio de Back % y de Front % de los 20 RF.
4. **Registro de avance:** agregar **una fila arriba** (la más reciente primero):
   `| AAAA-MM-DD | RF-XXX | Front | 40 % | 64 % | qué se hizo en una frase | escenarios que faltan |`
5. Actualizar **Última actualización** en la cabecera con la fecha de hoy.

No tocar la columna de la otra capa, ni el texto de los RF, ni otras secciones.

## Paso 4 — Pendientes y versiones

- Si al implementar aparece una duda de negocio que el RF no resuelve, **no inventar la regla**:
  agregarla como nueva fila `P-XX` en `PENDIENTES.md` y poner el RF en `Bloqueado` solo si
  impide avanzar.
- Si se resolvió un pendiente, marcarlo `Resuelto` con la respuesta en `PENDIENTES.md`, poner el
  *Documento* del RF en `Con pendientes` → `V2` cuando se haya generado la nueva versión
  (con la skill de redacción de RF), y quitar el P-XX de la columna *Pendientes*.

## Paso 5 — Informar

Cerrar con una línea: `RF-011: Front 40 % → 64 % (En desarrollo). Faltan 5 escenarios: …`

## Reglas que no se negocian

1. El porcentaje sale **siempre** de contar escenarios; nunca se estima.
2. Un escenario sin verificar no suma.
3. Nunca bajar un porcentaje sin explicar por qué (por ejemplo, el RF pasó a V2 y tiene escenarios nuevos).
4. Solo se edita la columna de la capa propia (**Front**).
5. Fechas en formato `AAAA-MM-DD`.
