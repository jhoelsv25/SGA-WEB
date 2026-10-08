---
name: nombre-rama-rf
description: Sugiere el nombre de la rama git para trabajar un Requerimiento Funcional (RF) del SGA Colegio según el estándar del proyecto (feat/rf-001-acceso-al-sistema, feat/rf-001-v2-varios-perfiles, fix/rf-004-geocerca-institucion…), igual en SGA-API y SGA-WEB, y el mensaje de commit que hereda de ella. Úsala cuando el usuario vaya a empezar, retomar o corregir un RF ("qué rama creo para el RF-011", "voy a implementar la V2 del RF-001", "rama para corregir el defecto D-03"). Solo lee el repositorio y entrega texto; nunca crea ramas ni ejecuta comandos git que modifiquen nada.
---

# Habilidad: Nombre de rama por requerimiento (RF)

Estándar de ramas del SGA Colegio. Complementa a `conventional-commits` (que redacta el commit):
esta skill fija **cómo se nombra la rama de cada RF**.

## Regla de oro: solo lectura, solo texto

Igual que `conventional-commits`: solo se permiten `git branch -a`, `git branch --show-current`,
`git log`, `git status` y leer archivos. **Nunca** `git switch -c`, `git checkout -b`, `push`, etc.:
el comando se entrega como texto para que el usuario lo ejecute.

## Formato

```
<tipo>/rf-<NNN>[-v<N>]-<tema>
```

| Parte | Regla | Ejemplo |
|---|---|---|
| `<tipo>` | Conventional Commits en minúsculas (ver tabla de tipos) | `feat` |
| `rf-<NNN>` | Número del RF con 3 dígitos, **siempre** presente | `rf-001` |
| `-v<N>` | Solo si se implementa una **versión posterior** del RF (V2, V3…) | `-v2` |
| `<tema>` | 2 a 4 palabras en `kebab-case`: minúsculas, sin tildes ni `ñ`, separadas por `-` | `varios-perfiles` |

- Separador **siempre `-`** (es la convención ya usada en el repo: `feat/rf-003-bitacora-de-auditoria`). Nunca `_`.
- Un solo nivel después del tipo. Largo total ≤ 50 caracteres.
- **El mismo nombre de rama en SGA-API y en SGA-WEB** cuando el RF toca ambos, para poder relacionar los PR.

## Tipos

| Situación | Tipo | Tema | Ejemplo |
|---|---|---|---|
| Implementar un RF por primera vez (V1) | `feat` | nombre corto del RF (de su carpeta) | `feat/rf-011-registro-sesion-clase` |
| Implementar los cambios de una nueva versión | `feat` | el cambio principal de la versión | `feat/rf-001-v2-varios-perfiles` |
| Corregir un defecto encontrado en pruebas | `fix` | el defecto | `fix/rf-004-geocerca-institucion` |
| Reestructurar código de un RF sin cambiar comportamiento | `refactor` | qué se reorganiza | `refactor/rf-002-servicio-permisos` |
| Solo pruebas de un RF | `test` | qué se prueba | `test/rf-003-casos-bitacora` |
| Solo documentación del RF (redacción, V2 del .md, backlog) | `docs` | versión o tema | `docs/rf-016-v2-peso-por-tipo` |
| Varios RF a la vez (no recomendado) | — | sugerir **una rama por RF** | — |

Si el defecto viene de una ejecución de pruebas, puede incluir su ID: `fix/rf-001-d01-mensaje-bloqueo`.

## Cómo obtener los datos

1. **Número y versión:** del backlog `docs/00-Plan-y-Backlog-RF.md` (columna *Documento*: `V1`, `V2`…) o de la carpeta `docs/requerimientos/RF-NNN_*/V<n>/`. Si el estado es `Pendiente (Vn)`, la rama lleva `-v<n>`.
2. **Tema:** del nombre de la carpeta del RF (V1) o del bloque *"Cambios de la versión N"* del `.md` (versión posterior). En el SGA-WEB la ruta es `../SGA-API/docs/...`.
3. **Ramas existentes:** revisar `git branch -a` para no repetir un nombre ni romper la convención.

## Entrega

```text
RF-001 · V2 · Pendiente (V2)
Rama sugerida:   feat/rf-001-v2-varios-perfiles
Alternativas:    feat/rf-001-v2-cambio-perfil · feat/rf-001-v2-perfiles-variables

Crear en SGA-API y SGA-WEB (ejecútalo tú):
git switch main && git pull
git switch -c feat/rf-001-v2-varios-perfiles

Primer commit (hereda tipo y scope de la rama, ver skill conventional-commits):
feat(rf-001-v2-varios-perfiles): agregar tabla usuario_roles y migrar rol_id
```

Además, listar en 3 a 6 viñetas **qué cubre la rama**: los escenarios del RF pendientes (IDs `CP-RF…` de
`docs/pruebas/casos/`), para que el trabajo quede acotado al RF.

## Al terminar la rama

- Antes del PR: actualizar el avance con la skill `actualizar-backlog-rf`.
- Al resolver conflictos de `docs/00-Plan-y-Backlog-RF.md`, **combinar** ambas versiones (nunca quedarse con una sola): se pierde avance de otros.
