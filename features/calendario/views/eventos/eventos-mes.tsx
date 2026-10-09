"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ETIQUETAS_EVENTO } from "../../consts";
import type { EventoCalendario } from "../../types";
import { formatoFecha } from "../../utils";

interface EventosMesProps {
  eventos: EventoCalendario[];
  filtrado: boolean;
  puedeRegistrar: boolean;
  onEditar: (evento: EventoCalendario) => void;
  onEliminar: (evento: EventoCalendario) => void;
}

export function EventosMes({
  eventos,
  filtrado,
  puedeRegistrar,
  onEditar,
  onEliminar,
}: EventosMesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eventos del mes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {eventos.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {filtrado ? "Ningún evento coincide con el filtro." : "Este mes no tiene eventos."}
          </p>
        ) : (
          eventos.map((evento) => (
            <div key={evento.id} className="flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{evento.titulo}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatoFecha(evento.fechaInicio)}
                    {evento.fechaFin !== evento.fechaInicio
                      ? ` – ${formatoFecha(evento.fechaFin)}`
                      : ""}
                  </p>
                </div>
                <StatusBadge tone={evento.suspendeClases ? "warning" : "neutral"}>
                  {evento.suspendeClases ? "Sin clases" : ETIQUETAS_EVENTO[evento.tipo]}
                </StatusBadge>
              </div>
              {puedeRegistrar ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => onEditar(evento)}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5"
                    onClick={() => onEliminar(evento)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                    Eliminar
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        )}
        {!puedeRegistrar ? (
          <p className="text-muted-foreground text-xs">
            Puedes ver el calendario. Registrar, editar o eliminar requiere el permiso de
            calendario.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
