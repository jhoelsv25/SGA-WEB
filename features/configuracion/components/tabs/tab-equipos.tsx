"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ComputerIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEquiposQuery } from "@/features/equipos";

export function TabEquipos() {
  const { data: equipos = [], isLoading } = useEquiposQuery();

  const totalAutorizados = React.useMemo(
    () => equipos.filter((e) => e.autorizado || e.tokenAutorizado).length,
    [equipos],
  );

  const totalActivos = React.useMemo(() => equipos.filter((e) => e.activo).length, [equipos]);

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold">Control de Equipos y Terminales</CardTitle>
          <CardDescription className="text-xs">
            Dispositivos habilitados en la base de datos para kioskos y marcación
          </CardDescription>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
          <Link href="/admin/equipos">
            <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
            Gestionar Equipos
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="bg-muted/30 border-border/40 rounded-xl border p-3 text-center">
                <span className="text-muted-foreground block text-[11px]">Total Equipos</span>
                <strong className="text-foreground text-lg font-bold">{equipos.length}</strong>
              </div>
              <div className="bg-muted/30 border-border/40 rounded-xl border p-3 text-center">
                <span className="text-muted-foreground block text-[11px]">Autorizados</span>
                <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {totalAutorizados}
                </strong>
              </div>
              <div className="bg-muted/30 border-border/40 col-span-2 rounded-xl border p-3 text-center sm:col-span-1">
                <span className="text-muted-foreground block text-[11px]">Activos</span>
                <strong className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {totalActivos}
                </strong>
              </div>
            </div>

            {equipos.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center text-xs">
                <p>No hay equipos registrados en la red actualmente.</p>
              </div>
            ) : (
              <div className="divide-border/40 divide-y rounded-xl border">
                {equipos.slice(0, 5).map((eq) => (
                  <div key={eq.id} className="flex items-center justify-between p-3 text-xs">
                    <div>
                      <p className="text-foreground font-semibold">{eq.nombre}</p>
                      <p className="text-muted-foreground text-[11px]">
                        {eq.tipo} · {eq.ubicacion}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {eq.autorizado || eq.tokenAutorizado ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 text-[10px] text-emerald-600"
                        >
                          Autorizado
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] text-amber-600">
                          No autorizado
                        </Badge>
                      )}
                      <Badge variant={eq.activo ? "default" : "secondary"} className="text-[10px]">
                        {eq.activo ? "En línea" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
