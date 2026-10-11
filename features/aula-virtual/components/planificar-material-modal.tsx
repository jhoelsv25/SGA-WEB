"use client";

import * as React from "react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectOption } from "@/components/common/select";
import { DatePicker } from "@/components/common/date-picker";
import { usePlanificarMaterial } from "../hooks";
import { TIPOS_MATERIAL, DIAS_SEMANA } from "../consts";
import type { BloqueCurso, TipoMaterial } from "../types";

interface PlanificarMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadId: string;
  bloques: BloqueCurso[];
}

function aISO(fecha: Date | undefined): string {
  if (!fecha) return "";
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
    fecha.getDate(),
  ).padStart(2, "0")}`;
}

function FormularioPlanificar({
  unidadId,
  bloques,
  onCerrar,
}: {
  unidadId: string;
  bloques: BloqueCurso[];
  onCerrar: () => void;
}) {
  const [titulo, setTitulo] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoMaterial>("documento");
  const [horarioId, setHorarioId] = React.useState<string>("");
  const [fechaClase, setFechaClase] = React.useState<Date | undefined>();
  const [fechaProgramada, setFechaProgramada] = React.useState<Date | undefined>();
  const [error, setError] = React.useState<string | null>(null);

  const planificar = usePlanificarMaterial();
  const bloqueElegido = bloques.find((b) => b.id === horarioId);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titulo.trim()) {
      setError("Ingrese el título del material.");
      return;
    }
    if (horarioId && !fechaClase) {
      setError("Indique la fecha de la clase del bloque elegido.");
      return;
    }
    if (!horarioId && !fechaProgramada) {
      setError("Indique la fecha programada del material.");
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
      { onSuccess: onCerrar },
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
          disabled={planificar.isPending}
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
          maxLength={1000}
          disabled={planificar.isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Tipo *</Label>
        <SelectOption
          options={TIPOS_MATERIAL.map((t) => ({ value: t.value, label: t.label }))}
          value={tipo}
          onSelect={(v) => setTipo(v as TipoMaterial)}
          disabled={planificar.isPending}
        />
      </div>
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
          disabled={planificar.isPending}
        />
      </div>
      {horarioId ? (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Fecha de la clase ({bloqueElegido ? DIAS_SEMANA[bloqueElegido.diaSemana] : ""}) *
          </Label>
          <DatePicker date={fechaClase} onSelect={setFechaClase} disabled={planificar.isPending} />
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Fecha programada *</Label>
          <DatePicker
            date={fechaProgramada}
            onSelect={setFechaProgramada}
            disabled={planificar.isPending}
          />
        </div>
      )}
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={planificar.isPending} className="min-h-10 gap-2">
          {planificar.isPending && <Spinner className="size-4" />}
          Planificar
        </Button>
      </div>
    </form>
  );
}

export function PlanificarMaterialModal({
  open,
  onOpenChange,
  unidadId,
  bloques,
}: PlanificarMaterialModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Planificar material"
      description="Compromete un material de reforzamiento con su fecha. Cuenta en el IGM."
      icon={Calendar03Icon}
      size="md"
    >
      {open && (
        <FormularioPlanificar
          key={unidadId}
          unidadId={unidadId}
          bloques={bloques}
          onCerrar={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
