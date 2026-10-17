"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCrearMatriculaMutation } from "../../hooks";
import { useEstudiantesQuery } from "@/features/estudiantes/hooks/use-estudiantes";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import type { Estudiante } from "@/features/estudiantes/types/estudiantes.types";
import type { TipoMatricula } from "../../types";

interface MatriculaIndividualFormProps {
  anioAcademicoId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const TIPO_OPTIONS: SelectOptionItem<TipoMatricula>[] = [
  { value: "nuevo", label: "Nuevo Ingreso", description: "Primer año en el colegio" },
  { value: "continuador", label: "Continuador", description: "Pasa al grado inmediato" },
  { value: "traslado", label: "Traslado Externo", description: "Proviene de otro colegio" },
];

export function MatriculaIndividualForm({
  anioAcademicoId,
  onSuccess,
  onCancel,
}: MatriculaIndividualFormProps) {
  const [estudianteId, setEstudianteId] = React.useState("");
  const [seccionId, setSeccionId] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoMatricula>("nuevo");
  const [esRepitente, setEsRepitente] = React.useState(false);
  const [colegioProcedencia, setColegioProcedencia] = React.useState("");
  const [observaciones, setObservaciones] = React.useState("");

  const { data: estudiantesData, isLoading: loadingEstudiantes } = useEstudiantesQuery({
    estado: "activo",
    limit: 100,
  });

  const { data: seccionesData, isLoading: loadingSecciones } = useSeccionesQuery();

  const mutation = useCrearMatriculaMutation(onSuccess);

  // Opciones de estudiantes para SelectOption
  const estudianteOptions: SelectOptionItem<string>[] = React.useMemo(() => {
    return (estudiantesData?.data ?? []).map((est: Estudiante) => ({
      value: est.id,
      label: est.persona.nombreCompleto || `${est.persona.apellidoPaterno}, ${est.persona.nombres}`,
      description: `Doc: ${est.persona.numeroDocumento} ${est.codigo ? `· SIAGIE: ${est.codigo}` : ""}`,
    }));
  }, [estudiantesData]);

  // Opciones de secciones con vacantes disponibles
  const seccionOptions: SelectOptionItem<string>[] = React.useMemo(() => {
    return ((seccionesData as Seccion[] | undefined) ?? [])
      .filter((s: Seccion) => s.estado === "activa")
      .map((s: Seccion) => {
        const disponibles = s.vacantes - s.matriculados;
        return {
          value: s.id,
          label: `${s.gradoNumero}.° ${s.nombre}`,
          description: `${disponibles} vacantes libres de ${s.vacantes}`,
          disabled: disponibles <= 0,
        };
      });
  }, [seccionesData]);

  const seccionSeleccionada = React.useMemo(() => {
    return (seccionesData as Seccion[] | undefined)?.find((s: Seccion) => s.id === seccionId);
  }, [seccionesData, seccionId]);

  const vacantesDisponibles = seccionSeleccionada
    ? seccionSeleccionada.vacantes - seccionSeleccionada.matriculados
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!estudianteId) {
      toast.error("Debe seleccionar un estudiante.");
      return;
    }
    if (!seccionId) {
      toast.error("Debe seleccionar una sección.");
      return;
    }
    if (tipo === "traslado" && !colegioProcedencia.trim()) {
      toast.error("Para traslados, el colegio de procedencia es obligatorio.");
      return;
    }
    if (vacantesDisponibles !== null && vacantesDisponibles <= 0) {
      toast.error("La sección seleccionada no cuenta con vacantes disponibles.");
      return;
    }

    const effectiveAnioId = anioAcademicoId || seccionSeleccionada?.anioAcademicoId;
    if (!effectiveAnioId) {
      toast.error("No se pudo determinar el año académico para la matrícula.");
      return;
    }

    mutation.mutate({
      estudianteId,
      seccionId,
      anioAcademicoId: effectiveAnioId,
      tipo,
      esRepitente,
      colegioProcedencia: tipo === "traslado" ? colegioProcedencia.trim() : undefined,
      observaciones: observaciones.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selector de Estudiante */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">
          Estudiante <span className="text-destructive">*</span>
        </Label>
        <SelectOption
          options={estudianteOptions}
          value={estudianteId}
          onSelect={(val) => setEstudianteId(val)}
          placeholder={
            loadingEstudiantes ? "Cargando estudiantes..." : "Buscar por apellidos o DNI..."
          }
          searchPlaceholder="Escriba nombres, apellidos o DNI..."
          disabled={loadingEstudiantes}
          className="h-10 text-xs"
        />
      </div>

      {/* Selector de Sección y Vacantes */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">
            Grado y Sección <span className="text-destructive">*</span>
          </Label>
          {vacantesDisponibles !== null && (
            <span
              className={`text-[11px] font-semibold ${
                vacantesDisponibles > 0 ? "text-emerald-600" : "text-destructive"
              }`}
            >
              {vacantesDisponibles > 0 ? `${vacantesDisponibles} vacantes libres` : "Sin vacantes"}
            </span>
          )}
        </div>
        <SelectOption
          options={seccionOptions}
          value={seccionId}
          onSelect={(val) => setSeccionId(val)}
          placeholder={
            loadingSecciones ? "Cargando secciones..." : "Seleccionar sección de destino..."
          }
          searchPlaceholder="Buscar sección..."
          disabled={loadingSecciones}
          className="h-10 text-xs"
        />
      </div>

      {/* Tipo de Matrícula */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Tipo de Matrícula</Label>
        <SelectOption
          options={TIPO_OPTIONS}
          value={tipo}
          onSelect={(val) => setTipo(val as TipoMatricula)}
          placeholder="Seleccionar tipo..."
          className="h-10 text-xs"
        />
      </div>

      {/* Condición de Repitente */}
      <div className="border-border/70 flex items-center space-x-2 rounded-xl border p-3">
        <Checkbox
          id="esRepitente"
          checked={esRepitente}
          onCheckedChange={(checked) => setEsRepitente(Boolean(checked))}
        />
        <Label htmlFor="esRepitente" className="cursor-pointer text-xs font-medium">
          El estudiante es repitente en este grado
        </Label>
      </div>

      {/* Colegio de Procedencia si es traslado */}
      {tipo === "traslado" && (
        <div className="animate-in fade-in-50 space-y-1.5 duration-200">
          <Label className="text-xs font-semibold">
            Colegio de Procedencia <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Nombre de la Institución Educativa de origen..."
            value={colegioProcedencia}
            onChange={(e) => setColegioProcedencia(e.target.value)}
            className="h-10 text-xs"
            required
          />
        </div>
      )}

      {/* Observaciones */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Observaciones Adicionales</Label>
        <Input
          placeholder="Anotaciones administrativas o de expediente..."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="h-10 text-xs"
        />
      </div>

      {/* Botones de Acción */}
      <div className="border-border/40 flex justify-end gap-2 border-t pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={mutation.isPending}
          className="h-9 rounded-full px-4 text-xs"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={mutation.isPending || !estudianteId || !seccionId}
          className="h-9 rounded-full px-4 text-xs shadow-xs"
        >
          {mutation.isPending ? "Matriculando..." : "Confirmar Matrícula"}
        </Button>
      </div>
    </form>
  );
}
