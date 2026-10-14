"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, RefreshIcon, UserRemove01Icon } from "@hugeicons/core-free-icons";
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
import { usePuedeGestionarAusencias } from "@/features/ausencias-docente/hooks";
import { RegistrarAusenciaModal } from "@/features/ausencias-docente/components/registro";
import { EstadoSesionBadge, HorasFirmadas, ModalReemplazo } from "./components";
import { usePanelSesionesHoy, usePuedeGestionarSesiones } from "./hooks";
import type { Sesion } from "./types";

export function SesionesHoyPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePanelSesionesHoy();
  const puedeGestionar = usePuedeGestionarSesiones();
  const puedeGestionarAusencias = usePuedeGestionarAusencias();
  const [aReemplazar, setAReemplazar] = React.useState<Sesion | null>(null);
  const [aRegistrarAusencia, setARegistrarAusencia] = React.useState<Sesion | null>(null);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Sesiones de hoy"
        description="Quién firmó cada sesión, a qué hora y con qué tema. Se actualiza solo cada 30 segundos."
        icon={Clock01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Sesiones de hoy" }]}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Actualizar sesiones"
            className="min-h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
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

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el panel"
      >
        {data &&
          (data.sesiones.length === 0 ? (
            <EmptyState
              title="No hay sesiones programadas hoy"
              description="Puede ser un día sin clases, vacaciones o aún no hay horarios con docente."
              icon={Clock01Icon}
            />
          ) : (
            <div className="space-y-3">
              <p role="status" className="text-sm">
                {data.sesiones.length} sesiones ·{" "}
                <span className={data.totalAlertas > 0 ? "text-destructive font-semibold" : ""}>
                  {data.totalAlertas} sin firma pasada la tolerancia
                </span>
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bloque</TableHead>
                    <TableHead>Sección y curso</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Tema</TableHead>
                    <TableHead>Firmas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.sesiones.map((s) => (
                    <TableRow key={s.id} className={s.alerta ? "bg-destructive/5" : undefined}>
                      <TableCell className="font-mono text-xs">
                        {s.horaInicio}–{s.horaFin}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{s.seccionNombre}</p>
                        <p className="text-muted-foreground text-xs">{s.cursoNombre}</p>
                      </TableCell>
                      <TableCell>
                        <p>{s.docenteNombre}</p>
                        {s.docenteTitularNombre && (
                          <p className="text-muted-foreground text-xs">
                            Reemplaza a {s.docenteTitularNombre}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="max-w-56 text-sm">{s.tema ?? "—"}</TableCell>
                      <TableCell>
                        <HorasFirmadas sesion={s} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          <EstadoSesionBadge sesion={s} />
                          {s.alerta && (
                            <StatusBadge tone="danger" size="sm">
                              Sin firma
                            </StatusBadge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {puedeGestionar && s.estado === "pendiente" && (
                            <Button
                              type="button"
                              variant="outline"
                              className="min-h-10"
                              onClick={() => setAReemplazar(s)}
                            >
                              Reemplazo
                            </Button>
                          )}
                          {puedeGestionarAusencias &&
                            (Boolean(s.horaIngreso) || s.estado === "en_curso") && (
                              <Button
                                type="button"
                                variant="outline"
                                className="min-h-10 gap-1.5"
                                onClick={() => setARegistrarAusencia(s)}
                              >
                                <HugeiconsIcon
                                  icon={UserRemove01Icon}
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                                <span>Registrar ausencia</span>
                              </Button>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
      </PageState>

      <ModalReemplazo
        sesion={aReemplazar}
        onOpenChange={(abierto) => !abierto && setAReemplazar(null)}
      />

      <RegistrarAusenciaModal
        sesion={aRegistrarAusencia}
        open={Boolean(aRegistrarAusencia)}
        onOpenChange={(abierto) => !abierto && setARegistrarAusencia(null)}
      />
    </div>
  );
}
