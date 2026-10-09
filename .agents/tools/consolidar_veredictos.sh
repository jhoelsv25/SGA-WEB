#!/usr/bin/env bash
# Une los JSON de VAL-1..3 de una tarea. Uso: consolidar_veredictos.sh FASE_0F T0X
set -u
cd "$(dirname "$0")/../.." || exit 2
dir="TAREAS/VALIDACION/$1"; tarea="$2"
python3 - "$dir" "$tarea" <<'PY'
import json, sys, glob
d, t = sys.argv[1], sys.argv[2]
archivos = sorted(glob.glob(f"{d}/{t}_veredicto_VAL*.json"))
vs = [json.load(open(a)) for a in archivos]
vistos, hallazgos = set(), []
for v in vs:
    for h in v.get("hallazgos", []):
        k = (h.get("archivo"), h.get("detalle"))
        if k not in vistos:
            vistos.add(k); hallazgos.append({**h, "validador": v.get("validador")})
ok = len(vs) == 3 and all(v.get("veredicto") == "APROBADA" for v in vs) \
     and not any(h.get("severidad") == "alta" for h in hallazgos)
final = {"tarea": t, "validador": "VAL-1+2+3", "veredicto": "APROBADA" if ok else "RECHAZADA",
         "validadores_recibidos": len(vs),
         "criterios": {"total": sum(v.get("criterios", {}).get("total", 0) for v in vs),
                       "pasan": sum(v.get("criterios", {}).get("pasan", 0) for v in vs)},
         "hallazgos": hallazgos}
json.dump(final, open(f"{d}/{t}_veredicto_final.json", "w"), ensure_ascii=False, indent=2)
print(final["veredicto"], f"({len(vs)} VAL, {len(hallazgos)} hallazgos)")
PY
