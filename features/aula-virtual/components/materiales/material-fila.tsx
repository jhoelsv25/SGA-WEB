"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  CloudUploadIcon,
  Delete02Icon,
  FileEditIcon,
} from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { urlDeArchivo } from "../../api";
import { PLAZO_CONFIG } from "../../consts";
import type { Material } from "../../types";

export interface MaterialFilaProps {
  material: Material;
  puedeAdministrar: boolean;
  onPublicar: (material: Material) => void;
  onEditar?: (material: Material) => void;
  onSolicitarCambio: (material: Material) => void;
  onRetirar: (material: Material) => void;
  onVerActividad?: (material: Material) => void;
  onRegistrarVisualizacion?: (material: Material, accion: "visualizo" | "descargo") => void;
}

export function MaterialFila({
  material,
  puedeAdministrar,
  onPublicar,
  onEditar,
  onSolicitarCambio,
  onRetirar,
  onVerActividad,
  onRegistrarVisualizacion,
}: MaterialFilaProps) {
  const plazo = material.plazo ? PLAZO_CONFIG[material.plazo] : null;
  const ultimoCambio =
    material.cambiosDeFecha.length > 0
      ? material.cambiosDeFecha[material.cambiosDeFecha.length - 1]
      : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{material.titulo}</p>
          {material.esExtra && <StatusBadge tone="brand">Extra</StatusBadge>}
          {plazo && <StatusBadge tone={plazo.tone}>{plazo.label}</StatusBadge>}
          {puedeAdministrar && !material.visible && (
            <StatusBadge tone="neutral">Oculto</StatusBadge>
          )}
          {material.solicitudAbierta && (
            <StatusBadge tone="warning">Solicitud pendiente</StatusBadge>
          )}
          {!material.solicitudAbierta && ultimoCambio?.estado === "aprobada" && (
            <StatusBadge tone="success">Cambio de fecha aprobado</StatusBadge>
          )}
          {!material.solicitudAbierta && ultimoCambio?.estado === "rechazada" && (
            <StatusBadge tone="danger">Cambio de fecha rechazado</StatusBadge>
          )}
        </div>
        {material.descripcion && (
          <p className="text-muted-foreground text-xs">{material.descripcion}</p>
        )}
        <p className="text-muted-foreground text-xs">
          {material.fechaProgramada && `Programado: ${formatDate(material.fechaProgramada)}`}
          {material.publicadoEn && ` · Publicado: ${formatDate(material.publicadoEn)}`}
          {material.sesionClase?.fecha && ` · Clase: ${formatDate(material.sesionClase.fecha)}`}
        </p>
        {puedeAdministrar && ultimoCambio && (
          <p className="text-muted-foreground text-[11px]">
            Historial de fecha: {formatDate(ultimoCambio.fechaAnterior)} →{" "}
            {formatDate(ultimoCambio.fechaSolicitada)} ({ultimoCambio.estado})
            {ultimoCambio.respuesta ? ` · Respuesta: ${ultimoCambio.respuesta}` : ""}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {material.url && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="min-h-9"
            onClick={() =>
              onRegistrarVisualizacion?.(
                material,
                material.tipo === "enlace" ? "visualizo" : "descargo",
              )
            }
          >
            <Link href={urlDeArchivo(material.url)} target="_blank" rel="noreferrer">
              {material.tipo === "enlace" ? "Abrir enlace" : "Ver"}
            </Link>
          </Button>
        )}
        {puedeAdministrar && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => onVerActividad?.(material)}
          >
            <HugeiconsIcon icon={Activity01Icon} size={16} />
            Actividad
          </Button>
        )}
        {puedeAdministrar && onEditar && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => onEditar(material)}
          >
            <HugeiconsIcon icon={FileEditIcon} size={16} />
            Editar
          </Button>
        )}
        {puedeAdministrar && !material.publicadoEn && (
          <Button
            type="button"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => onPublicar(material)}
          >
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Publicar
          </Button>
        )}
        {puedeAdministrar && material.publicadoEn && material.vigente && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => onPublicar(material)}
          >
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Reemplazar
          </Button>
        )}
        {puedeAdministrar &&
          material.esPlanificado &&
          material.fechaCongelada &&
          !material.solicitudAbierta && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-9 gap-1.5"
              onClick={() => onSolicitarCambio(material)}
            >
              <HugeiconsIcon icon={FileEditIcon} size={16} />
              Cambiar fecha
            </Button>
          )}
        {puedeAdministrar && material.publicadoEn && material.vigente && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive min-h-9 gap-1.5"
            onClick={() => onRetirar(material)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Retirar
          </Button>
        )}
      </div>
    </div>
  );
}
