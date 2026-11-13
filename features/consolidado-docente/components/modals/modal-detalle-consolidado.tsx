"use client";

import * as React from "react";
import { Download01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DataTable } from "@/components/common/data-table";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResumenObservacionConsolidado } from "@/features/observaciones-aula/components/resumen-consolidado";
import { toast } from "@/lib/toast";
import { descargarFichaPdf } from "../../api";
import { DECISIONES_CONSOLIDADO_CONFIG, ESTADOS_CONSOLIDADO_CONFIG } from "../../consts";
import { useCompromisosQuery, useDetalleConsolidadoQuery } from "../../hooks";
import type { ConsolidadoResumenItem } from "../../types";
import { CompromisosPanel } from "../compromisos";
import { HorasPedagogicasCards } from "../metricas/horas-pedagogicas-cards";
import {
  getDetalleAusenciasColumns,
  getDetalleSesionesColumns,
  type DetalleAusenciaFila,
} from "../../views/columns";

export interface ModalDetalleConsolidadoProps {
  consolidadoId: string | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  onAbrirDecision?: (consolidado: ConsolidadoResumenItem) => void;
  onAbrirReabrir?: (consolidado: ConsolidadoResumenItem) => void;
  onAbrirCerrar?: (consolidado: ConsolidadoResumenItem) => void;
  esDirectorOAdmin?: boolean;
  /** Pestaña con la que se abre; los enlaces de pendientes abren «compromisos». */
  pestanaInicial?: PestanaDetalle;
  /** Compromiso cuyo detalle se abre al llegar desde un enlace de pendientes. */
  compromisoIdInicial?: string | null;
}

export type PestanaDetalle = "sesiones" | "ausencias" | "compromisos";

export function ModalDetalleConsolidado({
  consolidadoId,
  abierto,
  onOpenChange,
  onAbrirDecision,
  onAbrirReabrir,
  onAbrirCerrar,
  esDirectorOAdmin = false,
  pestanaInicial = "sesiones",
  compromisoIdInicial = null,
}: ModalDetalleConsolidadoProps) {
  const [descargandoPdf, setDescargandoPdf] = React.useState(false);
  const [pestana, setPestana] = React.useState<PestanaDetalle>(pestanaInicial);

  const { data, isLoading } = useDetalleConsolidadoQuery(
    consolidadoId ?? "",
    abierto && Boolean(consolidadoId),
  );

  const { data: compromisos = [] } = useCompromisosQuery(
    consolidadoId ?? "",
    abierto && Boolean(consolidadoId),
  );

  const consolidado = data?.consolidado;
  const sesiones = React.useMemo(() => data?.sesiones ?? [], [data?.sesiones]);

  const todasLasAusencias = React.useMemo<DetalleAusenciaFila[]>(() => {
    return sesiones.flatMap((s) =>
      s.ausencias.map((a) => ({
        ...a,
        sesionFecha: s.fecha,
        cursoNombre: s.cursoNombre,
        seccionNombre: s.seccionNombre,
      })),
    );
  }, [sesiones]);

  const sesionesColumns = React.useMemo(() => getDetalleSesionesColumns(), []);
  const ausenciasColumns = React.useMemo(() => getDetalleAusenciasColumns(), []);

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

          <HorasPedagogicasCards consolidado={consolidado} />

          <ResumenObservacionConsolidado
            docenteId={consolidado.docenteId}
            periodoId={consolidado.periodoId}
          />

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
            <Button
              variant={pestana === "compromisos" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPestana("compromisos")}
              className="h-8 text-xs"
            >
              Compromisos ({compromisos.length})
            </Button>
          </div>

          {pestana === "sesiones" ? (
            <DataTable
              columns={sesionesColumns}
              data={sesiones}
              pagination={false}
              caption="Registro de sesiones de clase del bimestre"
              emptyMessage="No hay sesiones registradas en este periodo."
            />
          ) : pestana === "compromisos" ? (
            <CompromisosPanel
              consolidado={consolidado}
              puedeGestionar={esDirectorOAdmin}
              compromisoIdInicial={compromisoIdInicial}
            />
          ) : (
            <DataTable
              columns={ausenciasColumns}
              data={todasLasAusencias}
              pagination={false}
              caption="Registro de ausencias e incidencias del bimestre"
              emptyMessage="No se registraron ausencias en el periodo."
            />
          )}
        </div>
      )}
    </Modal>
  );
}
