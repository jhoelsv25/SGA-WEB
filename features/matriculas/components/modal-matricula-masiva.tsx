"use client";

import * as React from "react";
import { toast } from "sonner";
import { UserGroupIcon, CheckmarkCircle02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMatriculaMasivaMutation } from "../hooks";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import { useMatriculasQuery } from "../hooks";
import type { MatriculaMasivaResponse } from "../types";

interface ModalMatriculaMasivaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalMatriculaMasiva({ open, onOpenChange }: ModalMatriculaMasivaProps) {
  const [seccionOrigenId, setSeccionOrigenId] = React.useState("");
  const [seccionDestinoId, setSeccionDestinoId] = React.useState("");
  const [desmarcados, setDesmarcados] = React.useState<Record<string, boolean>>({});
  const [resultado, setResultado] = React.useState<MatriculaMasivaResponse | null>(null);

  const { data: seccionesData, isLoading: loadingSecciones } = useSeccionesQuery();

  // Consultar estudiantes de la sección origen para seleccionar
  const { data: estudiantesOrigenData, isLoading: loadingEstudiantesOrigen } = useMatriculasQuery({
    seccionId: seccionOrigenId || undefined,
    limit: 100,
  });

  const mutation = useMatriculaMasivaMutation((res) => {
    setResultado(res);
  });

  // Estudiantes elegibles de la sección origen
  const estudiantesElegibles = React.useMemo(() => {
    if (!estudiantesOrigenData?.items) return [];
    return estudiantesOrigenData.items.filter(
      (item) => item.estado === "culminado" || item.estado === "matriculado",
    );
  }, [estudiantesOrigenData]);

  const toggleEstudiante = (id: string) => {
    setDesmarcados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTodos = () => {
    const algunoMarcado = estudiantesElegibles.some((e) => !desmarcados[e.estudiante.id]);
    if (algunoMarcado) {
      const todosDesmarcados: Record<string, boolean> = {};
      estudiantesElegibles.forEach((e) => {
        todosDesmarcados[e.estudiante.id] = true;
      });
      setDesmarcados(todosDesmarcados);
    } else {
      setDesmarcados({});
    }
  };

  const seccionDestino = React.useMemo(() => {
    return (seccionesData as Seccion[] | undefined)?.find(
      (s: Seccion) => s.id === seccionDestinoId,
    );
  }, [seccionesData, seccionDestinoId]);

  const totalMarcados = estudiantesElegibles.filter((e) => !desmarcados[e.estudiante.id]).length;
  const vacantesDisponibles = seccionDestino
    ? seccionDestino.vacantes - seccionDestino.matriculados
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seccionOrigenId) {
      toast.error("Seleccione la sección de origen.");
      return;
    }
    if (!seccionDestinoId) {
      toast.error("Seleccione la sección de destino.");
      return;
    }
    if (seccionOrigenId === seccionDestinoId) {
      toast.error("La sección de origen no puede ser igual a la sección de destino.");
      return;
    }

    const idsElegidos = estudiantesElegibles
      .filter((e) => !desmarcados[e.estudiante.id])
      .map((e) => e.estudiante.id);

    if (idsElegidos.length === 0) {
      toast.error("Debe seleccionar al menos un estudiante.");
      return;
    }

