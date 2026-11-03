"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { FingerPrintIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConexionRelojCard, useEstadoRelojes, type EstadoRelojApi } from "@/features/biometrico";

const ETIQUETA_ESTADO: Record<EstadoRelojApi, string> = {
  ok: "Comunicando",
  nunca_conectado: "Nunca conectado",
  app_sin_conexion: "App puente sin conexión",
  reloj_no_responde: "Reloj no responde",
  fuera_de_horario: "Hora del reloj desfasada",
};

function formatearMomento(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "medium" });
}

const PASOS = [
  "Registre el reloj en Equipos como tipo «Biométrico» con su número de serie.",
  "Escriba aquí su IP, puerto y clave de comunicación, y guarde: la app puente los toma sola.",
  "Genere la clave de la app puente (se muestra una sola vez) y péguela en la app puente del colegio.",
  "Pruebe con «Probar conexión con el reloj»: el resultado aparece en esta misma pantalla.",
  "Asigne el ID del reloj de cada docente en Plana Docente → «Código biométrico».",
  "Las marcaciones que no se puedan asignar quedan en «Marcaciones pendientes».",
];

export function TabBiometrico() {
  const { data: relojes = [], isLoading, isError } = useEstadoRelojes();

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between gap-3 border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold">Reloj biométrico ZKTeco</CardTitle>
          <CardDescription className="text-xs">
            Estado de la conexión del reloj y de la app puente con el SGA
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="h-8 text-xs font-semibold">
            <Link href="/admin/marcaciones-pendientes">Marcaciones pendientes</Link>
          </Button>
          <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
            <Link href="/admin/equipos">
              <HugeiconsIcon icon={FingerPrintIcon} className="size-3.5" />
              Gestionar relojes
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {isLoading ? (
          <Skeleton className="h-24 w-full rounded-xl" />
        ) : isError ? (
          <p className="text-muted-foreground text-sm">
            No se pudo consultar el estado de los relojes.
          </p>
        ) : relojes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Aún no hay relojes biométricos registrados. Siga los pasos de abajo.
          </p>
        ) : (
          <div className="space-y-3">
            {relojes.map((r) => (
              <div key={r.equipoId} className="border-border/40 space-y-3 rounded-xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{r.nombre}</p>
                    <p className="text-muted-foreground text-xs">{r.ubicacion}</p>
                  </div>
                  <Badge variant={r.estado === "ok" ? "default" : "destructive"}>
                    {ETIQUETA_ESTADO[r.estado]}
                  </Badge>
                </div>
                <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Última comunicación de la app</dt>
                    <dd className="font-medium">{formatearMomento(r.ultimoLatidoEn)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Último contacto con el reloj</dt>
                    <dd className="font-medium">{formatearMomento(r.relojRespondioEn)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Desfase de hora</dt>
                    <dd className="font-medium">
                      {r.desfaseMinutos === null ? "—" : `${r.desfaseMinutos} min`}
                    </dd>
                  </div>
                </dl>
                <ConexionRelojCard reloj={r} />
                {r.alertas.length > 0 && (
                  <ul className="text-warning list-disc space-y-0.5 pl-4 text-xs">
                    {r.alertas.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-muted/30 border-border/40 rounded-xl border p-4">
          <p className="mb-2 text-xs font-bold tracking-wide uppercase">Cómo conectar el reloj</p>
          <ol className="text-muted-foreground list-decimal space-y-1 pl-4 text-xs">
            {PASOS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <p className="text-muted-foreground mt-3 text-xs">
            Los tiempos (antirrebote, desfase máximo y minutos sin comunicación) se ajustan en
            «Variables y Reglas», módulo asistencia, variables <code>biometrico.*</code>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
