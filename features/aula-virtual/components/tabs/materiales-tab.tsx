"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  Calendar03Icon,
  FileAddIcon,
  FileEditIcon,
  Folder01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/formatters/date";
import { MaterialFila } from "../materiales/material-fila";
import type { Material, Unidad } from "../../types";

export interface MaterialesTabProps {
  unidades: Unidad[];
  puedeAdministrar: boolean;
  onNuevaUnidad?: () => void;
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
  onNuevaUnidad,
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
        description="Crea la primera unidad para empezar a planificar materiales de reforzamiento."
        icon={BookOpen01Icon}
        action={
          puedeAdministrar && onNuevaUnidad ? (
            <Button
              type="button"
              onClick={onNuevaUnidad}
              className="gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-xs"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              <span>Crear primera unidad</span>
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {puedeAdministrar && onNuevaUnidad && (
        <div className="flex flex-col gap-2 pb-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-foreground text-sm font-semibold">Unidades temáticas</h3>
            <p className="text-muted-foreground text-xs">
              Organiza los contenidos y materiales de reforzamiento por unidades.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={onNuevaUnidad}
            className="gap-1.5 self-start rounded-xl text-xs font-semibold shadow-xs sm:self-auto"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={15} />
            <span>Nueva unidad</span>
          </Button>
        </div>
      )}
      {unidades.map((unidad) => (
        <div
          key={unidad.id}
          className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-xs"
        >
          {/* Cabecera de la Unidad temática */}
          <div className="bg-muted/30 border-border/60 flex flex-col justify-between gap-3 border-b p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold">
                <HugeiconsIcon icon={Folder01Icon} size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-foreground text-base font-bold">{unidad.titulo}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      unidad.publicada
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground border"
                    }`}
                  >
                    {unidad.publicada ? "Publicada" : "Oculta para alumnos"}
                  </span>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                    {unidad.materiales.length}{" "}
                    {unidad.materiales.length === 1 ? "recurso" : "recursos"}
                  </span>
                </div>

                {unidad.descripcion && (
                  <p className="text-muted-foreground text-xs">{unidad.descripcion}</p>
                )}

                {(unidad.fechaInicio || unidad.fechaFin) && (
                  <p className="text-muted-foreground flex items-center gap-1.5 pt-0.5 text-[11px] font-medium">
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={12}
                      className="text-muted-foreground/70"
                    />
                    <span>
                      Vigencia: {unidad.fechaInicio && formatDate(unidad.fechaInicio)} –{" "}
                      {unidad.fechaFin && formatDate(unidad.fechaFin)}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Acciones del docente sobre la unidad */}
            {puedeAdministrar && (
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs font-medium"
                  onClick={() => onPlanificarMaterial(unidad.id)}
                >
                  <HugeiconsIcon icon={Calendar03Icon} size={14} />
                  <span>Planificar</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs font-medium"
                  onClick={() => onMaterialExtra(unidad.id)}
                >
                  <HugeiconsIcon icon={FileAddIcon} size={14} />
                  <span>Material extra</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs font-medium"
                  onClick={() => onEditarUnidad(unidad)}
                >
                  <HugeiconsIcon icon={FileEditIcon} size={14} />
                  <span>Editar unidad</span>
                </Button>
              </div>
            )}
          </div>

          {/* Listado de Materiales dentro de la Unidad */}
          <div className="space-y-2.5 p-4">
            {unidad.materiales.length === 0 ? (
              <div className="border-border/60 bg-muted/20 rounded-xl border border-dashed py-6 text-center">
                <p className="text-muted-foreground text-xs font-medium">
                  Esta unidad aún no tiene materiales planificados o publicados.
                </p>
                {puedeAdministrar && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-primary mt-1 h-auto text-xs"
                    onClick={() => onPlanificarMaterial(unidad.id)}
                  >
                    + Planificar primer material
                  </Button>
                )}
              </div>
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
