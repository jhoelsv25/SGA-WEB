"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    // Si hay alguno marcado (no desmarcado), desmarcar todos; de lo contrario marcar todos (vaciar desmarcados)
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
    <Dialog open={open} onOpenChange={handleCerrar}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Matrícula Masiva de Continuadores</DialogTitle>
          <DialogDescription>
            Pase una sección completa al grado siguiente respetando vacantes y orden alfabético.
          </DialogDescription>
        </DialogHeader>

        {resultado ? (
          // Vista de Resultados de la Operación Masiva
          <div className="space-y-4 py-2">
            <div className="bg-muted/30 space-y-2 rounded-md border p-4">
              <h4 className="text-foreground text-sm font-semibold">{resultado.mensaje}</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  Procesados: <span className="font-bold">{resultado.totalProcesados}</span>
                </div>
                <div className="text-emerald-600">
                  Matriculados: <span className="font-bold">{resultado.totalExitosos}</span>
                </div>
                <div className="text-amber-600">
                  No matriculados: <span className="font-bold">{resultado.totalFallidos}</span>
                </div>
              </div>
            </div>

            {resultado.noMatriculados.length > 0 && (
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold">
                  Detalle de no matriculados:
                </span>
                <div className="bg-background max-h-40 space-y-1 overflow-y-auto rounded border p-2 text-xs">
                  {resultado.noMatriculados.map((item) => (
                    <div
                      key={item.estudianteId}
                      className="flex justify-between border-b py-0.5 last:border-0"
                    >
                      <span className="font-medium">{item.estudianteNombre}</span>
                      <span className="text-muted-foreground">{item.motivo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button onClick={handleCerrar}>Entendido y Finalizar</Button>
            </DialogFooter>
          </div>
        ) : (
          // Formulario de Selección
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="origen-sel">Sección Origen</Label>
                <Select value={seccionOrigenId} onValueChange={setSeccionOrigenId}>
                  <SelectTrigger id="origen-sel">
                    <SelectValue
                      placeholder={loadingSecciones ? "Cargando..." : "Sección anterior"}
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

              <div className="space-y-1">
                <Label htmlFor="destino-sel">Sección Destino</Label>
                <Select value={seccionDestinoId} onValueChange={setSeccionDestinoId}>
                  <SelectTrigger id="destino-sel">
                    <SelectValue placeholder={loadingSecciones ? "Cargando..." : "Sección nueva"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(seccionesData as Seccion[] | undefined)
                      ?.filter((s: Seccion) => s.estado === "activa")
                      .map((sec: Seccion) => (
                        <SelectItem key={sec.id} value={sec.id}>
                          {sec.gradoNombre} &quot;{sec.nombre}&quot; (Vacantes:{" "}
                          {sec.vacantes - sec.matriculados})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {seccionDestino && (
              <div className="bg-muted/40 flex items-center justify-between rounded border px-3 py-2 text-xs">
                <span>
                  Marcados para matricular:{" "}
                  <strong className="text-foreground">{totalMarcados}</strong>
                </span>
                <span>
                  Vacantes disponibles en destino:{" "}
                  <strong
                    className={
                      vacantesDisponibles < totalMarcados
                        ? "font-bold text-amber-600"
                        : "font-bold text-emerald-600"
                    }
                  >
                    {vacantesDisponibles}
                  </strong>
                </span>
              </div>
            )}

            {/* Lista de estudiantes para desmarcar */}
            {seccionOrigenId && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Nómina de Estudiantes ({estudiantesOrigenData?.items?.length ?? 0})
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={toggleTodos}
                  >
                    Alternar todos
                  </Button>
                </div>

                <div className="divide-border/40 max-h-48 space-y-1 divide-y overflow-y-auto rounded-md border p-2">
                  {loadingEstudiantesOrigen ? (
                    <div className="text-muted-foreground py-4 text-center text-xs">
                      Cargando nómina...
                    </div>
                  ) : estudiantesElegibles.length ? (
                    estudiantesElegibles.map((mat) => {
                      const id = mat.estudiante.id;
                      const check = !desmarcados[id];
                      return (
                        <div key={id} className="flex items-center justify-between pt-1 first:pt-0">
                          <label
                            htmlFor={`check-${id}`}
                            className="flex cursor-pointer items-center gap-2 text-xs select-none"
                          >
                            <Checkbox
                              id={`check-${id}`}
                              checked={check}
                              onCheckedChange={() => toggleEstudiante(id)}
                            />
                            <span>
                              {mat.estudiante.apellidos}, {mat.estudiante.nombres}
                            </span>
                          </label>
                          <span className="text-muted-foreground font-mono text-[10px]">
                            {mat.estudiante.numeroDocumento}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-muted-foreground py-4 text-center text-xs">
                      No hay estudiantes en esta sección
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleCerrar}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending || totalMarcados === 0}>
                {mutation.isPending ? "Matriculando..." : `Matricular (${totalMarcados})`}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
