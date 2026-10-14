"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { AlertCircleIcon, Award01Icon, Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMatriculasQuery } from "@/features/matriculas/hooks";
import { useCrearIncidenciaMutation } from "../../hooks";
import {
  CATEGORIAS_SUGERIDAS_FALTA,
  CATEGORIAS_SUGERIDAS_MERITO,
  OPCIONES_GRAVEDAD,
} from "../../constants";
import type { GravedadFalta, TipoIncidencia } from "../../types";

export interface CrearIncidenciaFormProps {
  defaultMatriculaId?: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function CrearIncidenciaForm({
  defaultMatriculaId,
  onCancel,
  onSuccess,
}: CrearIncidenciaFormProps) {
  const todayStr = React.useMemo(() => new Date().toISOString().split("T")[0], []);

  const [matriculaId, setMatriculaId] = React.useState(defaultMatriculaId ?? "");
  const [fecha, setFecha] = React.useState(todayStr);
  const [tipo, setTipo] = React.useState<TipoIncidencia>("falta");
  const [categoria, setCategoria] = React.useState("");
  const [gravedad, setGravedad] = React.useState<GravedadFalta>("leve");
  const [descripcion, setDescripcion] = React.useState("");
  const [lugar, setLugar] = React.useState("");
  const [medidasTomadas, setMedidasTomadas] = React.useState("");

  const { data: matriculasData, isLoading: isLoadingMatriculas } = useMatriculasQuery({
    limit: 100,
    estado: "matriculado",
  });

  const optionsEstudiantes = React.useMemo(() => {
    return (matriculasData?.data ?? []).map((m) => ({
      value: m.id,
      label: `${m.estudiante.apellidos}, ${m.estudiante.nombres} (${m.gradoNombre} ${m.seccionNombre})`,
    }));
  }, [matriculasData?.data]);

  const crearMutation = useCrearIncidenciaMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matriculaId || !categoria.trim() || !descripcion.trim() || !fecha) {
      return;
    }

    crearMutation.mutate({
      matriculaId,
      fecha,
      tipo,
      categoria: categoria.trim(),
      gravedad: tipo === "falta" ? gravedad : undefined,
      descripcion: descripcion.trim(),
      lugar: lugar.trim() || undefined,
      medidasTomadas: medidasTomadas.trim() || undefined,
    });
  };

  const categoriasSugeridas =
    tipo === "merito" ? CATEGORIAS_SUGERIDAS_MERITO : CATEGORIAS_SUGERIDAS_FALTA;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de Incidencia</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
              tipo === "merito"
                ? "border-emerald-500 bg-emerald-500/15 font-semibold text-emerald-700 dark:text-emerald-400"
                : "border-border hover:bg-muted/50 text-muted-foreground"
            }`}
            onClick={() => {
              setTipo("merito");
              setCategoria("");
            }}
          >
            <HugeiconsIcon
              icon={Award01Icon}
              className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
            />
            Mérito (+)
          </button>

          <button
            type="button"
            className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
              tipo === "falta"
                ? "border-amber-500 bg-amber-500/15 font-semibold text-amber-700 dark:text-amber-400"
                : "border-border hover:bg-muted/50 text-muted-foreground"
            }`}
            onClick={() => {
              setTipo("falta");
              setCategoria("");
            }}
          >
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="h-4 w-4 text-amber-600 dark:text-amber-400"
            />
            Falta (−)
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Estudiante</Label>
        <SelectOption
          options={optionsEstudiantes}
          value={matriculaId}
          onSelect={setMatriculaId}
          placeholder={
            isLoadingMatriculas ? "Cargando estudiantes..." : "Seleccione un estudiante..."
          }
          disabled={isLoadingMatriculas || Boolean(defaultMatriculaId) || crearMutation.isPending}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Fecha */}
        <div className="space-y-2">
          <Label htmlFor="fecha-incidencia" className="text-sm font-medium">
            Fecha
          </Label>
          <Input
            id="fecha-incidencia"
            type="date"
            max={todayStr}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            disabled={crearMutation.isPending}
          />
        </div>

        {tipo === "falta" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gravedad</Label>
            <SelectOption
              options={OPCIONES_GRAVEDAD}
              value={gravedad}
              onSelect={(val) => setGravedad(val)}
              disabled={crearMutation.isPending}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria-input" className="text-sm font-medium">
          Categoría
        </Label>
        <Input
          id="categoria-input"
          placeholder="Ej. Puntualidad, Respeto..."
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          maxLength={100}
          disabled={crearMutation.isPending}
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categoriasSugeridas.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setCategoria(cat)}
              className="bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full px-2.5 py-0.5 text-[11px] transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="descripcion-input" className="text-sm font-medium">
          Descripción detallada
        </Label>
        <Textarea
          id="descripcion-input"
          placeholder="Detalle los hechos observados de forma objetiva y formativa..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          rows={3}
          maxLength={1000}
          disabled={crearMutation.isPending}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Lugar */}
        <div className="space-y-2">
          <Label htmlFor="lugar-input" className="text-sm font-medium">
            Lugar (opcional)
          </Label>
          <Input
            id="lugar-input"
            placeholder="Ej. Patio, Aula de 3.° B..."
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            maxLength={100}
            disabled={crearMutation.isPending}
          />
        </div>

        {/* Medidas tomadas */}
        <div className="space-y-2">
          <Label htmlFor="medidas-input" className="text-sm font-medium">
            Medidas tomadas (opcional)
          </Label>
          <Input
            id="medidas-input"
            placeholder="Ej. Diálogo reflexivo..."
            value={medidasTomadas}
            onChange={(e) => setMedidasTomadas(e.target.value)}
            maxLength={1000}
            disabled={crearMutation.isPending}
          />
        </div>
      </div>

      {/* Aviso sobre notificación al apoderado */}
      <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-500/10 p-3 text-xs text-blue-700 dark:border-blue-800 dark:text-blue-400">
        <HugeiconsIcon icon={Notification01Icon} className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong>Aviso automático:</strong> Al guardar este registro se notificará automáticamente
          en el sistema al apoderado principal del estudiante.
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={crearMutation.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={crearMutation.isPending} className="gap-2">
          {crearMutation.isPending && <Spinner className="size-4" />}
          {crearMutation.isPending ? "Guardando..." : "Registrar Incidencia"}
        </Button>
      </div>
    </form>
  );
}
