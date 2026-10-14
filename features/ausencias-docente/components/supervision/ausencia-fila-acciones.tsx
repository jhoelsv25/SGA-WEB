"use client";

import * as React from "react";
import { Cancel01Icon, Edit02Icon, Time02Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { TableRowActions, type RowActionCustomItem } from "@/components/common/row-actions";
import { MENSAJES_AUSENCIA } from "@/features/ausencias-docente/consts";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { esAusenciaCorregible } from "@/features/ausencias-docente/utils";
import { toast } from "@/lib/toast";

export interface AusenciaFilaAccionesProps {
  ausencia: AusenciaResponseDto;
  usuarioActualId?: string;
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onVerHistorial: (ausencia: AusenciaResponseDto) => void;
  onCorregir: (ausencia: AusenciaResponseDto) => void;
  onAnular: (ausencia: AusenciaResponseDto) => void;
}

/**
 * Celda y menú de acciones por fila para el listado de ausencias (RF-012 HU2 y HU4).
 * Respeta autoría (CP-RF012-15), plazos de corrección (CP-RF012-14) y anulación (CP-RF012-16).
 */
export function AusenciaFilaAcciones({
  ausencia,
  usuarioActualId,
  onVerDetalle,
  onVerHistorial,
  onCorregir,
  onAnular,
}: AusenciaFilaAccionesProps) {
  // CP-RF012-15: Solo quien registró la ausencia puede ver la opción de corregirla
  const esAutorDelRegistro = Boolean(
    usuarioActualId && ausencia.registradoPor?.id === usuarioActualId,
  );

  const items = React.useMemo<RowActionCustomItem[]>(() => {
    const lista: RowActionCustomItem[] = [
      {
        key: "ver-detalle",
        label: "Ver detalle",
        icon: ViewIcon,
        onClick: () => onVerDetalle(ausencia),
      },
      {
        key: "ver-historial",
        label: "Ver historial",
        icon: Time02Icon,
        onClick: () => onVerHistorial(ausencia),
      },
    ];

    // CP-RF012-15: Si no es el autor, no se ofrece la acción de corregir
    if (esAutorDelRegistro && !ausencia.anulada) {
      lista.push({
        key: "corregir",
        label: "Corregir",
        icon: Edit02Icon,
        onClick: () => {
          // CP-RF012-14: Si está fuera de plazo o ya cuenta con descargo, informa el mensaje oficial
          if (!esAusenciaCorregible(ausencia)) {
            toast.error(MENSAJES_AUSENCIA.CORRECCION_FUERA_DE_PLAZO);
            return;
          }
          onCorregir(ausencia);
        },
      });
    }

    // Acción de anular disponible para supervisores si la ausencia no está ya anulada
    if (!ausencia.anulada) {
      lista.push({
        key: "anular",
        label: "Anular",
        icon: Cancel01Icon,
        variant: "destructive",
        separatorBefore: true,
        onClick: () => onAnular(ausencia),
      });
    }

    return lista;
  }, [ausencia, esAutorDelRegistro, onVerDetalle, onVerHistorial, onCorregir, onAnular]);

  return (
    <TableRowActions
      header={{
        title: ausencia.sesion.docenteNombre,
        subtitle: `${ausencia.sesion.cursoNombre} (${ausencia.horaDesde} - ${ausencia.horaHasta})`,
      }}
      items={items}
    />
  );
}
