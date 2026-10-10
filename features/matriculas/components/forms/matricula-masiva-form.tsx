"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMatriculaMasivaMutation, useMatriculasQuery } from "../../hooks";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import type { MatriculaMasivaResponse } from "../../types";

interface MatriculaMasivaFormProps {
  onSuccess: (resultado: MatriculaMasivaResponse) => void;
  onCancel: () => void;
}

export function MatriculaMasivaForm({ onSuccess, onCancel }: MatriculaMasivaFormProps) {
  const [seccionOrigenId, setSeccionOrigenId] = React.useState("");
  const [seccionDestinoId, setSeccionDestinoId] = React.useState("");
  const [desmarcados, setDesmarcados] = React.useState<Record<string, boolean>>({});

  const { data: seccionesData, isLoading: loadingSecciones } = useSeccionesQuery();

  const { data: estudiantesOrigenData, isLoading: loadingEstudiantesOrigen } = useMatriculasQuery({
    seccionId: seccionOrigenId || undefined,
    limit: 100,
  });

  const mutation = useMatriculaMasivaMutation((res) => {
    onSuccess(res);
  });

  const estudiantesElegibles = React.useMemo(() => {
    if (!estudiantesOrigenData?.data) return [];
    return estudiantesOrigenData.data.filter(
      (item) => item.estado === "culminado" || item.estado === "matriculado",
    );
  }, [estudiantesOrigenData]);

  const toggleEstudiante = (id: string) => {
    setDesmarcados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTodos = () => {
    const algunoMarcado = estudiantesElegibles.some((e) => !desmarcados[e.estudiante.id]);
    const nuevo: Record<string, boolean> = {};
    estudiantesElegibles.forEach((e) => {
      nuevo[e.estudiante.id] = algunoMarcado;
    });
    setDesmarcados(nuevo);
  };

  const seccionOrigen = React.useMemo(
    () => (seccionesData as Seccion[] | undefined)?.find((s) => s.id === seccionOrigenId),
    [seccionesData, seccionOrigenId],
  );

  const seccionDestino = React.useMemo(
    () => (seccionesData as Seccion[] | undefined)?.find((s) => s.id === seccionDestinoId),
    [seccionesData, seccionDestinoId],
  );

  const vacantesDisponiblesDestino = seccionDestino
    ? Math.max(0, seccionDestino.vacantes - seccionDestino.matriculados)
    : 0;

  const totalSeleccionados = estudiantesElegibles.filter(
    (e) => !desmarcados[e.estudiante.id],
  ).length;

  const seccionesOrigenOptions: SelectOptionItem<string>[] = React.useMemo(() => {
    return ((seccionesData as Seccion[] | undefined) ?? []).map((s) => ({
      value: s.id,
      label: `${s.gradoNumero}.° ${s.nombre} (${s.anioAcademicoId ? "Sección" : ""})`,
      description: `${s.matriculados} alumnos registrados`,
    }));
  }, [seccionesData]);

  const seccionesDestinoOptions: SelectOptionItem<string>[] = React.useMemo(() => {
    if (!seccionOrigen) return [];
    const gradoDestino = seccionOrigen.gradoNumero + 1;
    return ((seccionesData as Seccion[] | undefined) ?? [])
      .filter((s) => s.gradoNumero === gradoDestino && s.estado === "activa")
      .map((s) => {
        const disponibles = Math.max(0, s.vacantes - s.matriculados);
        return {
          value: s.id,
          label: `${s.gradoNumero}.° ${s.nombre}`,
          description: `${disponibles} vacantes disponibles de ${s.vacantes}`,
          disabled: disponibles <= 0,
        };
      });
  }, [seccionesData, seccionOrigen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!seccionOrigenId) return toast.error("Seleccione la sección de origen.");
    if (!seccionDestinoId) return toast.error("Seleccione la sección de destino.");
    if (totalSeleccionados === 0) return toast.error("Debe seleccionar al menos un estudiante.");

    const estudianteIds = estudiantesElegibles
      .filter((e) => !desmarcados[e.estudiante.id])
      .map((e) => e.estudiante.id);

    mutation.mutate({
      seccionOrigenId,
      seccionDestinoId,
      estudianteIds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sección Origen */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">
          1. Sección Origen (Año Anterior) <span className="text-destructive">*</span>
        </Label>
        <SelectOption
          options={seccionesOrigenOptions}
          value={seccionOrigenId}
          onSelect={(val) => {
            setSeccionOrigenId(val);
            setSeccionDestinoId("");
            setDesmarcados({});
          }}
          placeholder={loadingSecciones ? "Cargando..." : "Seleccionar sección origen..."}
          searchPlaceholder="Buscar sección..."
          disabled={loadingSecciones}
          className="h-10 text-xs"
        />
      </div>

      {/* Sección Destino */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">
            2. Sección Destino (Grado Inmediato Superior){" "}
            <span className="text-destructive">*</span>
          </Label>
          {seccionDestino && (
            <span
              className={`text-[11px] font-semibold ${
                vacantesDisponiblesDestino >= totalSeleccionados
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {vacantesDisponiblesDestino} vacantes disponibles
            </span>
          )}
        </div>
        <SelectOption
          options={seccionesDestinoOptions}
          value={seccionDestinoId}
          onSelect={(val) => setSeccionDestinoId(val)}
          placeholder={
            !seccionOrigenId ? "Primero seleccione el origen..." : "Seleccionar sección destino..."
          }
          searchPlaceholder="Buscar sección..."
          disabled={!seccionOrigenId || loadingSecciones}
          className="h-10 text-xs"
        />
      </div>

      {/* Lista de Estudiantes con Checkbox */}
      {seccionOrigenId && (
        <div className="border-border/40 space-y-2 border-t pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">
              Estudiantes a Matricular ({totalSeleccionados} de {estudiantesElegibles.length})
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleTodos}
              className="text-primary h-7 px-2 text-xs"
            >
              {totalSeleccionados === estudiantesElegibles.length
                ? "Desmarcar todos"
                : "Marcar todos"}
            </Button>
          </div>

          <div className="border-border/70 bg-muted/20 max-h-48 space-y-1.5 overflow-y-auto rounded-xl border p-2">
            {loadingEstudiantesOrigen ? (
              <p className="text-muted-foreground p-3 text-center text-xs">Cargando nómina...</p>
            ) : estudiantesElegibles.length === 0 ? (
              <p className="text-muted-foreground p-3 text-center text-xs">
                No hay estudiantes promovidos o culminados en esta sección.
              </p>
            ) : (
              estudiantesElegibles.map((item) => {
                const est = item.estudiante;
                const estaMarcado = !desmarcados[est.id];
                return (
                  <div
                    key={est.id}
                    onClick={() => toggleEstudiante(est.id)}
                    className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={estaMarcado}
                        onCheckedChange={() => toggleEstudiante(est.id)}
                      />
                      <span className="font-medium">
                        {est.apellidos}, {est.nombres}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {est.numeroDocumento}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Botones */}
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
          disabled={
            mutation.isPending || !seccionOrigenId || !seccionDestinoId || totalSeleccionados === 0
          }
          className="h-9 rounded-full px-4 text-xs shadow-xs"
        >
          {mutation.isPending ? "Procesando..." : `Matricular (${totalSeleccionados})`}
        </Button>
      </div>
    </form>
  );
}
