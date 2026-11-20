"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { TableRowActions } from "@/components/common/row-actions";
import type { RowActionCustomItem } from "@/components/common/row-actions/types";
import { toast } from "@/lib/toast";
import { credencialesApi } from "@/features/credenciales/api/credenciales.api";
import type { Seccion } from "../../types";

interface SeccionActionsProps {
  seccion: Seccion;
  puedeGestionar: boolean;
  onEdit?: (seccion: Seccion) => void;
  onCerrar?: (seccion: Seccion) => Promise<void>;
  isCerrando?: boolean;
}

export function SeccionActions({
  seccion,
  puedeGestionar,
  onEdit,
  onCerrar,
  isCerrando = false,
}: SeccionActionsProps) {
  const router = useRouter();

  const customItems: RowActionCustomItem[] = [
    {
      key: "carga-academica",
      label: "Carga académica",
      icon: BookOpen01Icon,
      href: `/admin/secciones/${seccion.id}/carga`,
      onClick: () => {
        router.push(`/admin/secciones/${seccion.id}/carga`);
      },
    },
    {
      key: "descargar-carnes",
      label: "Descargar Carnés en PDF",
      icon: Download01Icon,
      onClick: async () => {
        try {
          await credencialesApi.descargarCarnesSeccionPdf(
            seccion.id,
            `carnes-${seccion.gradoNombre.replace(/\s+/g, "_")}_${seccion.nombre}.pdf`,
          );
          toast.success("Carnés descargados exitosamente.");
        } catch (error: unknown) {
          const mensaje =
            error instanceof Error ? error.message : "Error al descargar los carnés de la sección.";
          toast.error(mensaje);
        }
      },
    },
  ];

  return (
    <TableRowActions
      header={{
        title: `${seccion.gradoNombre} - Sección ${seccion.nombre}`,
        subtitle: seccion.aula ? `Aula: ${seccion.aula}` : "Sin aula asignada",
      }}
      items={customItems}
      onEdit={
        puedeGestionar && onEdit && seccion.estado === "activa" ? () => onEdit(seccion) : undefined
      }
      editLabel="Editar sección"
      deleteAction={
        puedeGestionar && onCerrar && seccion.estado === "activa"
          ? {
              label: "Cerrar sección",
              title: `¿Cerrar sección ${seccion.gradoNombre} "${seccion.nombre}"?`,
              description: `¿Estás seguro de que deseas cerrar esta sección? El sistema verificará que no cuente con estudiantes matriculados vigentes antes de proceder.`,
              confirmText: "Cerrar sección",
              cancelText: "Cancelar",
              onConfirm: () => onCerrar(seccion),
              isPending: isCerrando,
            }
          : undefined
      }
      triggerAriaLabel={`Abrir menú de opciones para la sección ${seccion.nombre} de ${seccion.gradoNombre}`}
    />
  );
}
