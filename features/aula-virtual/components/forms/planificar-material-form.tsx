"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectOption } from "@/components/common/select";
import { DatePicker } from "@/components/common/date-picker";
import { Switch } from "@/components/ui/switch";
import { useActualizarMaterial, usePlanificarMaterial } from "../../hooks";
import { TIPOS_MATERIAL, DIAS_SEMANA } from "../../consts";
import type { BloqueCurso, Material, TipoMaterial } from "../../types";

export interface PlanificarMaterialFormProps {
  unidadId: string;
  bloques: BloqueCurso[];
  material?: Material | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

function aFecha(valor: string | null | undefined): Date | undefined {
  if (!valor) return undefined;
  const [a, m, d] = valor.slice(0, 10).split("-").map(Number);
  return new Date(a, m - 1, d);
}

function aISO(fecha: Date | undefined): string {
  if (!fecha) return "";
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
    fecha.getDate(),
  ).padStart(2, "0")}`;
}

export function PlanificarMaterialForm({
  unidadId,
  bloques,
  material,
  onCancel,
  onSuccess,
}: PlanificarMaterialFormProps) {
  const esEdicion = Boolean(material);
  const puedeEditarFecha =
    !material || (material.esPlanificado && !material.fechaCongelada && !material.publicadoEn);

  const [titulo, setTitulo] = React.useState(material?.titulo ?? "");
  const [descripcion, setDescripcion] = React.useState(material?.descripcion ?? "");
  const [tipo, setTipo] = React.useState<TipoMaterial>(material?.tipo ?? "documento");
  const [horarioId, setHorarioId] = React.useState<string>(material?.horarioId ?? "");
  const [fechaClase, setFechaClase] = React.useState<Date | undefined>(
    material?.horarioId ? aFecha(material.fechaProgramada) : undefined,
  );
  const [fechaProgramada, setFechaProgramada] = React.useState<Date | undefined>(
    !material?.horarioId ? aFecha(material?.fechaProgramada) : undefined,
  );
  const [visible, setVisible] = React.useState<boolean>(material?.visible ?? true);
  const [error, setError] = React.useState<string | null>(null);

  const planificar = usePlanificarMaterial();
  const actualizar = useActualizarMaterial();
  const isPending = planificar.isPending || actualizar.isPending;
  const bloqueElegido = bloques.find((b) => b.id === horarioId);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titulo.trim()) {
      setError("Ingrese el título del material.");
      return;
    }
    if (puedeEditarFecha) {
      if (horarioId && !fechaClase) {
        setError("Indique la fecha de la clase del bloque elegido.");
        return;
      }
      if (!horarioId && !fechaProgramada) {
        setError("Indique la fecha programada del material.");
        return;
      }
    }

    if (esEdicion && material) {
      actualizar.mutate(
        {
          id: material.id,
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || undefined,
          visible,
          ...(puedeEditarFecha
            ? {
                horarioId: horarioId || undefined,
                fechaClase: horarioId ? aISO(fechaClase) : undefined,
                fechaProgramada: !horarioId ? aISO(fechaProgramada) : undefined,
              }
            : {}),
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
      return;
    }

    planificar.mutate(
      {
        unidadId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        tipo,
        horarioId: horarioId || undefined,
        fechaClase: horarioId ? aISO(fechaClase) : undefined,
        fechaProgramada: !horarioId ? aISO(fechaProgramada) : undefined,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="material-titulo" className="text-sm font-medium">
          Título *
        </Label>
        <Input
          id="material-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Video de repaso de ecuaciones"
          maxLength={150}
          disabled={isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="material-descripcion" className="text-sm font-medium">
          Descripción (opcional)
        </Label>
        <Textarea
          id="material-descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe brevemente de qué trata este material..."
          maxLength={1000}
          disabled={isPending}
        />
      </div>
      {!esEdicion && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Tipo *</Label>
          <SelectOption
            options={TIPOS_MATERIAL.map((t) => ({ value: t.value, label: t.label }))}
            value={tipo}
            onSelect={(v) => setTipo(v as TipoMaterial)}
            disabled={isPending}
          />
        </div>
      )}
      {puedeEditarFecha && (
        <>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Bloque del horario (opcional)</Label>
            <SelectOption
              options={[
                { value: "", label: "Sin clase (fecha libre)" },
                ...bloques.map((b) => ({
                  value: b.id,
                  label: `${DIAS_SEMANA[b.diaSemana]} ${b.horaInicio.slice(0, 5)}-${b.horaFin.slice(0, 5)}`,
                })),
              ]}
              value={horarioId}
              onSelect={setHorarioId}
              disabled={isPending}
            />
          </div>
          {horarioId ? (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Fecha de la clase ({bloqueElegido ? DIAS_SEMANA[bloqueElegido.diaSemana] : ""}) *
              </Label>
              <DatePicker date={fechaClase} onSelect={setFechaClase} disabled={isPending} />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Fecha programada *</Label>
              <DatePicker
                date={fechaProgramada}
                onSelect={setFechaProgramada}
                disabled={isPending}
              />
            </div>
          )}
        </>
      )}
      {esEdicion && (
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">Visible para los estudiantes</p>
            <p className="text-muted-foreground text-xs">
              Permite ocultar temporalmente el material sin retirarlo.
            </p>
          </div>
          <Switch checked={visible} onCheckedChange={setVisible} disabled={isPending} />
        </div>
      )}
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10 gap-2" onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
          <span>Cancelar</span>
        </Button>
        <Button type="submit" disabled={isPending} className="min-h-10 gap-2">
          {isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
          )}
          <span>{esEdicion ? "Guardar cambios" : "Planificar material"}</span>
        </Button>
      </div>
    </form>
  );
}
