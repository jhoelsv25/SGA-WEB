"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import type { RowActionCustomItem } from "@/components/common/row-actions";
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  Download01Icon,
  LockIcon,
  RefreshIcon,
  UserCheck01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import type { ConsolidadoResumenItem } from "../../types";

export interface ConsolidadoActionsProps {
  consolidado: ConsolidadoResumenItem;
  esDirectorOAdmin?: boolean;
  onVerDetalle: (id: string) => void;
  onDescargarPdf: (id: string) => void;
  onAbrirDecision: (item: ConsolidadoResumenItem) => void;
  onAbrirReabrir: (item: ConsolidadoResumenItem) => void;
  onAbrirCerrar: (item: ConsolidadoResumenItem) => void;
  onAbrirHistorial: (item: ConsolidadoResumenItem) => void;
  onResolverSolicitud: (consolidadoId: string) => void;
}

export function ConsolidadoActions({
  consolidado,
  esDirectorOAdmin = false,
  onVerDetalle,
  onDescargarPdf,
  onAbrirDecision,
  onAbrirReabrir,
  onAbrirCerrar,
  onAbrirHistorial,
  onResolverSolicitud,
}: ConsolidadoActionsProps) {
  const tieneSolicitudesPendientes = (consolidado.solicitudesPendientesCount ?? 0) > 0;

  const items: RowActionCustomItem[] = [
    {
      key: "ver-detalle",
      label: "Ver ficha y detalle",
      icon: ViewIcon,
      onClick: () => onVerDetalle(consolidado.id),
    },
    {
      key: "descargar-pdf",
      label: "Descargar Ficha (PDF)",
      icon: Download01Icon,
      onClick: () => onDescargarPdf(consolidado.id),
    },
    {
      key: "historial-versiones",
      label: "Historial de versiones",
      icon: Clock01Icon,
      onClick: () => onAbrirHistorial(consolidado),
    },
  ];

  if (tieneSolicitudesPendientes) {
    items.push({
      key: "resolver-solicitud",
      label: "Resolver solicitud de revisión",
      icon: UserCheck01Icon,
      variant: "primary",
      onClick: () => onResolverSolicitud(consolidado.id),
    });
  }

  if (esDirectorOAdmin) {
    items.push({
      key: "registrar-decision",
      label: "Registrar Decisión Directiva",
      icon: CheckmarkCircle02Icon,
      separatorBefore: true,
      onClick: () => onAbrirDecision(consolidado),
    });

    if (consolidado.estado === "cerrado") {
      items.push({
        key: "reabrir",
        label: "Reabrir consolidado",
        icon: RefreshIcon,
        variant: "warning",
        onClick: () => onAbrirReabrir(consolidado),
      });
    } else {
      items.push({
        key: "cerrar",
        label: "Cerrar consolidado",
        icon: LockIcon,
        variant: "primary",
        onClick: () => onAbrirCerrar(consolidado),
      });
    }
  }

  return (
    <TableRowActions
      header={{
        title: consolidado.docenteNombre,
        subtitle: `DNI: ${consolidado.docenteDni} · ${consolidado.periodoNombre}`,
      }}
      copy={{
        text: consolidado.docenteDni,
        label: "Copiar DNI del docente",
        successMessage: `DNI ${consolidado.docenteDni} copiado al portapapeles`,
      }}
      items={items}
    />
  );
}
