---
name: conventional-commits
description: Sugiere nombres de rama a partir de una descripción y redacta mensajes de commit siguiendo Conventional Commits (tipo(scope): descripción), donde el tipo y el scope del commit se heredan del nombre de la rama (feat/nombre_a → feat(nombre_a): …). Solo lee el repositorio y entrega texto; nunca crea ramas, commits, push, pull ni ejecuta comandos git que modifiquen nada. Genérica para cualquier proyecto.
---

# Habilidad: Nombres de Rama y Mensajes de Commit (Conventional Commits)

Esta habilidad cubre dos tareas relacionadas:

1. **Sugerir el nombre de una rama** a partir de una descripción del trabajo.
2. **Redactar el mensaje de commit** a partir de los cambios, alineado con la rama actual.

Se basa en la especificación [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/)
(la versión 1.0.0, que amplía la [beta.3](https://www.conventionalcommits.org/es/v1.0.0-beta.3/#especificaci%c3%b3n) sin romperla)
y sirve para cualquier proyecto, lenguaje o estructura de carpetas.

---

## Regla de oro: solo lectura, solo texto

Esta skill **no ejecuta ningún comando git que cambie algo**, aunque haya permisos para hacerlo
y sea cual sea el modo de permisos activo. Su resultado es **siempre texto** para que el usuario
lo copie y ejecute por su cuenta.

| Permitido (solo lectura)                                  | Prohibido (modifica el repo o el remoto)                        |
| --------------------------------------------------------- | --------------------------------------------------------------- |
| `git status`                                              | `git commit`, `git commit --amend`                              |
| `git diff`, `git diff --staged`                           | `git add`, `git rm`, `git mv`, `git restore`, `git reset`       |
| `git branch --show-current`                               | `git branch <nombre>`, `-m`, `-d`, `-D`                         |
| `git branch -a` / `git branch -r` (para ver convenciones) | `git checkout`, `git switch`                                    |
| `git log --oneline -n 20` (para ver el estilo del repo)   | `git push`, `git pull`, `git fetch`                             |
| `git show <hash>`                                         | `git merge`, `git rebase`, `git cherry-pick`, `git revert`      |
| Leer archivos del repo                                    | `git stash`, `git tag`, `git clean`, cualquier otro que escriba |

Si el usuario pide ejecutar alguno de los prohibidos dentro de esta skill, se le entrega el
comando **como texto** para que lo ejecute él.

---

## Parte 1 — Sugerir el nombre de la rama

### Formato

```
<tipo>/<nombre>
```

- **`<tipo>`**: uno de los tipos de la tabla (sección "Tipos"), en inglés y minúsculas.
- **`<nombre>`**: resume el trabajo en 2 a 5 palabras.
  - Minúsculas, sin tildes ni `ñ` (`ñ` → `n`), sin espacios ni caracteres especiales.
  - Palabras separadas por `_` (ej. `registro_personas`). Si el repo ya usa `-` en sus ramas
    (verlo con `git branch -a`), seguir la convención del repo. **Nunca mezclar** ambos en un mismo nombre.
  - Si hay un ticket o requerimiento, puede ir al inicio: `feat/rf037_cuentas_bancarias`, `fix/1234_calculo_interes`.
  - Un solo nivel después del tipo: `feat/cobros_anulacion`, no `feat/cobros/anulacion`
    (el nombre completo se usará como scope del commit).
  - Máximo ~40 caracteres en `<nombre>`.

### Cómo elegir el tipo de la rama

Según el **propósito principal** del trabajo descrito:

- Algo nuevo para el usuario o la API → `feat`
- Corregir un error → `fix`
- Reestructurar sin cambiar comportamiento → `refactor`
- Solo documentación → `docs`
- Solo pruebas → `test`
- Dependencias, build → `build`; pipelines → `ci`; mantenimiento → `chore`

Si el repo usa además prefijos propios (`hotfix/`, `release/`, `bugfix/`), se respetan, y para
el commit se mapean así: `hotfix` y `bugfix` → `fix`; `release` → `chore`.

### Entrega

Proponer **una opción principal y hasta dos alternativas**, con el comando **como texto** (no se ejecuta):

```text
Rama sugerida:   feat/registro_personas
Alternativas:    feat/crud_personas · feat/gestion_personas

Para crearla (ejecútalo tú):
git switch -c feat/registro_personas
```

Si la descripción mezcla trabajos independientes (ej. una feature y un bug ajeno), sugerir
**una rama por trabajo**.

---

## Parte 2 — Redactar el mensaje de commit

### Estructura

```
<tipo>(<scope>)[!]: <descripción>

[cuerpo opcional]

[nota(s) de pie opcional(es)]
```

### Regla de la rama → commit (obligatoria)

Si la rama actual tiene la forma `<tipo>/<nombre>`, el commit **hereda ambos**:

| Rama                         | Cabecera del commit              |
| ---------------------------- | -------------------------------- |
| `feat/nombre_a`              | `feat(nombre_a): …`              |
| `fix/calculo_interes`        | `fix(calculo_interes): …`        |
| `refactor/validators_cobros` | `refactor(validators_cobros): …` |
| `hotfix/login_caido`         | `fix(login_caido): …`            |

- El **scope es el `<nombre>` de la rama, copiado idéntico** (mismos `_` o `-`, mismo orden). No se traduce, no se abrevia, no se cambia de formato.
- El **tipo es el de la rama**.
- Si el cambio a commitear **no corresponde al propósito de la rama** (ej. en `feat/registro_personas` se corrige algo de otro módulo), **advertir** al usuario que ese cambio probablemente pertenece a otra rama y sugerir su nombre. Si igual decide commitearlo ahí, se mantiene la cabecera heredada de la rama y se explica el cambio en el cuerpo.
- Si el tipo de la rama no está en la tabla de tipos, avisar y proponer el tipo válido más cercano.

**Ramas sin esa forma** (`main`, `master`, `develop`, `dev`, ramas personales): no hay scope heredado.
Se define el scope según el área afectada (ver "Scope sin rama"), y se recomienda al usuario
trabajar en una rama `<tipo>/<nombre>` (sugiriéndole el nombre).

### Reglas de la especificación

1. El commit **empieza con un tipo**, seguido de scope opcional, `!` opcional, **dos puntos y un espacio**.
2. `feat` se usa cuando se agrega una nueva funcionalidad.
3. `fix` se usa cuando se corrige un error.
4. El **scope** va entre paréntesis después del tipo y es un sustantivo que describe una sección del código: `fix(parser):`.
5. La **descripción** va inmediatamente después de `: ` y es un resumen corto de los cambios.
6. Un **cuerpo** más extenso puede ir después de la descripción, separado por **una línea en blanco**. Es de formato libre.
7. Una o más **notas de pie** pueden ir una línea en blanco después del cuerpo, con formato `Token: valor` o `Token #valor` (ej. `Refs: #123`, `Reviewed-by: Nombre`). Los tokens usan `-` en lugar de espacios, excepto `BREAKING CHANGE`.
8. Un **cambio incompatible** (_breaking change_) se indica con `!` antes de los `:` en la cabecera, o con la nota de pie `BREAKING CHANGE: <descripción>` (en mayúsculas), o con ambos.
9. Después de `BREAKING CHANGE: ` **siempre** va una descripción de qué cambió y qué debe hacer quien lo usa.
10. Las notas de pie contienen solo `BREAKING CHANGE`, referencias a tickets y metainformación (revisores, coautores).
11. Se pueden usar tipos distintos de `feat` y `fix` (ver tabla).

### Tipos

| Tipo       | Cuándo usarlo                                                                                       | SemVer |
| ---------- | --------------------------------------------------------------------------------------------------- | ------ |
| `feat`     | Nueva funcionalidad visible para el usuario o el consumidor de la API                               | MINOR  |
| `fix`      | Corrección de un error                                                                              | PATCH  |
| `refactor` | Cambio de código que no agrega funcionalidad ni corrige errores (reestructurar, renombrar, limpiar) | —      |
| `perf`     | Mejora de rendimiento                                                                               | —      |
| `docs`     | Solo documentación                                                                                  | —      |
| `style`    | Formato sin cambio de lógica (espacios, indentación, punto y coma)                                  | —      |
| `test`     | Agregar o corregir pruebas, sin tocar código de producción                                          | —      |
| `build`    | Sistema de build o dependencias (archivos de proyecto, paquetes, gestores de dependencias)          | —      |
| `ci`       | Configuración o scripts de integración continua                                                     | —      |
| `chore`    | Mantenimiento que no encaja en los anteriores                                                       | —      |
| `revert`   | Revierte un commit anterior (cuerpo: `This reverts commit <hash>.`)                                 | —      |

Cualquier tipo con `!` o `BREAKING CHANGE:` equivale a **MAJOR**.

### Descripción (primera línea)

- En el **idioma del proyecto** (ver `git log`); por defecto, español.
- En minúscula salvo nombres propios o siglas, **sin punto final**.
- Dice **qué** cambia, no cómo. Empieza con verbo: `agregar`, `corregir`, `quitar`, `ajustar`…
- Cabecera completa idealmente ≤ 72 caracteres.

### Cuerpo

- Opcional. Si el cambio es puntual, basta la cabecera.
- Lista de viñetas con `-`, una por cambio relevante.
- **Corto por defecto**: máximo 3–4 viñetas de alto nivel, sin enumerar cada archivo. Solo más detalle si el usuario lo pide ("más detallado", "explica cada cambio").
- Si el commit toca varias capas o áreas del proyecto para el mismo trabajo, una viñeta por capa, nombrándola al inicio: `- Backend: …`, `- Frontend: …`, `- Base de datos: …`. Los nombres de capa salen de la estructura real del repo.
- Puede explicar el **por qué** del cambio cuando no es obvio.

### Scope sin rama

Solo cuando la rama no es `<tipo>/<nombre>`:

- Por funcionalidad o módulo si el cambio es acotado: `(registro_personas)`, `(auth)`.
- Por capa si el cambio es transversal: `(backend)`, `(frontend)`, `(bd)`.
- Mismo separador que usen las ramas del repo.
- Puede omitirse si el cambio no tiene un área clara: `docs: corregir enlaces del readme`.

### Varios cambios en un mismo staging

- Si hay `feat` y `fix` **del mismo trabajo**, manda el tipo de la rama.
- Si hay cambios **sin relación entre sí**, sugerir separarlos en varios commits (indicando qué archivos van en cada uno y los comandos `git add` como texto).

---

## Pasos de ejecución

**Para sugerir una rama:**

1. Leer la descripción del usuario (y opcionalmente `git branch -a` para ver la convención del repo).
2. Elegir el tipo por el propósito principal.
3. Construir el nombre con las reglas de formato.
4. Entregar la opción principal, las alternativas y el comando como texto.

**Para redactar un commit:**

1. `git branch --show-current` → ¿es `<tipo>/<nombre>`? Si lo es, fijar tipo y scope heredados.
2. `git status` y `git diff --staged` (si no hay nada en staging, `git diff` y avisar que no hay cambios preparados).
3. Opcional: `git log --oneline -n 20` para ver el idioma y estilo del repo.
4. Comprobar que los cambios corresponden al propósito de la rama; si no, advertir.
5. Redactar la descripción, el cuerpo (si aporta) y las notas de pie (si aplican).
6. Entregar el mensaje completo en un bloque ` ```text `. **No ejecutar `git commit`.**

---

## Ejemplos

**Sugerencia de rama**

> Descripción: "hay que agregar la pantalla para registrar personas naturales y jurídicas"

```text
Rama sugerida:   feat/registro_personas
Alternativas:    feat/alta_personas · feat/personas_naturales_juridicas

Para crearla (ejecútalo tú):
git switch -c feat/registro_personas
```

> Descripción: "el cálculo de intereses redondea mal cuando el plazo es de 30 días"

```text
Rama sugerida:   fix/redondeo_interes_30_dias
Alternativas:    fix/calculo_interes · fix/redondeo_interes

Para crearla (ejecútalo tú):
git switch -c fix/redondeo_interes_30_dias
```

**Commit en rama `feat/registro_personas`, varias capas**

```text
feat(registro_personas): agregar registro y gestión de personas naturales y jurídicas

- Backend: endpoints para guardar, listar, obtener y cambiar estado de personas
- Base de datos: tablas de catálogo y procedimientos de personas
- Frontend: pantalla de listado y formulario de registro
```

**Commit en rama `fix/redondeo_interes_30_dias`, cambio puntual**

```text
fix(redondeo_interes_30_dias): redondear el interés a dos decimales al final del cálculo
```

**Commit en rama `docs/guia_despliegue`**

```text
docs(guia_despliegue): agregar pasos de configuración de variables de entorno
```

**Cambio incompatible, rama `feat/auth_tokens`**

```text
feat(auth_tokens)!: invalidar tokens antiguos al cambiar la política de expiración

- Los tokens ahora expiran a las 8 horas en lugar de 24

BREAKING CHANGE: los tokens emitidos antes de este cambio dejan de ser válidos; todos los clientes deben volver a autenticarse.
Refs: #231
```

**Revert, rama `revert/calculo_comisiones`**

```text
revert(calculo_comisiones): revertir el nuevo cálculo de comisiones

This reverts commit 3f2a91c.
```

**Rama `develop` (sin scope heredado)**

```text
fix(auth): corregir el cierre de sesión cuando expira el token

Sugerencia: para el próximo trabajo usa una rama propia, por ejemplo fix/cierre_sesion_token.
```

**Cambio que no pertenece a la rama**

> Rama `feat/registro_personas`, pero el staging contiene solo un ajuste en el módulo de facturación.

```text
Aviso: estos cambios (facturacion/…) no parecen parte de "registro_personas".
Sugerencia: muévelos a una rama propia, por ejemplo fix/facturacion_serie.

Si igual los commiteas en esta rama:
feat(registro_personas): ajustar la serie de facturación usada por el registro

- Facturación: se corrige la serie por defecto requerida al registrar personas
```
