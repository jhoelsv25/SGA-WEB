"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { ApiClientError } from "@/lib/api-client";
import { useAniosQuery } from "@/features/anio-escolar/hooks";
import { ESTADO_ANIO } from "@/features/anio-escolar/components/anio/estados";
import { getSecciones } from "@/features/secciones/api";
import type { Seccion } from "@/features/secciones/types";
import { useMatriculaMasivaMutation, usePreviewPromocionQuery } from "../../hooks";
import type { MatriculaMasivaResponse } from "../../types";

interface MatriculaMasivaFormProps {
  onSuccess: (resultado: MatriculaMasivaResponse) => void;
  onCancel: () => void;
}

export function MatriculaMasivaForm({ onSuccess, onCancel }: MatriculaMasivaFormProps) {
  const [anioOrigenSeleccionadoId, setAnioOrigenSeleccionadoId] = React.useState("");
  const [anioDestinoSeleccionadoId, setAnioDestinoSeleccionadoId] = React.useState("");
  const [seccionOrigenId, setSeccionOrigenId] = React.useState("");
  const [seccionDestinoId, setSeccionDestinoId] = React.useState("");
  const [esRepitente, setEsRepitente] = React.useState(false);
  const [desmarcados, setDesmarcados] = React.useState<Record<string, boolean>>({});

  const { data: anios = [], isLoading: loadingAnios } = useAniosQuery(true);

  const anioOrigen = React.useMemo(() => {
    if (anios.length === 0) return null;
    if (anioOrigenSeleccionadoId) {
      const encontrado = anios.find((a) => a.id === anioOrigenSeleccionadoId);
      if (encontrado) return encontrado;
    }
    return anios.find((a) => a.estado === "cerrado") ?? anios[0] ?? null;
  }, [anios, anioOrigenSeleccionadoId]);

  const anioOrigenId = anioOrigen?.id ?? "";

  const aniosDestinoCandidatos = React.useMemo(() => {
    if (!anioOrigen) return [];
    return anios.filter(
      (a) =>
        a.id !== anioOrigen.id &&
        a.anio > anioOrigen.anio &&
        (a.estado === "planificado" || a.estado === "en_curso"),
    );
  }, [anios, anioOrigen]);

  const anioDestino = React.useMemo(() => {
    if (aniosDestinoCandidatos.length === 0) return null;
    if (anioDestinoSeleccionadoId) {
      const encontrado = aniosDestinoCandidatos.find((a) => a.id === anioDestinoSeleccionadoId);
      if (encontrado) return encontrado;
    }
    return aniosDestinoCandidatos[0] ?? null;
  }, [aniosDestinoCandidatos, anioDestinoSeleccionadoId]);

  const anioDestinoId = anioDestino?.id ?? "";

  const { data: seccionesOrigen = [], isLoading: loadingOrigen } = useQuery<
    Seccion[],
    ApiClientError
  >({
    queryKey: ["secciones", "masiva-origen", anioOrigenId],
    queryFn: () => getSecciones({ estado: "activa" }, anioOrigenId),
    enabled: Boolean(anioOrigenId),
  });

  const { data: seccionesDestino = [], isLoading: loadingDestino } = useQuery<
    Seccion[],
    ApiClientError
  >({
    queryKey: ["secciones", "masiva-destino", anioDestinoId],
    queryFn: () => getSecciones({ estado: "activa" }, anioDestinoId),
    enabled: Boolean(anioDestinoId),
  });

  const previewQuery = usePreviewPromocionQuery(seccionOrigenId, seccionDestinoId);

  const mutation = useMatriculaMasivaMutation((res) => {
    onSuccess(res);
  });

  const estudiantesElegibles = React.useMemo(
    () => previewQuery.data?.aPromover ?? [],
    [previewQuery.data],
  );

  const toggleEstudiante = (id: string) => {
    setDesmarcados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTodos = () => {
    const algunoMarcado = estudiantesElegibles.some((e) => !desmarcados[e.estudianteId]);
    const nuevo: Record<string, boolean> = {};
    estudiantesElegibles.forEach((e) => {
      nuevo[e.estudianteId] = algunoMarcado;
    });
    setDesmarcados(nuevo);
  };

  const seccionOrigen = React.useMemo(
    () => seccionesOrigen.find((s) => s.id === seccionOrigenId),
    [seccionesOrigen, seccionOrigenId],
  );

  const seccionDestino = React.useMemo(
    () => seccionesDestino.find((s) => s.id === seccionDestinoId),
    [seccionesDestino, seccionDestinoId],
  );

  const vacantesDisponiblesDestino = seccionDestino
    ? Math.max(0, seccionDestino.vacantes - seccionDestino.matriculados)
    : 0;

  const totalSeleccionados = estudiantesElegibles.filter(
    (e) => !desmarcados[e.estudianteId],
  ).length;

  const opcionesAnioOrigen: SelectOptionItem<string>[] = React.useMemo(
    () =>
      anios.map((a) => ({
        value: a.id,
        label: `Año ${a.anio}`,
        description: ESTADO_ANIO[a.estado],
      })),
    [anios],
  );

  const opcionesAnioDestino: SelectOptionItem<string>[] = React.useMemo(
    () =>
      aniosDestinoCandidatos.map((a) => ({
        value: a.id,
        label: `Año ${a.anio}`,
        description: ESTADO_ANIO[a.estado],
      })),
    [aniosDestinoCandidatos],
  );

  const seccionesOrigenOptions: SelectOptionItem<string>[] = React.useMemo(
    () =>
      seccionesOrigen
        .filter((s) => (esRepitente ? s.gradoNumero <= 5 : s.gradoNumero <= 4))
        .map((s) => ({
          value: s.id,
          label: `${s.gradoNumero}.° ${s.nombre}`,
          description: `${s.gradoNombre} · Año ${anioOrigen?.anio ?? ""}`,
        })),
    [seccionesOrigen, esRepitente, anioOrigen],
  );

  const seccionesDestinoOptions: SelectOptionItem<string>[] = React.useMemo(() => {
    if (!seccionOrigen) return [];
    const gradoEsperado = esRepitente ? seccionOrigen.gradoNumero : seccionOrigen.gradoNumero + 1;
    return seccionesDestino
      .filter((s) => s.gradoNumero === gradoEsperado && s.estado === "activa")
      .map((s) => {
        const disponibles = Math.max(0, s.vacantes - s.matriculados);
        return {
          value: s.id,
          label: `${s.gradoNumero}.° ${s.nombre}`,
          description: `${disponibles} vacantes disponibles de ${s.vacantes}`,
          disabled: disponibles <= 0,
        };
      });
  }, [seccionesDestino, seccionOrigen, esRepitente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!seccionOrigenId) return toast.error("Seleccione la sección de origen.");
    if (!seccionDestinoId) return toast.error("Seleccione la sección de destino.");
    if (totalSeleccionados === 0) return toast.error("Debe seleccionar al menos un estudiante.");

    const estudianteIds = estudiantesElegibles
      .filter((est) => !desmarcados[est.estudianteId])
      .map((est) => est.estudianteId);

    mutation.mutate({
      seccionOrigenId,
      seccionDestinoId,
      estudianteIds,
      esRepitente,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selector de Años */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Año origen (cerrado)</Label>
          <SelectOption
            options={opcionesAnioOrigen}
            value={anioOrigenId}
            onSelect={(val) => {
              setAnioOrigenSeleccionadoId(val);
              setAnioDestinoSeleccionadoId("");
              setSeccionOrigenId("");
              setSeccionDestinoId("");
              setDesmarcados({});
            }}
            placeholder={loadingAnios ? "Cargando..." : "Año origen..."}
            searchPlaceholder="Buscar año..."
            disabled={loadingAnios}
            className="h-9 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Año destino (nuevo)</Label>
          <SelectOption
            options={opcionesAnioDestino}
            value={anioDestinoId}
            onSelect={(val) => {
              setAnioDestinoSeleccionadoId(val);
              setSeccionDestinoId("");
              setDesmarcados({});
            }}
            placeholder={
              aniosDestinoCandidatos.length === 0
                ? "Cree el año siguiente primero"
                : "Año destino..."
            }
            searchPlaceholder="Buscar año..."
            disabled={loadingAnios || aniosDestinoCandidatos.length === 0}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Modo repitente */}
      <label className="bg-muted/30 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs">
        <Checkbox
          checked={esRepitente}
          onCheckedChange={(checked) => {
            setEsRepitente(Boolean(checked));
            setSeccionDestinoId("");
            setDesmarcados({});
          }}
        />
        <span>
          <strong>Modo repitentes:</strong> matricular en el mismo grado con condición de repitente
        </span>
      </label>

      {/* Sección Origen */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">
          1. Sección Origen ({anioOrigen?.anio ?? "—"}) <span className="text-destructive">*</span>
        </Label>
        <SelectOption
          options={seccionesOrigenOptions}
          value={seccionOrigenId}
          onSelect={(val) => {
            setSeccionOrigenId(val);
            setSeccionDestinoId("");
            setDesmarcados({});
          }}
          placeholder={loadingOrigen ? "Cargando..." : "Seleccionar sección origen..."}
          searchPlaceholder="Buscar sección..."
          disabled={loadingOrigen || !anioOrigenId}
          className="h-10 text-xs"
        />
      </div>

      {/* Sección Destino */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">
            2. Sección Destino ({esRepitente ? "Mismo grado" : "Grado superior"} —{" "}
            {anioDestino?.anio ?? "—"}) <span className="text-destructive">*</span>
          </Label>
          {seccionDestino ? (
            <span
              className={`text-[11px] font-semibold ${
                vacantesDisponiblesDestino >= totalSeleccionados
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {vacantesDisponiblesDestino} vacantes disponibles
            </span>
          ) : null}
        </div>
        <SelectOption
          options={seccionesDestinoOptions}
          value={seccionDestinoId}
          onSelect={(val) => {
            setSeccionDestinoId(val);
            setDesmarcados({});
          }}
          placeholder={
            !seccionOrigenId
              ? "Primero seleccione el origen..."
              : loadingDestino
                ? "Cargando..."
                : "Seleccionar sección destino..."
          }
          searchPlaceholder="Buscar sección..."
          disabled={!seccionOrigenId || loadingDestino || !anioDestinoId}
          className="h-10 text-xs"
        />
      </div>

      {/* Lista de Estudiantes elegibles */}
      {seccionOrigenId && seccionDestinoId ? (
        <div className="border-border/40 space-y-2 border-t pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">
              Estudiantes elegibles ({totalSeleccionados} de {estudiantesElegibles.length})
            </Label>
            {estudiantesElegibles.length > 0 ? (
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
            ) : null}
          </div>

          <div className="border-border/70 bg-muted/20 max-h-48 space-y-1.5 overflow-y-auto rounded-xl border p-2">
            {previewQuery.isLoading ? (
              <p className="text-muted-foreground p-3 text-center text-xs">
                Consultando estudiantes culminados...
              </p>
            ) : previewQuery.isError ? (
              <p className="text-destructive p-3 text-center text-xs">
                {previewQuery.error.message}
              </p>
            ) : estudiantesElegibles.length === 0 ? (
              <p className="text-muted-foreground p-3 text-center text-xs">
                No quedan estudiantes culminados pendientes de matricular en esta sección.
              </p>
            ) : (
              estudiantesElegibles.map((est) => {
                const estaMarcado = !desmarcados[est.estudianteId];
                return (
                  <label
                    key={est.estudianteId}
                    className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={estaMarcado}
                        onCheckedChange={() => toggleEstudiante(est.estudianteId)}
                      />
                      <span className="font-medium">{est.nombreCompleto}</span>
                    </div>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {est.numeroDocumento}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      ) : null}

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
          {mutation.isPending
            ? "Procesando..."
            : esRepitente
              ? `Matricular repitentes (${totalSeleccionados})`
              : `Matricular (${totalSeleccionados})`}
        </Button>
      </div>
    </form>
  );
}
