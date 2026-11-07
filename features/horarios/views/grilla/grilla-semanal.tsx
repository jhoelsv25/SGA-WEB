import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import type { BloqueHorario, BloquePropuesta, CargaItemHorario } from "../../types";
import { DIAS_SEMANA, convertirHoraAMinutos } from "../../utils";
import { CeldaBloque } from "./celda-bloque";
import { CeldaPropuesta } from "./celda-propuesta";
import { CeldaVacia } from "./celda-vacia";
import { GrillaEmptyState } from "./grilla-empty-state";
import { useFranjasHorarias } from "./hooks/use-franjas-horarias";

interface GrillaSemanalProps {
  bloques: BloqueHorario[];
  bloquesPropuestos: BloquePropuesta[];
  puedeGestionar: boolean;
  cursoSeleccionado: CargaItemHorario | null;
  onAsignarCursoASlot: (
    diaSemana: number,
    horaInicio: string,
    horaFin: string,
    tipoBloque: "clase" | "receso",
    cursoSeccionId?: string | null,
  ) => void;
  onAbrirNuevoBloque: (
    diaSemana: number,
    horaInicio?: string,
    horaFin?: string,
    tipoBloque?: "clase" | "receso",
  ) => void;
  onEditarBloque: (bloque: BloqueHorario) => void;
  onEliminarBloque: (bloque: BloqueHorario) => void;
  onProponerGrilla?: () => void;
}

