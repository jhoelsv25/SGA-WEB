"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSincronizacionesReloj } from "../hooks";

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime())
    ? "—"
    : fecha.toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" });
}

export function UltimaSincronizacionView() {
  const sincronizaciones = useSincronizacionesReloj();

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 border-b pb-4">
        <CardTitle className="text-base font-bold">Última sincronización</CardTitle>
        <CardDescription className="text-xs">
          Por reloj, según lo entregado a la base
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {sincronizaciones.isLoading ? (
          <Skeleton className="h-14 w-full rounded-xl" />
        ) : (sincronizaciones.data ?? []).length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-xs">
            Aún no hay sincronizaciones registradas.
          </p>
        ) : (
          <ul className="divide-border/40 divide-y rounded-xl border">
            {(sincronizaciones.data ?? []).map((s) => (
              <li key={s.relojSerie} className="flex flex-wrap justify-between gap-2 p-3 text-xs">
                <div>
                  <p className="text-foreground font-semibold">Reloj {s.relojSerie}</p>
                  <p className="text-muted-foreground text-[11px]">{s.equipo ?? "—"}</p>
                </div>
                <div className="text-right">
                  <p>Sincronizó: {formatearFecha(s.ultimaSincronizacion)}</p>
                  <p className="text-muted-foreground text-[11px]">
                    Última marca: {formatearFecha(s.ultimaMarca)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
