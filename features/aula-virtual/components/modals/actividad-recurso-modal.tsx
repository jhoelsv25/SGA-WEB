"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Activity01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { StatusBadge } from "@/components/common/status-badge";
import { DataTable, DataTableColumnHeader } from "@/components/common/data-table";
import { formatearFechaHora } from "../../utils";
import { useActividadMaterial, useActividadTarea } from "../../hooks";
import type { ActividadMaterialEstudiante, ActividadTareaEstudiante } from "../../types";

export interface RecursoActividadTarget {
  tipo: "material" | "tarea";
  id: string;
  titulo: string;
}

interface ActividadRecursoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recurso: RecursoActividadTarget | null;
}

export function ActividadRecursoModal({ open, onOpenChange, recurso }: ActividadRecursoModalProps) {
  const esMaterial = recurso?.tipo === "material";
  const esTarea = recurso?.tipo === "tarea";

  const { data: actMaterial = [], isLoading: cargandoMaterial } = useActividadMaterial(
    open && esMaterial && recurso ? recurso.id : "",
  );
  const { data: actTarea = [], isLoading: cargandoTarea } = useActividadTarea(
    open && esTarea && recurso ? recurso.id : "",
  );

  const isLoading = esMaterial ? cargandoMaterial : cargandoTarea;

  // Contadores de estadísticas
  const stats = React.useMemo(() => {
    if (esMaterial) {
      const total = actMaterial.length;
      const descargaron = actMaterial.filter((e) => e.descargo).length;
      const visualizaron = actMaterial.filter((e) => e.visualizo && !e.descargo).length;
      const sinRevisar = actMaterial.filter((e) => !e.visualizo && !e.descargo).length;
      return { total, descargaron, visualizaron, sinRevisar };
    }
    if (esTarea) {
      const total = actTarea.length;
      const completaron = actTarea.filter((e) => e.completo).length;
      const abrieron = actTarea.filter((e) => e.abrio && !e.completo).length;
      const sinRevisar = actTarea.filter((e) => !e.abrio && !e.completo).length;
      return { total, completaron, abrieron, sinRevisar };
    }
    return { total: 0 };
  }, [esMaterial, esTarea, actMaterial, actTarea]);

  // Columnas para material de reforzamiento
  const columnsMaterial = React.useMemo<ColumnDef<ActividadMaterialEstudiante>[]>(
    () => [
      {
        accessorKey: "codigo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground font-mono text-xs">{row.original.codigo}</span>
        ),
      },
      {
        accessorKey: "nombreCompleto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estudiante" />,
        cell: ({ row }) => (
          <span className="text-foreground text-xs font-medium">{row.original.nombreCompleto}</span>
        ),
      },
      {
        id: "estado",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
        cell: ({ row }) => {
          const est = row.original;
          const estado = est.descargo
            ? { label: "Descargó", tone: "brand" as const }
            : est.visualizo
              ? { label: "Visualizó", tone: "neutral" as const }
              : { label: "Sin revisar", tone: "warning" as const };
          return (
            <StatusBadge tone={estado.tone} className="text-xs">
              {estado.label}
            </StatusBadge>
          );
        },
      },
      {
        accessorKey: "visualizoEn",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Visualizado" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatearFechaHora(row.original.visualizoEn)}
          </span>
        ),
      },
      {
        accessorKey: "descargoEn",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Descargado" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatearFechaHora(row.original.descargoEn)}
          </span>
        ),
      },
    ],
    [],
  );

  // Columnas para tarea o evaluación
  const columnsTarea = React.useMemo<ColumnDef<ActividadTareaEstudiante>[]>(
    () => [
      {
        accessorKey: "codigo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground font-mono text-xs">{row.original.codigo}</span>
        ),
      },
      {
        accessorKey: "nombreCompleto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estudiante" />,
        cell: ({ row }) => (
          <span className="text-foreground text-xs font-medium">{row.original.nombreCompleto}</span>
        ),
      },
      {
        id: "estado",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
        cell: ({ row }) => {
          const est = row.original;
          const estado = est.completo
            ? { label: "Completó", tone: "brand" as const }
            : est.abrio
              ? { label: "Abrió", tone: "neutral" as const }
              : { label: "Sin revisar", tone: "warning" as const };
          return (
            <StatusBadge tone={estado.tone} className="text-xs">
              {estado.label}
            </StatusBadge>
          );
        },
      },
      {
        accessorKey: "abrioEn",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Abierto" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatearFechaHora(row.original.abrioEn)}
          </span>
        ),
      },
      {
        accessorKey: "completoEn",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Completado" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatearFechaHora(row.original.completoEn)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Registro de Actividad — ${recurso?.titulo || ""}`}
      description={
        esMaterial
          ? "Detalle de estudiantes que revisaron o descargaron este material de reforzamiento."
          : "Detalle de estudiantes que abrieron o completaron esta tarea o evaluación."
      }
      icon={Activity01Icon}
      size="3xl"
    >
      <div className="space-y-4">
        {/* Resumen de contadores */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="bg-muted/30 rounded-lg border p-2.5 text-center">
            <span className="text-muted-foreground text-xs">Total alumnos</span>
            <p className="text-foreground text-lg font-bold">{stats.total}</p>
          </div>

          {esMaterial && (
            <>
              <div className="bg-muted/30 rounded-lg border p-2.5 text-center">
                <span className="text-muted-foreground text-xs">Descargaron</span>
                <p className="text-primary text-lg font-bold">
                  {"descargaron" in stats ? stats.descargaron : 0}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg border p-2.5 text-center">
                <span className="text-muted-foreground text-xs">Solo visualizaron</span>
                <p className="text-foreground text-lg font-bold">
                  {"visualizaron" in stats ? stats.visualizaron : 0}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg border p-2.5 text-center">
                <span className="text-muted-foreground text-xs">Sin revisar</span>
                <p className="text-muted-foreground text-lg font-bold">
                  {"sinRevisar" in stats ? stats.sinRevisar : 0}
                </p>
              </div>
            </>
          )}

          {esTarea && (
            <>
              <div className="bg-muted/30 rounded-lg border p-2.5 text-center">
                <span className="text-muted-foreground text-xs">Completaron</span>
                <p className="text-primary text-lg font-bold">
                  {"completaron" in stats ? stats.completaron : 0}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg border p-2.5 text-center">
                <span className="text-muted-foreground text-xs">Solo abrieron</span>
                <p className="text-foreground text-lg font-bold">
                  {"abrieron" in stats ? stats.abrieron : 0}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg border p-2.5 text-center">
                <span className="text-muted-foreground text-xs">Sin revisar</span>
                <p className="text-muted-foreground text-lg font-bold">
                  {"sinRevisar" in stats ? stats.sinRevisar : 0}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Tabla DataTable reutilizable */}
        {esMaterial && (
          <DataTable
            columns={columnsMaterial}
            data={actMaterial}
            isLoading={isLoading}
            searchKey="nombreCompleto"
            searchPlaceholder="Buscar estudiante..."
            emptyState={{
              title: "Sin registros de actividad",
              description: "No se encontraron estudiantes matriculados en este curso.",
            }}
          />
        )}

        {esTarea && (
          <DataTable
            columns={columnsTarea}
            data={actTarea}
            isLoading={isLoading}
            searchKey="nombreCompleto"
            searchPlaceholder="Buscar estudiante..."
            emptyState={{
              title: "Sin registros de actividad",
              description: "No se encontraron estudiantes matriculados en este curso.",
            }}
          />
        )}
      </div>
    </Modal>
  );
}
