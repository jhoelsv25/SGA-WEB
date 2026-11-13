"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { SelectOption } from "@/components/common/select";
import { DatePicker } from "@/components/common/date-picker";
import { formatDate } from "@/lib/formatters/date";
import type { Bimestre } from "@/features/anio-escolar/types";
import { useCrearUnidad, useActualizarUnidad } from "../../hooks";
import { formatearBimestre } from "../../utils";
import type { Unidad } from "../../types";

interface UnidadFormProps {
  cursoSeccionId: string;
  bimestres: Bimestre[];
  unidad?: Unidad | null;
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

export function UnidadForm({
  cursoSeccionId,
  bimestres,
  unidad,
  onCancel,
  onSuccess,
}: UnidadFormProps) {
  // 1. Preseleccionar automáticamente el bimestre activo ("en_curso")
  const periodoPorDefecto = React.useMemo(() => {
    if (unidad?.periodoId) return unidad.periodoId;
    const enCurso = bimestres.find((b) => b.estado === "en_curso");
    if (enCurso) return enCurso.id;
    const planificado = bimestres.find((b) => b.estado === "planificado");
    if (planificado) return planificado.id;
    return bimestres[0]?.id ?? "";
  }, [unidad?.periodoId, bimestres]);

  const [periodoId, setPeriodoId] = React.useState(periodoPorDefecto);

  const bimestreSeleccionado = React.useMemo(() => {
    return bimestres.find((b) => b.id === periodoId);
  }, [bimestres, periodoId]);

  const [titulo, setTitulo] = React.useState(unidad?.titulo ?? "");
  const [descripcion, setDescripcion] = React.useState(unidad?.descripcion ?? "");
  const [fechaInicio, setFechaInicio] = React.useState<Date | undefined>(
    aFecha(unidad?.fechaInicio) ?? (unidad ? undefined : aFecha(bimestreSeleccionado?.fechaInicio)),
  );
  const [fechaFin, setFechaFin] = React.useState<Date | undefined>(
    aFecha(unidad?.fechaFin) ?? (unidad ? undefined : aFecha(bimestreSeleccionado?.fechaFin)),
  );
  const [publicada, setPublicada] = React.useState(unidad?.publicada ?? true);
  const [error, setError] = React.useState<string | null>(null);

  const handleCambiarBimestre = (nuevoId: string) => {
    setPeriodoId(nuevoId);
    if (!unidad) {
      const nuevoBimestre = bimestres.find((b) => b.id === nuevoId);
      if (nuevoBimestre) {
        setFechaInicio(aFecha(nuevoBimestre.fechaInicio));
        setFechaFin(aFecha(nuevoBimestre.fechaFin));
      }
    }
  };

  const opcionesBimestre = React.useMemo(() => {
    return bimestres.map((b) => {
      const cerrado = b.estado === "cerrado";
      const enCurso = b.estado === "en_curso";
      let tag = "";
      if (enCurso) tag = " • En curso";
      else if (cerrado) tag = " (Cerrado)";

      return {
        value: b.id,
        label: `${formatearBimestre(b.nombre)}${tag}`,
        disabled: !unidad && cerrado,
        description: cerrado ? "Periodo finalizado (no admite nuevas unidades)" : undefined,
      };
    });
  }, [bimestres, unidad]);

  const crear = useCrearUnidad(cursoSeccionId);
  const actualizar = useActualizarUnidad();
  const mutacion = unidad ? actualizar : crear;

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titulo.trim()) {
      setError("Ingrese el título de la unidad.");
      return;
    }
    if (!periodoId) {
      setError("Seleccione un bimestre válido.");
      return;
    }
    if (!unidad && bimestreSeleccionado?.estado === "cerrado") {
      setError("El bimestre está cerrado. No se pueden crear unidades en periodos finalizados.");
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
      publicada,
    };
    if (unidad) {
      actualizar.mutate({ id: unidad.id, ...payload }, { onSuccess });
    } else {
      crear.mutate(payload, { onSuccess });
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
          placeholder="Describe los temas o competencias que se desarrollarán en esta unidad..."
          maxLength={1000}
          disabled={mutacion.isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Bimestre *</Label>
        <SelectOption
          options={opcionesBimestre}
          value={periodoId}
          onSelect={handleCambiarBimestre}
          placeholder="Seleccionar bimestre..."
          disabled={mutacion.isPending}
        />
        {bimestreSeleccionado && (
          <p className="text-muted-foreground text-[11px]">
            Vigencia del periodo: {formatDate(bimestreSeleccionado.fechaInicio)} al{" "}
            {formatDate(bimestreSeleccionado.fechaFin)}
          </p>
        )}
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
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Visible para los estudiantes</p>
          <p className="text-muted-foreground text-xs">
            Si se desactiva, la unidad y sus materiales quedan ocultos para los estudiantes.
          </p>
        </div>
        <Switch checked={publicada} onCheckedChange={setPublicada} disabled={mutacion.isPending} />
      </div>
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10 gap-2" onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
          <span>Cancelar</span>
        </Button>
        <Button type="submit" disabled={mutacion.isPending} className="min-h-10 gap-2">
          {mutacion.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
          )}
          <span>{unidad ? "Guardar cambios" : "Crear unidad"}</span>
        </Button>
      </div>
    </form>
  );
}
