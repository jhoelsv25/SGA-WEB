"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  CloudUploadIcon,
  Delete02Icon,
  Download01Icon,
  File01Icon,
  FileEditIcon,
  Image01Icon,
  Link01Icon,
  Presentation01Icon,
  Table01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { urlDeArchivo } from "../../api";
import { PLAZO_CONFIG } from "../../consts";
import type { Material, TipoMaterial } from "../../types";

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

function obtenerConfigTipo(tipo: TipoMaterial) {
  switch (tipo) {
    case "documento":
      return {
        icon: File01Icon,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        label: "Documento",
      };
    case "presentacion":
      return {
        icon: Presentation01Icon,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        label: "Presentación",
      };
    case "hoja_calculo":
      return {
        icon: Table01Icon,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        label: "Hoja de cálculo",
      };
    case "video":
      return {
        icon: Video01Icon,
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        label: "Video",
      };
    case "enlace":
      return {
        icon: Link01Icon,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        label: "Enlace web",
      };
    case "imagen":
      return {
        icon: Image01Icon,
        color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
        label: "Imagen",
      };
    default:
      return {
        icon: File01Icon,
        color: "bg-primary/10 text-primary border-primary/20",
        label: "Archivo",
      };
  }
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
  const configTipo = obtenerConfigTipo(material.tipo);
  const ultimoCambio =
    material.cambiosDeFecha.length > 0
      ? material.cambiosDeFecha[material.cambiosDeFecha.length - 1]
      : null;

  return (
    <div className="group border-border/70 bg-card hover:border-border flex flex-col justify-between gap-3.5 rounded-xl border p-3.5 transition-all hover:shadow-2xs sm:flex-row sm:items-center">
      {/* Contenido principal con icono de tipo */}
      <div className="flex min-w-0 items-start gap-3.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${configTipo.color}`}
        >
          <HugeiconsIcon icon={configTipo.icon} size={20} />
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-foreground truncate text-sm font-semibold">{material.titulo}</p>
            <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium">
              {configTipo.label}
            </span>
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
            <p className="text-muted-foreground line-clamp-2 text-xs">{material.descripcion}</p>
          )}

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            {material.fechaProgramada && (
              <span className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={12}
                  className="text-muted-foreground/70"
                />
                <span>Programado: {formatDate(material.fechaProgramada)}</span>
              </span>
            )}
            {material.publicadoEn && (
              <span className="text-emerald-600 dark:text-emerald-400">
                · Publicado: {formatDate(material.publicadoEn)}
              </span>
            )}
            {material.sesionClase?.fecha && (
              <span>· Clase: {formatDate(material.sesionClase.fecha)}</span>
            )}
          </div>

          {puedeAdministrar && ultimoCambio && (
            <p className="text-muted-foreground text-[11px]">
              Historial: {formatDate(ultimoCambio.fechaAnterior)} →{" "}
              {formatDate(ultimoCambio.fechaSolicitada)} ({ultimoCambio.estado})
              {ultimoCambio.respuesta ? ` · Respuesta: ${ultimoCambio.respuesta}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
        {material.url && (
          <Button
            asChild
            variant="default"
            size="sm"
            className="h-8.5 gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
            onClick={() =>
              onRegistrarVisualizacion?.(
                material,
                material.tipo === "enlace" ? "visualizo" : "descargo",
              )
            }
          >
            <Link href={urlDeArchivo(material.url)} target="_blank" rel="noreferrer">
              <span>{material.tipo === "enlace" ? "Abrir enlace" : "Ver material"}</span>
              <HugeiconsIcon
                icon={material.tipo === "enlace" ? ArrowUpRight01Icon : Download01Icon}
                size={14}
              />
            </Link>
          </Button>
        )}

        {puedeAdministrar && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8.5 gap-1.5 rounded-xl text-xs font-medium"
            onClick={() => onVerActividad?.(material)}
          >
            <HugeiconsIcon icon={Activity01Icon} size={14} />
            <span className="hidden md:inline">Actividad</span>
          </Button>
        )}

        {puedeAdministrar && onEditar && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8.5 gap-1.5 rounded-xl text-xs font-medium"
            onClick={() => onEditar(material)}
          >
            <HugeiconsIcon icon={FileEditIcon} size={14} />
            <span>Editar</span>
          </Button>
        )}

        {puedeAdministrar && !material.publicadoEn && (
          <Button
            type="button"
            size="sm"
            className="h-8.5 gap-1.5 rounded-xl text-xs font-semibold"
            onClick={() => onPublicar(material)}
          >
            <HugeiconsIcon icon={CloudUploadIcon} size={14} />
            <span>Publicar</span>
          </Button>
        )}

        {puedeAdministrar && material.publicadoEn && material.vigente && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8.5 gap-1.5 rounded-xl text-xs font-medium"
            onClick={() => onPublicar(material)}
          >
            <HugeiconsIcon icon={CloudUploadIcon} size={14} />
            <span>Reemplazar</span>
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
              className="h-8.5 gap-1.5 rounded-xl text-xs font-medium"
              onClick={() => onSolicitarCambio(material)}
            >
              <HugeiconsIcon icon={FileEditIcon} size={14} />
              <span>Cambiar fecha</span>
            </Button>
          )}

        {puedeAdministrar && material.publicadoEn && material.vigente && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 h-8.5 gap-1.5 rounded-xl text-xs font-medium"
            onClick={() => onRetirar(material)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
            <span>Retirar</span>
          </Button>
        )}
      </div>
    </div>
  );
}