    mutation.mutate({
      seccionOrigenId,
      seccionDestinoId,
      estudianteIds: idsElegidos,
    });
  };

  const handleCerrar = () => {
    setResultado(null);
    setSeccionOrigenId("");
    setSeccionDestinoId("");
    setDesmarcados({});
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleCerrar}
      title="Promoción Masiva de Estudiantes"
      description="Seleccione la sección de procedencia y la sección de destino para matricular a los estudiantes continuadores en bloque."
      icon={UserGroupIcon}
      size="2xl"
    >
      {resultado ? (
        // Vista de Resultados de la Operación Masiva
        <div className="space-y-4 py-2">
          <div className="bg-muted/40 space-y-3 rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5 text-emerald-600" />
              <h4 className="text-foreground text-sm font-semibold">{resultado.mensaje}</h4>
            </div>
            <div className="bg-background border-border/50 grid grid-cols-3 gap-3 rounded-lg border p-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Procesados</span>
                <span className="text-foreground text-base font-bold">
                  {resultado.totalProcesados}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Matriculados</span>
                <span className="text-base font-bold text-emerald-600">
                  {resultado.totalExitosos}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">No matriculados</span>
                <span className="text-base font-bold text-amber-600">
                  {resultado.totalFallidos}
                </span>
              </div>
            </div>
          </div>

          {resultado.noMatriculados.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-xs font-semibold">
                Detalle de estudiantes no matriculados:
              </span>
              <div className="bg-background divide-border/40 max-h-48 space-y-1 divide-y overflow-y-auto rounded-lg border p-2 text-xs">
                {resultado.noMatriculados.map((item) => (
                  <div key={item.estudianteId} className="flex justify-between py-1 text-xs">
                    <span className="text-foreground font-medium">{item.estudianteNombre}</span>
                    <span className="font-medium text-amber-600">{item.motivo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={handleCerrar} className="text-xs">
              Entendido y Finalizar
            </Button>
          </div>
        </div>
      ) : (
        // Formulario de Selección
        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="origen-sel" className="text-xs font-semibold">
                Sección de Origen (Año Anterior)
              </Label>
              <Select value={seccionOrigenId} onValueChange={setSeccionOrigenId}>
                <SelectTrigger id="origen-sel" className="h-10 text-xs">
                  <SelectValue
                    placeholder={loadingSecciones ? "Cargando..." : "Seleccione salón de origen"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {(seccionesData as Seccion[] | undefined)?.map((sec: Seccion) => (
                    <SelectItem key={sec.id} value={sec.id}>
                      {sec.gradoNombre} &quot;{sec.nombre}&quot;
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="destino-sel" className="text-xs font-semibold">
                Sección Destino (Año Actual)
              </Label>
              <Select value={seccionDestinoId} onValueChange={setSeccionDestinoId}>
                <SelectTrigger id="destino-sel" className="h-10 text-xs">
                  <SelectValue
                    placeholder={loadingSecciones ? "Cargando..." : "Seleccione salón destino"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {(seccionesData as Seccion[] | undefined)
                    ?.filter((s: Seccion) => s.estado === "activa")
                    .map((sec: Seccion) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {sec.gradoNombre} &quot;{sec.nombre}&quot; (
                        {sec.vacantes - sec.matriculados} vacantes disponibles)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {seccionDestino && (
            <div className="bg-muted/40 border-border/60 flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs">
              <span className="text-muted-foreground">
                Estudiantes seleccionados:{" "}
                <strong className="text-foreground font-semibold">{totalMarcados}</strong>
              </span>
              <span className="text-muted-foreground">
                Vacantes en destino:{" "}
                <strong
                  className={
                    vacantesDisponibles < totalMarcados
                      ? "font-bold text-amber-600"
                      : "font-bold text-emerald-600"
                  }
                >
                  {vacantesDisponibles} cupos
                </strong>
              </span>
            </div>
          )}

          {/* Lista de estudiantes para desmarcar */}
          {seccionOrigenId ? (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">
                  Nómina de Estudiantes ({estudiantesElegibles.length})
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary h-7 text-xs"
                  onClick={toggleTodos}
                >
                  Alternar selección
                </Button>
              </div>

              <div className="border-border/60 bg-background divide-border/40 max-h-56 space-y-1.5 divide-y overflow-y-auto rounded-lg border p-2.5">
                {loadingEstudiantesOrigen ? (
                  <div className="text-muted-foreground py-6 text-center text-xs">
                    Cargando nómina de estudiantes...
                  </div>
                ) : estudiantesElegibles.length ? (
                  estudiantesElegibles.map((mat) => {
                    const id = mat.estudiante.id;
                    const check = !desmarcados[id];
                    return (
                      <div key={id} className="flex items-center justify-between pt-1.5 first:pt-0">
                        <label
                          htmlFor={`check-${id}`}
                          className="flex cursor-pointer items-center gap-2.5 text-xs select-none"
                        >
                          <Checkbox
                            id={`check-${id}`}
                            checked={check}
                            onCheckedChange={() => toggleEstudiante(id)}
                          />
                          <span className="text-foreground font-medium">
                            {mat.estudiante.apellidos}, {mat.estudiante.nombres}
                          </span>
                        </label>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {mat.estudiante.numeroDocumento}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-1.5 py-6">
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-5" />
                    <span className="text-xs">
                      No hay estudiantes activos o promovidos en esta sección
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border-border/80 text-muted-foreground rounded-lg border border-dashed p-6 text-center text-xs">
              Seleccione primero la sección de origen para visualizar y revisar la lista de
              estudiantes.
            </div>
          )}

          <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCerrar}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={mutation.isPending || totalMarcados === 0}
              className="text-xs"
            >
              {mutation.isPending ? "Matriculando..." : `Confirmar Matrícula (${totalMarcados})`}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
