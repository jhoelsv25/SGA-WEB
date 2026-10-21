"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTurnosQuery } from "@/features/turnos";

export function TabTurnos() {
  const { data: turnos = [], isLoading } = useTurnosQuery();

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold">Jornadas y Turnos Escolares</CardTitle>
          <CardDescription className="text-xs">
            Horarios oficiales de entrada, salida y ventanas de marcado por turno en BD
          </CardDescription>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
          <Link href="/admin/turnos">
            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
            Configurar Turnos
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        ) : turnos.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-xs">
            <p>No hay turnos registrados en la base de datos actualmente.</p>
            <Button asChild variant="link" size="sm" className="mt-2 text-xs">
              <Link href="/admin/turnos">Registrar turno</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {turnos.map((t) => (
              <div
                key={t.id}
                className="bg-muted/30 border-border/50 space-y-2 rounded-xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-sm font-bold capitalize">
                    Turno {t.tipoPersona}
                  </span>
                  <Badge
                    variant={t.activo ? "outline" : "secondary"}
                    className={
                      t.activo
                        ? "border-emerald-500/40 text-[10px] text-emerald-600"
                        : "text-[10px]"
                    }
                  >
                    {t.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p className="flex justify-between">
                    <span>Entrada oficial:</span>
                    <strong className="text-foreground font-mono">{t.horaEntrada}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Tolerancia máxima:</span>
                    <strong className="text-foreground font-mono">{t.toleranciaMinutos} min</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Ventana de entrada:</span>
                    <span className="text-foreground font-mono text-[11px]">
                      {t.ventanaEntradaInicio} - {t.ventanaEntradaFin}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Salida oficial:</span>
                    <strong className="text-foreground font-mono">{t.horaSalida}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Ventana de salida:</span>
                    <span className="text-foreground font-mono text-[11px]">
                      {t.ventanaSalidaInicio} - {t.ventanaSalidaFin}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
