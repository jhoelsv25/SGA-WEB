import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  numero: string;
  titulo: string;
  /** Una frase en lenguaje sencillo que dice qué se escribe aquí. */
  ayuda: string;
  listo?: boolean;
  opcional?: boolean;
  children: React.ReactNode;
}

/** Cada parte de la sesión se ve como en la plantilla del colegio, con su número y título. */
export function TarjetaSeccion({ id, numero, titulo, ayuda, listo, opcional, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="border-border/80 bg-card scroll-mt-24 space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6"
    >
      <header className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            listo ? "bg-success text-white" : "bg-primary/10 text-primary",
          )}
        >
          {listo ? "✓" : numero}
        </span>
        <div className="space-y-0.5">
          <h2 id={`${id}-titulo`} className="text-lg font-semibold">
            {titulo}
            {opcional && (
              <span className="text-muted-foreground ml-2 text-xs font-normal">(opcional)</span>
            )}
          </h2>
          <p className="text-muted-foreground text-sm">{ayuda}</p>
        </div>
      </header>
      {children}
    </section>
  );
}
