"use client";

import * as React from "react";
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
  if (persona.fichas.esDocente) return "Ya es docente";
  if (persona.fichas.esEstudiante) return "Ya es estudiante";
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
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching && personas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center">
                  <Spinner className="mx-auto size-5" />
                </TableCell>
              </TableRow>
            ) : personas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground py-8 text-center text-sm">
                  No se encontraron personas en el padrón.
                </TableCell>
              </TableRow>
            ) : (
              personas.map((persona) => {
                const bloqueo = motivoBloqueo(persona, destino);
                return (
                  <TableRow key={persona.id}>
                    <TableCell className="font-mono text-xs">
                      {persona.tipoDocumento.toUpperCase()}: {persona.numeroDocumento}
                    </TableCell>
                    <TableCell className="text-xs font-medium">{persona.nombreCompleto}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {persona.cargoVigente ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {bloqueo ? (
                        <Badge variant="outline" className="text-[11px]">
                          {bloqueo}
                        </Badge>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 gap-1 px-2.5 text-xs"
                          onClick={() => onSeleccionar(persona)}
                        >
                          <HugeiconsIcon icon={UserCheck01Icon} className="size-3.5" />
                          Vincular
                        </Button>
                      )}
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
    </div>
  );
}