export function GrillaSemanal({
  bloques,
  bloquesPropuestos,
  puedeGestionar,
  cursoSeleccionado,
  onAsignarCursoASlot,
  onAbrirNuevoBloque,
  onEditarBloque,
  onEliminarBloque,
  onProponerGrilla,
}: GrillaSemanalProps) {
  // Franjas horarias y duración base calculadas exclusivamente a partir de los datos
  const { franjas, duracionBaseClase, tieneContenido } = useFranjasHorarias(
    bloques,
    bloquesPropuestos,
  );

  // Estado vacío explicativo si no hay bloques ni grilla propuesta
  if (!tieneContenido) {
    return <GrillaEmptyState puedeGestionar={puedeGestionar} onProponerGrilla={onProponerGrilla} />;
  }

  // Rastreo de celdas cubiertas por bloques con rowSpan durante el render
  const cubiertoHastaMinuto = new Map<number, number>();

  return (
    <div className="border-border/80 bg-card w-full overflow-x-auto rounded-xl border shadow-sm">
      <table
        className="w-full min-w-180 border-collapse text-left"
        aria-label="Horario semanal de clases"
      >
        <caption className="sr-only">
          Horario semanal de clases por día y franja horaria de la sección
        </caption>
        <thead>
          <tr className="border-border/60 bg-muted/30 border-b">
            <th
              scope="col"
              className="border-border/60 bg-muted/50 text-muted-foreground sticky left-0 z-10 w-24 border-r p-3 text-center text-xs font-semibold"
            >
              <div className="flex items-center justify-center gap-1.5">
                <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground size-3.5" />
                <span>Hora</span>
              </div>
            </th>
            {DIAS_SEMANA.map((dia) => (
              <th
                key={dia.dia}
                scope="col"
                className="border-border/60 text-foreground w-[18%] border-r p-3 text-center text-xs font-bold tracking-wider uppercase last:border-r-0"
              >
                <span>{dia.nombre}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border/50 divide-y text-xs">
          {franjas.map((franja, indexFranja) => {
            const esHoraEnPunto = franja.inicio.endsWith(":00");

            return (
              <tr
                key={`${franja.inicio}-${franja.fin}`}
                className={cn(
                  "hover:bg-muted/10 h-[34px] transition-colors",
                  esHoraEnPunto && "border-t-border/70 border-t-2",
                )}
              >
                {/* Encabezado de fila con hora */}
                <th
                  scope="row"
                  className={cn(
                    "border-border/60 bg-muted/10 text-foreground sticky left-0 z-10 border-r px-2 py-0.5 text-center font-mono shadow-xs select-none",
                    esHoraEnPunto && "bg-muted/25 font-bold",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs tracking-tight",
                      esHoraEnPunto
                        ? "text-foreground font-bold"
                        : "text-muted-foreground font-normal",
                    )}
                  >
                    {franja.inicio}
                  </div>
                  <div className="text-muted-foreground/70 text-[10px] leading-none">
                    {franja.fin}
                  </div>
                </th>

                {/* Celdas por día escolar (lunes a viernes) */}
                {DIAS_SEMANA.map((dia) => {
                  const cubiertoHasta = cubiertoHastaMinuto.get(dia.dia) ?? 0;
                  if (cubiertoHasta > franja.minInicio) {
                    return null;
                  }

                  // 1. Bloque registrado existente
                  const bloqueExistente = bloques.find(
                    (b) => b.diaSemana === dia.dia && b.horaInicio === franja.inicio,
                  );

                  if (bloqueExistente) {
                    const minFinBloque = convertirHoraAMinutos(bloqueExistente.horaFin);
                    let span = 0;
                    for (let k = indexFranja; k < franjas.length; k++) {
                      if (franjas[k]!.minFin <= minFinBloque) {
                        span++;
                      } else {
                        break;
                      }
                    }
                    if (span < 1) span = 1;
                    cubiertoHastaMinuto.set(dia.dia, minFinBloque);

                    return (
                      <td
                        key={`${dia.dia}-${franja.inicio}`}
                        rowSpan={span}
                        className={cn(
                          "border-border/60 h-full border-r p-1 align-top last:border-r-0",
                          esHoraEnPunto && "border-t-border/70 border-t-2",
                        )}
                      >
                        <CeldaBloque
                          bloque={bloqueExistente}
                          duracionBaseClase={duracionBaseClase}
                          span={span}
                          puedeGestionar={puedeGestionar}
                          onEditar={onEditarBloque}
                          onEliminar={onEliminarBloque}
                        />
                      </td>
                    );
                  }

                  // 2. Franja propuesta por la API
                  const propuestaExistente = bloquesPropuestos.find(
                    (p) => p.diaSemana === dia.dia && p.horaInicio === franja.inicio,
                  );

                  if (propuestaExistente) {
                    const minFinProp = convertirHoraAMinutos(propuestaExistente.horaFin);
                    let span = 0;
                    for (let k = indexFranja; k < franjas.length; k++) {
                      if (franjas[k]!.minFin <= minFinProp) {
                        span++;
                      } else {
                        break;
                      }
                    }
                    if (span < 1) span = 1;
                    cubiertoHastaMinuto.set(dia.dia, minFinProp);

                    return (
                      <td
                        key={`${dia.dia}-${franja.inicio}`}
                        rowSpan={span}
                        className={cn(
                          "border-border/60 h-full border-r p-1 align-top last:border-r-0",
                          esHoraEnPunto && "border-t-border/70 border-t-2",
                        )}
                        onDragOver={(e) => {
                          if (!puedeGestionar || propuestaExistente.tipoBloque === "receso") return;
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "copy";
                        }}
                        onDrop={(e) => {
                          if (!puedeGestionar || propuestaExistente.tipoBloque === "receso") return;
                          e.preventDefault();
                          try {
                            const data = JSON.parse(e.dataTransfer.getData("application/json")) as {
                              cursoSeccionId: string;
                            };
                            if (data.cursoSeccionId) {
                              onAsignarCursoASlot(
                                dia.dia,
                                propuestaExistente.horaInicio,
                                propuestaExistente.horaFin,
                                "clase",
                                data.cursoSeccionId,
                              );
                            }
                          } catch {
                            // Drop no válido
                          }
                        }}
                      >
                        <CeldaPropuesta
                          propuesta={propuestaExistente}
                          diaNombre={dia.nombre}
                          span={span}
                          puedeGestionar={puedeGestionar}
                          cursoSeleccionado={cursoSeleccionado}
                          onAsignarCursoASlot={onAsignarCursoASlot}
                          onAbrirNuevoBloque={onAbrirNuevoBloque}
                        />
                      </td>
                    );
                  }

                  // 3. Franja vacía sin bloque ni propuesta
                  return (
                    <td
                      key={`${dia.dia}-${franja.inicio}`}
                      className={cn(
                        "border-border/60 border-r p-0.5 align-middle last:border-r-0",
                        esHoraEnPunto && "border-t-border/70 border-t-2",
                      )}
                    >
                      <CeldaVacia
                        diaSemana={dia.dia}
                        diaNombre={dia.nombre}
                        inicio={franja.inicio}
                        fin={franja.fin}
                        duracionSugeridaMinutos={duracionBaseClase ?? 45}
                        puedeGestionar={puedeGestionar}
                        cursoSeleccionado={cursoSeleccionado}
                        onAsignarCursoASlot={onAsignarCursoASlot}
                        onAbrirNuevoBloque={onAbrirNuevoBloque}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
