"use client";

import * as React from "react";
import { Download01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/lib/toast";
import { descargarFichaPdf } from "../../api";
import { DECISIONES_CONSOLIDADO_CONFIG, ESTADOS_CONSOLIDADO_CONFIG } from "../../consts";
import { useDetalleConsolidadoQuery } from "../../hooks";
import type { ConsolidadoResumenItem } from "../../types";

export interface ModalDetalleConsolidadoProps {
  consolidadoId: string | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  onAbrirDecision?: (consolidado: ConsolidadoResumenItem) => void;
  onAbrirReabrir?: (consolidado: ConsolidadoResumenItem) => void;
  onAbrirCerrar?: (consolidado: ConsolidadoResumenItem) => void;
  esDirectorOAdmin?: boolean;
}

export function ModalDetalleConsolidado({
  consolidadoId,
  abierto,
  onOpenChange,
  onAbrirDecision,
  onAbrirReabrir,
  onAbrirCerrar,
  esDirectorOAdmin = false,
}: ModalDetalleConsolidadoProps) {
  const [descargandoPdf, setDescargandoPdf] = React.useState(false);
  const [pestana, setPestana] = React.useState<"sesiones" | "ausencias">("sesiones");

  const { data, isLoading } = useDetalleConsolidadoQuery(
    consolidadoId ?? "",
    abierto && Boolean(consolidadoId),
  );

  const consolidado = data?.consolidado;
  const sesiones = React.useMemo(() => data?.sesiones ?? [], [data?.sesiones]);

  const todasLasAusencias = React.useMemo(() => {
    return sesiones.flatMap((s) =>
      s.ausencias.map((a) => ({
        ...a,
        sesionFecha: s.fecha,
        cursoNombre: s.cursoNombre,
        seccionNombre: s.seccionNombre,
      })),
    );
  }, [sesiones]);

  const handleDescargarPdf = async () => {
    if (!consolidadoId) return;
    try {
      setDescargandoPdf(true);
      await descargarFichaPdf(consolidadoId);
      toast.success("Ficha de seguimiento descargada correctamente.");
    } catch {
      toast.error("Error al descargar el PDF de la ficha de seguimiento.");
    } finally {
      setDescargandoPdf(false);
    }
  };

  const footerActions = consolidado ? (
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <Button
        variant="outline"
        onClick={handleDescargarPdf}
        disabled={descargandoPdf}
        className="gap-1.5"
      >
        {descargandoPdf ? (
          <Spinner className="size-3.5" />
        ) : (
          <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
        )}
        <span>Descargar PDF</span>
      </Button>

      {esDirectorOAdmin && (
        <div className="flex items-center gap-2">
          {onAbrirDecision && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onAbrirDecision(consolidado);
              }}
            >
              Registrar Decisión
            </Button>
          )}

          {consolidado.estado === "cerrado" && onAbrirReabrir && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onAbrirReabrir(consolidado);
              }}
            >
              Reabrir
            </Button>
          )}

          {consolidado.estado !== "cerrado" && onAbrirCerrar && (
            <Button
              variant="default"
              onClick={() => {
                onOpenChange(false);
                onAbrirCerrar(consolidado);
              }}
            >
              Cerrar Consolidado
            </Button>
          )}
        </div>
      )}
    </div>
  ) : null;

  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title={
        consolidado
          ? `Ficha de Seguimiento Docente — ${consolidado.docenteNombre}`
          : "Detalle de Consolidado"
      }
      description={
        consolidado
          ? `${consolidado.periodoNombre} · DNI: ${consolidado.docenteDni} · Versión ${consolidado.version}`
          : "Cargando información..."
      }
      icon={ViewIcon}
      size="4xl"
      footer={footerActions}
    >
      {isLoading ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12">
          <Spinner className="size-6" />
          <p className="text-xs">Cargando detalle de sesiones y ausencias...</p>
        </div>
      ) : !consolidado ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No se encontró la información del consolidado.
        </div>
      ) : (
        <div className="space-y-4 py-1">
          {/* Tarjetas de indicadores */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div className="border-border/60 bg-muted/20 rounded-xl border p-3">
              <span className="text-muted-foreground block">Cumplimiento</span>
              <span className="text-foreground font-mono text-base font-bold">
                {consolidado.sesionesProgramadas > 0
                  ? Math.round(
                      ((consolidado.sesionesCumplidas + consolidado.sesionesJustificadas) /
                        consolidado.sesionesProgramadas) *
                        100,
                    )
                  : 0}
                %
              </span>
              <span className="text-muted-foreground block text-[11px]">
                {consolidado.sesionesCumplidas}/{consolidado.sesionesProgramadas} sesiones
              </span>
            </div>

            <div className="border-border/60 bg-muted/20 rounded-xl border p-3">
              <span className="text-muted-foreground block">Tiempo fuera de aula</span>
              <span className="text-foreground font-mono text-base font-bold">
                {consolidado.tiempoTotalFueraTexto}
              </span>
              <span className="text-muted-foreground block text-[11px]">
                {consolidado.totalAusencias} incidencias registradas
              </span>
            </div>

            <div className="border-border/60 bg-muted/20 rounded-xl border p-3">
              <span className="text-muted-foreground block">Estado</span>
              <div className="mt-1">
                <Badge
                  variant={ESTADOS_CONSOLIDADO_CONFIG[consolidado.estado]?.variant ?? "default"}
                  className={ESTADOS_CONSOLIDADO_CONFIG[consolidado.estado]?.className}
                >
                  {ESTADOS_CONSOLIDADO_CONFIG[consolidado.estado]?.label ?? consolidado.estado}
                </Badge>
              </div>
            </div>

            <div className="border-border/60 bg-muted/20 rounded-xl border p-3">
              <span className="text-muted-foreground block">Decisión Directiva</span>
              <div className="mt-1">
                <Badge
                  variant={
                    DECISIONES_CONSOLIDADO_CONFIG[consolidado.decision]?.variant ?? "outline"
                  }
                  className={DECISIONES_CONSOLIDADO_CONFIG[consolidado.decision]?.className}
                >
                  {DECISIONES_CONSOLIDADO_CONFIG[consolidado.decision]?.label ??
                    consolidado.decision}
                </Badge>
              </div>
            </div>
          </div>

          {/* Observaciones del Director */}
          {consolidado.observacion && (
            <div className="border-border/60 bg-muted/30 rounded-xl border p-3 text-xs">
              <span className="text-foreground mb-0.5 block font-semibold">
                Observaciones del Director:
              </span>
              <p className="text-muted-foreground">{consolidado.observacion}</p>
            </div>
          )}

          {/* Selector de pestañas */}
          <div className="border-border/60 flex gap-2 border-b pb-2">
            <Button
              variant={pestana === "sesiones" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPestana("sesiones")}
              className="h-8 text-xs"
            >
              Sesiones ({sesiones.length})
            </Button>
            <Button
              variant={pestana === "ausencias" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPestana("ausencias")}
              className="h-8 text-xs"
            >
              Ausencias e Incidencias ({todasLasAusencias.length})
            </Button>
          </div>

          {pestana === "sesiones" ? (
            <div className="border-border/60 overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Curso / Grado / Sección</TableHead>
                    <TableHead>Tema</TableHead>
                    <TableHead>Ingreso</TableHead>
                    <TableHead>Salida</TableHead>
                    <TableHead>Min. Perdidos</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sesiones.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-muted-foreground py-6 text-center text-xs"
                      >
                        No hay sesiones registradas en este periodo.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sesiones.map((s) => (
                      <TableRow key={s.sesionId}>
                        <TableCell className="font-mono text-xs">{s.fecha}</TableCell>
                        <TableCell className="text-xs">
                          {s.cursoNombre} — {s.gradoNombre} &ldquo;{s.seccionNombre}&rdquo;
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-xs" title={s.tema ?? ""}>
                          {s.tema || "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {s.horaIngresoFirmada || "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {s.horaSalidaFirmada || "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{s.minutosPerdidos} min</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {s.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border-border/60 overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha Sesión</TableHead>
                    <TableHead>Curso / Sección</TableHead>
                    <TableHead>Tramo Horario</TableHead>
                    <TableHead>Minutos</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Descargo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todasLasAusencias.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-muted-foreground py-6 text-center text-xs"
                      >
                        No se registraron ausencias en el periodo.
                      </TableCell>
                    </TableRow>
                  ) : (
                    todasLasAusencias.map((a) => (
                      <TableRow
                        key={a.ausenciaId}
                        className={a.anulada ? "line-through opacity-50" : ""}
                      >
                        <TableCell className="font-mono text-xs">{a.sesionFecha}</TableCell>
                        <TableCell className="text-xs">
                          {a.cursoNombre} ({a.seccionNombre})
                        </TableCell>
                        <TableCell className="font-mono text-xs">{a.tramoHorario}</TableCell>
                        <TableCell className="font-mono text-xs">{a.minutos} min</TableCell>
                        <TableCell className="text-xs">{a.motivo}</TableCell>
                        <TableCell className="max-w-xs truncate text-xs" title={a.descargo ?? ""}>
                          {a.descargo || "—"}
                        </TableCell>
                        <TableCell>
                          {a.anulada ? (
                            <Badge variant="destructive" className="text-[10px]">
                              Anulada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px]">
                              Efectiva
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
