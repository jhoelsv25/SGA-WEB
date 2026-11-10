"use client";

import * as React from "react";
import { Task01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/formatters/date";
import { ESTADOS_COMPROMISO_CONFIG } from "../../consts";
import { useCompromisoQuery } from "../../hooks";
import type { CompromisoItem } from "../../types";

export interface ModalDetalleCompromisoProps {
  compromisoId: string | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-[11px]">{etiqueta}</span>
      <span className="text-foreground text-xs">{valor}</span>
    </div>
  );
}

function EstadoCompromiso({ item }: { item: CompromisoItem }) {
  const config = ESTADOS_COMPROMISO_CONFIG[item.estado];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
      {item.vencido && <Badge variant="destructive">Vencido</Badge>}
      {item.anulado && <Badge variant="outline">Anulado</Badge>}
    </div>
  );
}

export function ModalDetalleCompromiso({
  compromisoId,
  abierto,
  onOpenChange,
}: ModalDetalleCompromisoProps) {
  const { data, isLoading } = useCompromisoQuery(compromisoId ?? "", abierto);
  const compromiso = data?.compromiso;
  const historial = data?.historial ?? [];

  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Compromiso de mejora"
      description={compromiso ? compromiso.docenteNombre : "Cargando información..."}
      icon={Task01Icon}
      size="2xl"
    >
      {isLoading || !compromiso ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-xs">
          <Spinner className="size-4" />
          <span>Cargando compromiso...</span>
        </div>
      ) : (
        <div className="space-y-4 py-1">
          <p className="text-foreground text-sm font-medium">{compromiso.descripcion}</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Fila etiqueta="Estado" valor={<EstadoCompromiso item={compromiso} />} />
            <Fila etiqueta="Fecha de revisión" valor={formatDate(compromiso.fechaRevision)} />
            <Fila
              etiqueta="Registrado sobre"
              valor={`Consolidado versión ${compromiso.consolidadoVersion}`}
            />
            <Fila
              etiqueta="Enterado del docente"
              valor={
                compromiso.enteradoEn
                  ? formatDateTime(compromiso.enteradoEn)
                  : "Aún no marcó «Enterado»"
              }
            />
            {compromiso.cerradoEn && (
              <Fila etiqueta="Cerrado el" valor={formatDateTime(compromiso.cerradoEn)} />
            )}
            {compromiso.anuladoEn && (
              <Fila etiqueta="Anulado el" valor={formatDateTime(compromiso.anuladoEn)} />
            )}
          </div>

          {compromiso.observacionCierre && (
            <Fila etiqueta="Observación de cierre" valor={compromiso.observacionCierre} />
          )}
          {compromiso.motivoAnulacion && (
            <Fila etiqueta="Motivo de la anulación" valor={compromiso.motivoAnulacion} />
          )}

          {historial.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-foreground text-xs font-semibold">Historial de versiones</h4>
              <ul className="space-y-2">
                {historial.map((version) => (
                  <li
                    key={version.id}
                    className="border-border/60 bg-muted/20 flex flex-col gap-0.5 rounded-xl border p-3 text-xs"
                  >
                    <span className="text-foreground font-semibold">
                      Versión {version.version}
                      {version.vigente ? " (vigente)" : ""}
                    </span>
                    <span className="text-muted-foreground">
                      Revisión {formatDate(version.fechaRevision)} · registrada el{" "}
                      {formatDateTime(version.creadoEn)}
                    </span>
                    <span className="text-foreground">{version.descripcion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
