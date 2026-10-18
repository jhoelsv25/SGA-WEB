import type { Persona } from "../types/personas.types";

/** Resumen de la persona del padrón elegida en el buscador, mostrado sobre la ficha. */
export function PersonaVinculadaCard({ persona }: { persona: Persona }) {
  return (
    <div className="border-primary/30 bg-primary/5 space-y-0.5 rounded-xl border p-3.5 text-xs">
      <span className="text-primary block text-[11px] font-semibold">
        Persona vinculada del padrón
      </span>
      <p className="text-foreground text-sm font-medium">{persona.nombreCompleto}</p>
      <p className="text-muted-foreground font-mono text-xs">
        {persona.tipoDocumento.toUpperCase()}: {persona.numeroDocumento}
      </p>
    </div>
  );
}
