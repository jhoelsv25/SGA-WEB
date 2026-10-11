"use client";

import * as React from "react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
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
import { formatDate } from "@/lib/formatters/date";
import { ResolverSolicitudModal } from "./components";
import { SOLICITUD_CONFIG } from "./consts";
import { useSolicitudes } from "./hooks";
import type { SolicitudCambio } from "./types";

export function SolicitudesCambioFechaPage() {
  const { data: solicitudes = [], isLoading, isError, error, refetch } = useSolicitudes();
  const [enResolucion, setEnResolucion] = React.useState<{
    solicitud: SolicitudCambio;
    accion: "aprobar" | "rechazar";
  } | null>(null);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Solicitudes de cambio de fecha"
        description="Pedidos de los docentes para mover la fecha de un material congelado."
        icon={FileEditIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Solicitudes de cambio de fecha" },
        ]}
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar las solicitudes"
        isEmpty={solicitudes.length === 0}
        empty={{
          title: "No hay solicitudes pendientes",
          description: "Las solicitudes de los docentes aparecerán aquí.",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Docente</TableHead>
              <TableHead>Fecha anterior</TableHead>
              <TableHead>Nueva fecha</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitudes.map((solicitud) => {
              const estado = SOLICITUD_CONFIG[solicitud.estado];
              return (
                <TableRow key={solicitud.id}>
                  <TableCell className="font-medium">{solicitud.materialTitulo}</TableCell>
                  <TableCell>
                    {solicitud.cursoNombre} · {solicitud.seccionNombre}
                  </TableCell>
                  <TableCell>{solicitud.docenteNombre}</TableCell>
                  <TableCell>{formatDate(solicitud.fechaAnterior)}</TableCell>
                  <TableCell>{formatDate(solicitud.fechaSolicitada)}</TableCell>
                  <TableCell className="max-w-56 truncate">{solicitud.motivo}</TableCell>
                  <TableCell>
                    <StatusBadge tone={estado.tone}>{estado.label}</StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    {solicitud.estado === "solicitada" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="min-h-9"
                          onClick={() => setEnResolucion({ solicitud, accion: "rechazar" })}
                        >
                          Rechazar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="min-h-9"
                          onClick={() => setEnResolucion({ solicitud, accion: "aprobar" })}
                        >
                          Aprobar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </PageState>

      <ResolverSolicitudModal
        solicitud={enResolucion?.solicitud ?? null}
        accion={enResolucion?.accion ?? null}
        onOpenChange={(abierto) => !abierto && setEnResolucion(null)}
      />
    </div>
  );
}
