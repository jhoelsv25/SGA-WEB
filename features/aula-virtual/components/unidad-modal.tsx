"use client";

import * as React from "react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectOption } from "@/components/common/select";
import { DatePicker } from "@/components/common/date-picker";
import { useCrearUnidad, useActualizarUnidad } from "../hooks";
import type { Unidad } from "../types";

interface Bimestre {
  id: string;
  nombre: string;
}

interface UnidadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cursoSeccionId: string;
  bimestres: Bimestre[];
  unidad?: Unidad | null;
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

function FormularioUnidad({
  cursoSeccionId,
  bimestres,
  unidad,
  onCerrar,
}: {
  cursoSeccionId: string;
  bimestres: Bimestre[];
  unidad?: Unidad | null;
  onCerrar: () => void;
}) {
  const [titulo, setTitulo] = React.useState(unidad?.titulo ?? "");
  const [descripcion, setDescripcion] = React.useState(unidad?.descripcion ?? "");
  const [periodoId, setPeriodoId] = React.useState(unidad?.periodoId ?? bimestres[0]?.id ?? "");
  const [fechaInicio, setFechaInicio] = React.useState<Date | undefined>(
    aFecha(unidad?.fechaInicio),
  );
  const [fechaFin, setFechaFin] = React.useState<Date | undefined>(aFecha(unidad?.fechaFin));
  const [error, setError] = React.useState<string | null>(null);

  const crear = useCrearUnidad(cursoSeccionId);
  const actualizar = useActualizarUnidad();
  const mutacion = unidad ? actualizar : crear;

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titulo.trim()) {
      setError("Ingrese el título de la unidad.");
      return;
    }
    if (!fechaInicio || !fechaFin) {
      setError("Ingrese las fechas de inicio y fin de la unidad.");
      return;
    }
    if (aISO(fechaFin) < aISO(fechaInicio)) {
      setError("La fecha de fin de la unidad debe ser igual o posterior a la de inicio.");
      return;
    }
    const payload = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      periodoId,
      fechaInicio: aISO(fechaInicio),
      fechaFin: aISO(fechaFin),
      publicada: true,
    };
    if (unidad) {
      actualizar.mutate({ id: unidad.id, ...payload }, { onSuccess: onCerrar });
    } else {
      crear.mutate(payload, { onSuccess: onCerrar });
    }
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="unidad-titulo" className="text-sm font-medium">
          Título *
        </Label>
        <Input
          id="unidad-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Ecuaciones"
          maxLength={150}
          disabled={mutacion.isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="unidad-descripcion" className="text-sm font-medium">
          Descripción (opcional)
        </Label>
        <Textarea
          id="unidad-descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={1000}
          disabled={mutacion.isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Bimestre *</Label>
        <SelectOption
          options={bimestres.map((b) => ({ value: b.id, label: b.nombre }))}
          value={periodoId}
          onSelect={setPeriodoId}
          placeholder="Bimestre"
          disabled={mutacion.isPending}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Fecha de inicio *</Label>
          <DatePicker date={fechaInicio} onSelect={setFechaInicio} disabled={mutacion.isPending} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Fecha de fin *</Label>
          <DatePicker date={fechaFin} onSelect={setFechaFin} disabled={mutacion.isPending} />
        </div>
      </div>
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={mutacion.isPending} className="min-h-10 gap-2">
          {mutacion.isPending && <Spinner className="size-4" />}
          Guardar
        </Button>
      </div>
    </form>
  );
}

export function UnidadModal({
  open,
  onOpenChange,
  cursoSeccionId,
  bimestres,
  unidad,
}: UnidadModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={unidad ? "Editar unidad" : "Nueva unidad"}
      description="Organiza el aula virtual en unidades, como en tu plan de clase."
      icon={BookOpen01Icon}
      size="md"
    >
      {open && (
        <FormularioUnidad
          key={unidad?.id ?? "nueva"}
          cursoSeccionId={cursoSeccionId}
          bimestres={bimestres}
          unidad={unidad}
          onCerrar={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
