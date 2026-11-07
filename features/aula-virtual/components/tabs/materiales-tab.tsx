"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, Calendar03Icon, FileAddIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/formatters/date";
import { MaterialFila } from "../materiales/material-fila";
import type { Material, Unidad } from "../../types";

export interface MaterialesTabProps {
  unidades: Unidad[];
  puedeAdministrar: boolean;
  onPlanificarMaterial: (unidadId: string) => void;
  onMaterialExtra: (unidadId: string) => void;
  onEditarUnidad: (unidad: Unidad) => void;
  onPublicarMaterial: (material: Material) => void;
  onEditarMaterial: (unidadId: string, material: Material) => void;
  onSolicitarCambio: (material: Material) => void;
  onRetirarMaterial: (material: Material) => void;
  onVerActividad: (material: Material) => void;
  onRegistrarVisualizacion: (material: Material, accion: "visualizo" | "descargo") => void;
}

export function MaterialesTab({
  unidades,
  puedeAdministrar,
  onPlanificarMaterial,
  onMaterialExtra,
  onEditarUnidad,
  onPublicarMaterial,
  onEditarMaterial,
  onSolicitarCambio,
  onRetirarMaterial,
  onVerActividad,
  onRegistrarVisualizacion,
}: MaterialesTabProps) {
  if (unidades.length === 0) {
    return (
      <EmptyState
        title="Aún no hay unidades"
        description="Crea la primera unidad para empezar a planificar materiales."
        icon={BookOpen01Icon}
      />
    );
  }

  return (
    <div className="space-y-4">
      {unidades.map((unidad) => (
        <div key={unidad.id} className="bg-card/60 rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-foreground font-semibold">{unidad.titulo}</p>
              {unidad.descripcion && (
                <p className="text-muted-foreground text-sm">{unidad.descripcion}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {unidad.fechaInicio && formatDate(unidad.fechaInicio)} –{" "}
                {unidad.fechaFin && formatDate(unidad.fechaFin)}
                {!unidad.publicada && " · Oculta"}
              </p>
            </div>
            {puedeAdministrar && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-9 gap-1.5"
                  onClick={() => onPlanificarMaterial(unidad.id)}
                >
                  <HugeiconsIcon icon={Calendar03Icon} size={16} />
                  Planificar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-9 gap-1.5"
                  onClick={() => onMaterialExtra(unidad.id)}
                >
                  <HugeiconsIcon icon={FileAddIcon} size={16} />
                  Material extra
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-9"
                  onClick={() => onEditarUnidad(unidad)}
                >
                  Editar
                </Button>
              </div>
            )}
          </div>
          <div className="mt-3 space-y-2">
            {unidad.materiales.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sin materiales todavía.</p>
            ) : (
              unidad.materiales.map((material) => (
                <MaterialFila
                  key={material.id}
                  material={material}
                  puedeAdministrar={puedeAdministrar}
                  onPublicar={onPublicarMaterial}
                  onEditar={(mat) => onEditarMaterial(unidad.id, mat)}
                  onSolicitarCambio={onSolicitarCambio}
                  onRetirar={onRetirarMaterial}
                  onVerActividad={onVerActividad}
                  onRegistrarVisualizacion={onRegistrarVisualizacion}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
