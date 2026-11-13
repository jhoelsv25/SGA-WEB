import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { esTextoPendiente } from "../utils";
import type { Calificacion } from "../types";

/** Un nivel con su descripción; si el texto oficial aún no se cargó, lo dice (P-80). */
export function DescripcionNivel({ descripcion }: { descripcion: string | null | undefined }) {
  if (esTextoPendiente(descripcion)) {
    return (
      <p className="text-muted-foreground text-xs italic">
        Descripción oficial del nivel pendiente de cargar.
      </p>
    );
  }
  return <p className="text-muted-foreground text-xs">{descripcion}</p>;
}

/** Los cinco niveles de la observación, sin nota global (RF-023). */
export function ResumenNiveles({
  calificaciones,
  onCorregir,
}: {
  calificaciones: Calificacion[];
  /** Si se pasa, muestra «Corregir» en cada desempeño (solo Director o Administrador). */
  onCorregir?: (calificacion: Calificacion) => void;
}) {
  if (calificaciones.length === 0) return null;
  const ordenadas = [...calificaciones].sort((a, b) => a.desempeno - b.desempeno);
  return (
    <ul className="space-y-3">
      {ordenadas.map((c) => (
        <li
          key={c.desempeno}
          className="border-border/70 bg-card space-y-1.5 rounded-xl border p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">
              Desempeño {c.desempeno}
              {c.desempenoNombre ? `: ${c.desempenoNombre}` : ""}
            </p>
            <StatusBadge tone={c.grupo === "satisfactorio" ? "success" : "warning"}>
              Nivel {c.nivelRomano} · {c.nivelNombre}
            </StatusBadge>
          </div>
          <DescripcionNivel descripcion={c.descripcionNivel} />
          <p className="text-sm">
            <span className="text-muted-foreground">Fundamento: </span>
            {c.fundamento}
          </p>
          {c.version > 1 && (
            <p className="text-muted-foreground text-xs">Versión {c.version} (corregida)</p>
          )}
          {onCorregir && (
            <Button
              type="button"
              variant="ghost"
              className="min-h-10 text-xs"
              onClick={() => onCorregir(c)}
            >
              Corregir
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
