#!/usr/bin/env bash
# Verificación objetiva. Uso: verificar_tarea.sh T0X [--suite-completa]
# Imprime una sola línea: OK | FALLA: <motivo>. Exit 0 si OK.
set -u
cd "$(dirname "$0")/../.." || exit 2
tarea="${1:-?}"
log="TAREAS/VALIDACION/verificar_${tarea}.log"
mkdir -p TAREAS/VALIDACION
: > "$log"
paso() { if ! "$@" >>"$log" 2>&1; then echo "FALLA: $tarea · $* (ver $log)"; exit 1; fi; }
paso bun run typecheck
paso bun run lint
if [ "${2:-}" = "--suite-completa" ] || [ "${2:-}" = "--fase" ]; then paso bun run build; fi
nuevos=$( { git diff HEAD -U0 -- . ':!TAREAS' | grep -E '^\+[^+]'; git ls-files --others --exclude-standard -z -- app components features config hooks lib | xargs -0 -r cat; } 2>/dev/null \
  | grep -E 'console\.log|debugger|@ts-ignore|eslint-disable|: any\b|<any>' | head -1)
if [ -n "$nuevos" ]; then echo "FALLA: $tarea · patrón prohibido nuevo: $nuevos"; exit 1; fi
echo "OK"
