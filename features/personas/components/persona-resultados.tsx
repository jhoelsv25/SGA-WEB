"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, UserCheck01Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePersonasQuery } from "../hooks/use-personas";
import type { Persona } from "../types/personas.types";
import { esFichaVigente, estadoFicha } from "../utils/ficha-academica";

const POR_PAGINA = 5;

/**
 * Para qué se busca la persona:
 * - docente / estudiante: una persona solo puede tener una de las dos fichas.
 * - apoderado: se bloquea a quien ya es apoderado.
 * - cuenta: se bloquea a quien ya tiene usuario.
 * - cualquiera: sin bloqueo.
 */
export type DestinoFichaUnica = "docente" | "estudiante" | "apoderado" | "cuenta" | "cualquiera";

/** Devuelve el motivo por el que la persona no puede elegirse, o null si puede. */
function motivoBloqueo(persona: Persona, destino: DestinoFichaUnica): string | null {
  if (destino === "cualquiera") return null;
  if (destino === "apoderado") return persona.fichas.esApoderado ? "Ya es apoderado" : null;
  if (destino === "cuenta") return persona.fichas.tieneUsuario ? "Ya tiene cuenta" : null;
  // docente / estudiante: solo bloquea si ya tiene esa misma ficha (viva o de baja → reactivar).
  // Si tiene la OTRA ficha vigente se permite elegirla: el formulario pedirá dar de baja esa ficha.
  const estadoDestino = estadoFicha(persona, destino);
  if (estadoDestino) {
    return esFichaVigente(destino, estadoDestino)
      ? `Ya es ${destino}`
      : `${destino === "docente" ? "Docente" : "Estudiante"} de baja: reactívelo`;
  }
  return null;
}

interface PersonaResultadosProps {
  /** Texto buscado (DNI o nombre); vacío lista el padrón completo. */
  busqueda: string;
  destino: DestinoFichaUnica;
  onSeleccionar: (persona: Persona) => void;
}

/** Tabla de resultados del padrón, de 5 en 5, con «Vincular» por fila (usar `key` para reiniciar la paginación). */
export function PersonaResultados({ busqueda, destino, onSeleccionar }: PersonaResultadosProps) {
  const [cursores, setCursores] = React.useState<(string | null)[]>([null]);
  const [pagina, setPagina] = React.useState(0);
  const [elegida, setElegida] = React.useState<Persona | null>(null);

  const { data, isFetching } = usePersonasQuery({
    search: busqueda || undefined,
    limit: POR_PAGINA,
    cursor: cursores[pagina],
  });

  const personas = data?.data ?? [];

  const siguiente = () => {
    if (!data?.nextCursor) return;
    setCursores((prev) => [...prev.slice(0, pagina + 1), data.nextCursor]);
    setPagina((prev) => prev + 1);
  };

  return (
    <div className="space-y-3">
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Nombre completo</TableHead>
              <TableHead>Cargo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching && personas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center">
                  <Spinner className="mx-auto size-5" />
                </TableCell>
              </TableRow>
            ) : personas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground py-8 text-center text-sm">
                  No se encontraron personas en el padrón.
                </TableCell>
              </TableRow>
            ) : (
              personas.map((persona) => {
                const bloqueo = motivoBloqueo(persona, destino);
                const seleccionada = elegida?.id === persona.id;
                return (
                  <TableRow
                    key={persona.id}
                    data-state={seleccionada ? "selected" : undefined}
                    aria-selected={seleccionada}
                    onClick={() => !bloqueo && setElegida(persona)}
                    onDoubleClick={() => !bloqueo && onSeleccionar(persona)}
                    className={cn(
                      bloqueo ? "opacity-60" : "cursor-pointer",
                      seleccionada && "bg-primary/10 hover:bg-primary/10",
                    )}
                  >
                    <TableCell className="font-mono text-xs">
                      {persona.tipoDocumento.toUpperCase()}: {persona.numeroDocumento}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {persona.nombreCompleto}
                      {bloqueo ? (
                        <Badge variant="outline" className="ml-2 text-[11px]">
                          {bloqueo}
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {persona.cargoVigente ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          Página {pagina + 1} · {personas.length} registros
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pagina === 0 || isFetching}
            onClick={() => setPagina((prev) => prev - 1)}
            className="h-8 gap-1 text-xs"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!data?.hasMore || isFetching}
            onClick={siguiente}
            className="h-8 gap-1 text-xs"
          >
            Siguiente
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <span className="text-muted-foreground truncate text-xs">
          {elegida
            ? `Seleccionada: ${elegida.nombreCompleto}`
            : "Selecciona una persona de la lista."}
        </span>
        <Button
          type="button"
          size="sm"
          disabled={!elegida}
          onClick={() => elegida && onSeleccionar(elegida)}
          className="h-9 gap-1.5 px-5 text-xs"
        >
          <HugeiconsIcon icon={UserCheck01Icon} className="size-3.5" />
          Aceptar
        </Button>
      </div>
    </div>
  );
}
