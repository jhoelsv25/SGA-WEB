"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FingerPrintIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertasRelojes, AsignarPendienteModal, DescartarPendienteModal } from "./components";
import { MOTIVOS_PENDIENTE_LABEL } from "./consts";
import { usePendientesQuery } from "./hooks";
import type { EstadoPendienteApi, PendienteApi } from "./types";

const PESTANAS: { id: EstadoPendienteApi; label: string }[] = [
  { id: "pendiente", label: "Por resolver" },
  { id: "asignada", label: "Asignadas" },
  { id: "descartada", label: "Descartadas" },
];

function formatearFechaHora(fechaHora: string): string {
  const [fecha, hora] = fechaHora.split(" ");
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio} ${hora?.slice(0, 5) ?? ""}`;
}

export function MarcacionesPendientesPage() {
  const [estado, setEstado] = React.useState<EstadoPendienteApi>("pendiente");
  const { data, isLoading, isError, error, refetch, isFetching } = usePendientesQuery(estado);
  const [aAsignar, setAAsignar] = React.useState<PendienteApi | null>(null);
  const [aDescartar, setADescartar] = React.useState<PendienteApi | null>(null);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Marcaciones pendientes"
        description="Marcaciones del reloj biométrico que el sistema no pudo asignar a un docente activo."
        icon={FingerPrintIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Marcaciones pendientes" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Actualizar pendientes"
            className="h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        }
      />

      <AlertasRelojes />

      <div
        role="tablist"
        aria-label="Estado de las marcaciones"
        className="bg-muted/60 inline-flex w-fit rounded-xl p-1 text-sm"
      >
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={estado === p.id}
            onClick={() => setEstado(p.id)}
            className={`min-h-10 rounded-lg px-4 font-semibold transition-all ${
              estado === p.id
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar las marcaciones pendientes"
      >
        {data && data.length === 0 ? (
          <EmptyState
            title={
              estado === "pendiente" ? "No hay marcaciones por resolver" : "No hay marcaciones aquí"
            }
            description="Las marcaciones del reloj que no se puedan asignar aparecerán en esta lista."
            icon={FingerPrintIcon}
          />
        ) : (
          data && (
            <div className="border-border/60 overflow-x-auto rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y hora</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Reloj</TableHead>
                    <TableHead>Motivo</TableHead>
                    {estado === "descartada" && <TableHead>Motivo del descarte</TableHead>}
                    {estado === "pendiente" && (
                      <TableHead className="text-right">Acciones</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="tabular-nums">
                        {formatearFechaHora(p.fechaHora)}
                      </TableCell>
                      <TableCell className="font-mono">{p.codigoBiometrico}</TableCell>
                      <TableCell>{p.equipoNombre ?? "—"}</TableCell>
                      <TableCell>
                        <StatusBadge tone="warning">
                          {MOTIVOS_PENDIENTE_LABEL[p.motivo]}
                        </StatusBadge>
                      </TableCell>
                      {estado === "descartada" && <TableCell>{p.motivoDescarte ?? "—"}</TableCell>}
                      {estado === "pendiente" && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              className="min-h-9"
                              onClick={() => setAAsignar(p)}
                            >
                              Asignar
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="min-h-9"
                              onClick={() => setADescartar(p)}
                            >
                              Descartar
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        )}
      </PageState>

      <AsignarPendienteModal
        pendiente={aAsignar}
        onOpenChange={(abierto) => !abierto && setAAsignar(null)}
      />
      <DescartarPendienteModal
        pendiente={aDescartar}
        onOpenChange={(abierto) => !abierto && setADescartar(null)}
      />
    </div>
  );
}
