"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PencilEdit01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ETIQUETAS_EVENTO } from "../../consts";
import { COLOR_EVENTO } from "../../consts/colores";
import type { EventoCalendario } from "../../types";
import { fechaLarga, formatoFecha } from "../../utils";

interface PanelDetalleProps {
  /** Evento abierto; tiene prioridad sobre el día. */
  evento: EventoCalendario | null;
  dia: string | null;
  eventosDelDia: EventoCalendario[];
  sinClases: boolean;
  puedeRegistrar: boolean;
  onCerrar: () => void;
  onAbrirEvento: (evento: EventoCalendario) => void;
  onRegistrar: (dia: string) => void;
  onEditar: (evento: EventoCalendario) => void;
  onEliminar: (evento: EventoCalendario) => void;
}

export function PanelDetalle({
  evento,
  dia,
  eventosDelDia,
  sinClases,
  puedeRegistrar,
  onCerrar,
  onAbrirEvento,
  onRegistrar,
  onEditar,
  onEliminar,
}: PanelDetalleProps) {
  return (
    <Sheet open={Boolean(evento || dia)} onOpenChange={(abierto) => !abierto && onCerrar()}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-border border-b p-5 pr-14">
          <SheetTitle>{evento ? "Detalle del evento" : dia ? fechaLarga(dia) : ""}</SheetTitle>
          <SheetDescription>
            {evento ? "Calendario escolar" : sinClases ? "Día sin clases" : "Eventos de este día"}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {evento ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-muted-foreground inline-flex items-center gap-2 text-xs font-medium">
                  <span className={cn("size-2 rounded-full", COLOR_EVENTO[evento.tipo])} />
                  {ETIQUETAS_EVENTO[evento.tipo]}
                </span>
                <p className="text-foreground text-xl font-bold break-words">{evento.titulo}</p>
                <StatusBadge tone={evento.suspendeClases ? "warning" : "neutral"}>
                  {evento.suspendeClases
                    ? evento.personalLabora
                      ? "Sin clases · el personal trabaja"
                      : "Suspende clases"
                    : "No suspende clases"}
                </StatusBadge>
              </div>

              <dl className="border-border divide-border divide-y border-y text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-muted-foreground">Desde</dt>
                  <dd className="text-foreground font-medium">
                    {formatoFecha(evento.fechaInicio)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-muted-foreground">Hasta</dt>
                  <dd className="text-foreground font-medium">{formatoFecha(evento.fechaFin)}</dd>
                </div>
              </dl>

              <div>
                <p className="text-muted-foreground text-xs font-medium">Descripción</p>
                <p className="text-foreground mt-1 text-sm whitespace-pre-line">
                  {evento.descripcion || "Sin descripción."}
                </p>
              </div>
            </div>
          ) : eventosDelDia.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay eventos para este día.</p>
          ) : (
            <ul className="divide-border border-border divide-y border-y">
              {eventosDelDia.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => onAbrirEvento(e)}
                    className="hover:bg-muted/60 focus-visible:ring-primary flex w-full items-stretch gap-3 px-1 py-3 text-left outline-none focus-visible:ring-2"
                  >
                    <span
                      aria-hidden="true"
                      className={cn("w-1 shrink-0 rounded-full", COLOR_EVENTO[e.tipo])}
                    />
                    <span className="min-w-0">
                      <span className="text-foreground block text-sm font-semibold">
                        {e.titulo}
                      </span>
                      <span className="text-muted-foreground block text-xs">
                        {ETIQUETAS_EVENTO[e.tipo]}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!puedeRegistrar && (
            <p className="text-muted-foreground mt-5 text-xs">
              Registrar, editar o eliminar requiere el permiso de calendario.
            </p>
          )}
        </div>

        {puedeRegistrar && (
          <SheetFooter className="border-border flex-row border-t p-4">
            {evento ? (
              <>
                <Button className="h-11 flex-1 gap-2" onClick={() => onEditar(evento)}>
                  <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                  Editar
                </Button>
                <Button variant="outline" className="h-11 gap-2" onClick={() => onEliminar(evento)}>
                  <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                  Eliminar
                </Button>
              </>
            ) : dia ? (
              <Button className="h-11 flex-1 gap-2" onClick={() => onRegistrar(dia)}>
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                Registrar evento en esta fecha
              </Button>
            ) : null}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
