import type { PersonaPendiente } from "../types";

export function ListaFaltan({ pendientes }: { pendientes: PersonaPendiente[] }) {
  return (
    <ul className="divide-border/60 divide-y" aria-label="Personas que aún no marcan">
      {pendientes.map((p) => (
        <li key={p.personaId} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <span className="font-medium">{p.nombreCompleto}</span>
          {p.detalle && <span className="text-muted-foreground text-xs">{p.detalle}</span>}
        </li>
      ))}
    </ul>
  );
}
