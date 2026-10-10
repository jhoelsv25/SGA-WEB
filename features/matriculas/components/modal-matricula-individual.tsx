"use client";

import * as React from "react";
import { toast } from "sonner";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCrearMatriculaMutation } from "../hooks";
import { useEstudiantesQuery } from "@/features/estudiantes/hooks/use-estudiantes";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import type { Estudiante } from "@/features/estudiantes/types/estudiantes.types";
import type { TipoMatricula } from "../types";

interface ModalMatriculaIndividualProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anioAcademicoId?: string;
}

export function ModalMatriculaIndividual({
  open,
  onOpenChange,
  anioAcademicoId,
}: ModalMatriculaIndividualProps) {
  const [estudianteId, setEstudianteId] = React.useState("");
  const [seccionId, setSeccionId] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoMatricula>("nuevo");
  const [esRepitente, setEsRepitente] = React.useState(false);
  const [colegioProcedencia, setColegioProcedencia] = React.useState("");
  const [observaciones, setObservaciones] = React.useState("");
  const [searchEstudiante, setSearchEstudiante] = React.useState("");

  const { data: estudiantesData, isLoading: loadingEstudiantes } = useEstudiantesQuery({
    search: searchEstudiante.length >= 2 ? searchEstudiante : undefined,
    estado: "activo",
    limit: 30,
  });

  const { data: seccionesData, isLoading: loadingSecciones } = useSeccionesQuery();

  const resetForm = React.useCallback(() => {
    setEstudianteId("");
    setSeccionId("");
    setTipo("nuevo");
    setEsRepitente(false);
    setColegioProcedencia("");
    setObservaciones("");
    setSearchEstudiante("");
  }, []);

  const mutation = useCrearMatriculaMutation(() => {
    onOpenChange(false);
    resetForm();
  });

  const seccionesDisponibles = React.useMemo(() => {
    if (!seccionesData) return [];
    return (seccionesData as Seccion[]).filter((s: Seccion) => s.estado === "activa");
  }, [seccionesData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estudianteId) {
      toast.error("Seleccione un estudiante activo.");
      return;
    }
    if (!seccionId) {
      toast.error("Seleccione una sección de destino.");
      return;
    }
    if (tipo === "traslado" && !colegioProcedencia.trim()) {
      toast.error("Indique el colegio de procedencia del estudiante trasladado.");
      return;
    }

    const seccionSeleccionada = seccionesDisponibles.find((s: Seccion) => s.id === seccionId);
    const anioId = anioAcademicoId || seccionSeleccionada?.anioAcademicoId;
    if (!anioId) {
      toast.error("No se pudo determinar el año académico.");
      return;
    }

    mutation.mutate({
      estudianteId,
      seccionId,
      anioAcademicoId: anioId,
      tipo,
      esRepitente,
      colegioProcedencia: tipo === "traslado" ? colegioProcedencia.trim() : undefined,
      observaciones: observaciones.trim() || undefined,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Matricular Estudiante"
      description="Inscriba formalmente a un estudiante nuevo, continuador o trasladado en una sección activa."
      icon={UserAdd01Icon}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-1">
        {/* Búsqueda y selección de estudiante */}
        <div className="space-y-2">
          <Label htmlFor="search-est" className="text-xs font-semibold">
            Buscar Estudiante (DNI o Apellidos)
          </Label>
          <Input
            id="search-est"
            placeholder="Escriba para filtrar por DNI o apellidos..."
            value={searchEstudiante}
            onChange={(e) => setSearchEstudiante(e.target.value)}
            className="h-10 text-xs"
          />
          <div className="space-y-1">
            <Label htmlFor="estudiante-sel" className="text-xs font-semibold">
              Estudiante a Matricular <span className="text-destructive">*</span>
            </Label>
            <Select value={estudianteId} onValueChange={setEstudianteId}>
              <SelectTrigger id="estudiante-sel" className="h-10 text-xs">
                <SelectValue
                  placeholder={
                    loadingEstudiantes ? "Cargando estudiantes..." : "Seleccione el estudiante"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {estudiantesData?.data?.map((est: Estudiante) => (
                  <SelectItem key={est.id} value={est.id}>
                    {est.persona.apellidoPaterno} {est.persona.apellidoMaterno ?? ""}{" "}
                    {est.persona.nombres} ({est.persona.numeroDocumento})
                  </SelectItem>
                ))}
                {(!estudiantesData?.data || estudiantesData.data.length === 0) && (
                  <div className="text-muted-foreground p-2 text-center text-xs">
                    No hay estudiantes que coincidan con la búsqueda
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sección y vacantes */}
        <div className="space-y-1.5">
          <Label htmlFor="seccion-sel" className="text-xs font-semibold">
            Grado y Sección de Destino <span className="text-destructive">*</span>
          </Label>
          <Select value={seccionId} onValueChange={setSeccionId}>
            <SelectTrigger id="seccion-sel" className="h-10 text-xs">
              <SelectValue
                placeholder={
                  loadingSecciones ? "Cargando salones..." : "Seleccione grado y sección"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {seccionesDisponibles.map((sec: Seccion) => (
                <SelectItem key={sec.id} value={sec.id}>
                  {sec.gradoNombre} &quot;{sec.nombre}&quot; — {sec.vacantes - sec.matriculados}{" "}
                  vacantes libres ({sec.vacantes} total)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de matrícula */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tipo-sel" className="text-xs font-semibold">
              Tipo de Matrícula
            </Label>
            <Select value={tipo} onValueChange={(val) => setTipo(val as TipoMatricula)}>
              <SelectTrigger id="tipo-sel" className="h-10 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nuevo">Nuevo ingreso</SelectItem>
                <SelectItem value="continuador">Continuador</SelectItem>
                <SelectItem value="traslado">Traslado externo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="es-repitente"
              checked={esRepitente}
              onCheckedChange={(c) => setEsRepitente(Boolean(c))}
            />
            <Label htmlFor="es-repitente" className="cursor-pointer text-xs font-medium">
              ¿Estudiante repite el grado?
            </Label>
          </div>
        </div>

        {/* Colegio de procedencia si es traslado */}
        {tipo === "traslado" && (
          <div className="animate-in fade-in space-y-1.5 duration-200">
            <Label htmlFor="colegio-procedencia" className="text-xs font-semibold">
              Colegio de Procedencia <span className="text-destructive">*</span>
            </Label>
            <Input
              id="colegio-procedencia"
              placeholder="Nombre de la institución educativa anterior..."
              value={colegioProcedencia}
              onChange={(e) => setColegioProcedencia(e.target.value)}
              className="h-10 text-xs"
              required
            />
          </div>
        )}

        {/* Observaciones */}
        <div className="space-y-1.5">
          <Label htmlFor="obs" className="text-xs font-semibold">
            Observaciones (Opcional)
          </Label>
          <Input
            id="obs"
            placeholder="Información adicional relevante..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="h-10 text-xs"
          />
        </div>

        <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={mutation.isPending} className="text-xs">
            {mutation.isPending ? "Matriculando..." : "Confirmar Matrícula"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
