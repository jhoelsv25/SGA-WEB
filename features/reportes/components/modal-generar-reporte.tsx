"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Pdf01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import type { AnioAcademico } from "@/features/anio-escolar/types";
import type { Seccion } from "@/features/secciones/types";
import type { ReporteCatalogoItem } from "../constants";
import { useModalGenerarReporte } from "../hooks";
import type { GradoOpcionReporte, SolicitarReportePayload } from "../types";
import { ModalReporteFiltros } from "./modal-reporte-filtros";

interface ModalGenerarReporteProps {
  reporte: ReporteCatalogoItem | null;
  onClose: () => void;
  anio: AnioAcademico | null;
  grados: GradoOpcionReporte[];
  secciones: Seccion[];
  encolando: boolean;
  descargandoKey: string | null;
  onEncolar: (payload: SolicitarReportePayload) => void;
  onDescargarDirecto: (key: string, fn: () => Promise<string>) => Promise<boolean>;
}

export function ModalGenerarReporte({
  reporte,
  onClose,
  anio,
  grados,
  secciones,
  encolando,
  descargandoKey,
  onEncolar,
  onDescargarDirecto,
}: ModalGenerarReporteProps) {
  const modal = useModalGenerarReporte({
    reporte,
    anio,
    grados,
    secciones,
    onEncolar,
    onDescargarDirecto,
    onClose,
  });

  if (!reporte) return null;

  const ocupado = encolando || descargandoKey !== null;

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={reporte.titulo}
      description={reporte.descripcion}
      icon={reporte.icono}
      size="lg"
    >
      <div className="space-y-5">
        <div className="bg-muted/30 border-border/60 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs">
          <span className="text-muted-foreground">
            Año lectivo activo: <strong className="text-foreground">{anio?.anio ?? "—"}</strong>
          </span>
          {reporte.asincrono ? (
            <StatusBadge tone="info">Se prepara en segundo plano</StatusBadge>
          ) : (
            <StatusBadge tone="neutral">Descarga inmediata</StatusBadge>
          )}
        </div>

        <ModalReporteFiltros
          cfg={modal.cfg}
          sinFiltros={modal.sinFiltros}
          anioNumero={anio?.anio}
          cargandoCursos={modal.cargandoCursos}
          valores={modal.valores}
          opciones={modal.opciones}
          acciones={modal.acciones}
        />

        <div className="border-border/50 flex flex-wrap items-center justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={ocupado}
            className="rounded-full px-4"
          >
            Cancelar
          </Button>
          {reporte.formatos.map((fmt, idx) => (
            <Button
              key={fmt}
              type="button"
              size="sm"
              variant={idx === 0 ? "default" : "outline"}
              disabled={ocupado || modal.faltaRequerido}
              onClick={() => void modal.ejecutar(fmt)}
              className="gap-1.5 rounded-full px-5"
            >
              <HugeiconsIcon icon={fmt === "pdf" ? Pdf01Icon : Download01Icon} className="size-4" />
              {ocupado
                ? "Procesando..."
                : reporte.asincrono
                  ? `Generar ${fmt === "pdf" ? "PDF" : "Excel"}`
                  : `Descargar ${fmt === "pdf" ? "PDF" : "Excel"}`}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
