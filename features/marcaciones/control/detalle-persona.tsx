"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { EstadoSesionBadge, HorasFirmadas } from "@/features/sesiones/components/estado-sesion";
import { cn } from "@/lib/utils";
import { RESULTADOS_MARCACION_CONFIG } from "../consts";
import { useControlMensual } from "../hooks";
import type { DiaDePersona, MarcacionApi, PersonaControl } from "../types";
import {
  ESTADOS_DIA,
  ORIGENES,
  fechaLarga,
  hoyEnColegio,
  huecosAntesDelDiaUno,
  llegoTarde,
  nombreDelMes,
  sumarMeses,
} from "./utils";

interface DetallePersonaProps {
  persona: PersonaControl | null;
  onCerrar: () => void;
  puedeJustificar: boolean;
  onJustificar: (marcacion: MarcacionApi) => void;
}

export function DetallePersona({ persona, onCerrar, ...resto }: DetallePersonaProps) {
  return (
    <Sheet open={persona !== null} onOpenChange={(abierto) => !abierto && onCerrar()}>
      <SheetContent className="w-full gap-0 overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        {persona && (
          <Contenido key={`${persona.personaId}-${persona.fecha}`} persona={persona} {...resto} />
        )}
      </SheetContent>
    </Sheet>
  );
}

function Contenido({
  persona,
  puedeJustificar,
  onJustificar,
}: Omit<DetallePersonaProps, "persona" | "onCerrar"> & { persona: PersonaControl }) {
  const [fecha, setFecha] = React.useState(persona.fecha);
  const [mes, setMes] = React.useState(persona.fecha.slice(0, 7));
  const mensual = useControlMensual(persona.personaId, mes);
  // El día de la lista llega al instante; otros días salen del historial del mes.
  const dia: DiaDePersona | undefined =
    mensual.data?.dias.find((d) => d.fecha === fecha) ??
    (fecha === persona.fecha ? persona : undefined);

  return (
    <>
      <SheetHeader className="border-border/60 border-b">
        <SheetTitle className="pr-8 text-base">{persona.nombreCompleto}</SheetTitle>
        <SheetDescription>
          {persona.tipoPersona === "docentes" ? "Docente" : "Personal administrativo"} ·{" "}
          {fechaLarga(fecha)}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 p-4">
        {dia ? (
          <DetalleDelDia dia={dia} puedeJustificar={puedeJustificar} onJustificar={onJustificar} />
        ) : (
          <Skeleton className="h-40 w-full rounded-xl" />
        )}

        <section aria-labelledby="titulo-mes" className="border-border/60 space-y-3 border-t pt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 id="titulo-mes" className="text-foreground text-sm font-bold">
              {nombreDelMes(mes)}
            </h3>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-full"
                aria-label="Mes anterior"
                onClick={() => setMes((m) => sumarMeses(m, -1))}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-full"
                aria-label="Mes siguiente"
                disabled={mes >= hoyEnColegio().slice(0, 7)}
                onClick={() => setMes((m) => sumarMeses(m, 1))}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Button>
            </div>
          </div>

          {mensual.isError ? (
            <p role="alert" className="text-destructive text-xs">
              No se pudo cargar el mes.{" "}
              <button type="button" className="underline" onClick={() => void mensual.refetch()}>
                Reintentar
              </button>
            </p>
          ) : !mensual.data ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : (
            <CalendarioPersona
              mes={mes}
              dias={mensual.data.dias}
              elegido={fecha}
              onElegir={setFecha}
            />
          )}
        </section>
      </div>
    </>
  );
}

function DetalleDelDia({
  dia,
  puedeJustificar,
  onJustificar,
}: {
  dia: DiaDePersona;
  puedeJustificar: boolean;
  onJustificar: (marcacion: MarcacionApi) => void;
}) {
  const estado = ESTADOS_DIA[dia.estado];
  return (
    <>
      <section aria-labelledby="titulo-asistencia" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="titulo-asistencia" className="text-foreground text-sm font-bold">
            Asistencia del día
          </h3>
          <StatusBadge tone={estado.tone} dot>
            {estado.label}
          </StatusBadge>
        </div>
        <p className="text-muted-foreground text-xs">
          {dia.horario
            ? `Horario esperado ${dia.horario.entrada} a ${dia.horario.salida} · ${
                dia.horario.fuente === "clases" ? "según sus clases" : "turno general"
              }`
            : "No se esperaba su asistencia este día."}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(["entrada", "salida"] as const).map((tipo) => {
            const marca = dia[tipo];
            const justificable =
              marca &&
              !marca.justificada &&
              (marca.resultado === "tardanza" || marca.resultado === "salida_anticipada");
            return (
              <div key={tipo} className="border-border/60 space-y-1.5 rounded-xl border p-3">
                <p className="text-muted-foreground text-xs font-semibold">
                  {tipo === "entrada" ? "Entrada" : "Salida"}
                </p>
                <p className="text-foreground font-mono text-2xl font-bold tabular-nums">
                  {marca ? marca.fechaHora.slice(11, 16) : "—"}
                </p>
                {marca && (
                  <>
                    <StatusBadge tone={RESULTADOS_MARCACION_CONFIG[marca.resultado].tone}>
                      {RESULTADOS_MARCACION_CONFIG[marca.resultado].label}
                      {marca.minutosTardanza > 0 && ` · ${marca.minutosTardanza} min`}
                    </StatusBadge>
                    <p className="text-muted-foreground text-xs">{ORIGENES[marca.origen]}</p>
                    {marca.observacion && (
                      <p className="text-muted-foreground text-xs">{marca.observacion}</p>
                    )}
                    {marca.justificada && (
                      <p className="text-foreground text-xs">
                        <strong>Justificada:</strong> {marca.motivoJustificacion}
                      </p>
                    )}
                    {justificable && puedeJustificar && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg text-xs"
                        onClick={() => onJustificar(marca)}
                      >
                        Justificar
                      </Button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="titulo-clases" className="space-y-2">
        <h3 id="titulo-clases" className="text-foreground text-sm font-bold">
          Sesiones de clase ({dia.sesiones.filter((s) => s.horaIngreso).length} de{" "}
          {dia.sesiones.length} firmadas)
        </h3>
        {dia.sesiones.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            No hay sesiones registradas para este día.
          </p>
        ) : (
          <ol className="border-border/60 divide-border/60 divide-y rounded-xl border">
            {dia.sesiones.map((sesion) => (
              <li key={sesion.id} className="space-y-1.5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-foreground text-sm font-semibold">
                    <span className="font-mono">
                      {sesion.horaInicio}–{sesion.horaFin}
                    </span>{" "}
                    · {sesion.cursoNombre} · {sesion.seccionNombre}
                  </p>
                  <EstadoSesionBadge sesion={sesion} />
                </div>
                <p className="text-muted-foreground flex flex-wrap gap-x-2 text-xs">
                  <span>
                    Firma: <HorasFirmadas sesion={sesion} />
                  </span>
                  {sesion.tema && <span>Tema: {sesion.tema}</span>}
                </p>
                {sesion.observaciones && (
                  <p className="text-muted-foreground text-xs">{sesion.observaciones}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}

function CalendarioPersona({
  mes,
  dias,
  elegido,
  onElegir,
}: {
  mes: string;
  dias: DiaDePersona[];
  elegido: string;
  onElegir: (fecha: string) => void;
}) {
  const asistidos = dias.filter((d) => d.entrada).length;
  const tardanzas = dias.filter(llegoTarde).length;
  const sinMarca = dias.filter((d) => d.estado === "sin_marca").length;
  const sesiones = dias.flatMap((d) => d.sesiones);

  if (dias.length === 0) {
    return <p className="text-muted-foreground text-xs">Este mes todavía no empieza.</p>;
  }

  return (
    <div className="space-y-3">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
        {[
          ["Días con entrada", asistidos],
          ["Tardanzas", tardanzas],
          ["Días sin marca", sinMarca],
          ["Clases firmadas", `${sesiones.filter((s) => s.horaIngreso).length}/${sesiones.length}`],
        ].map(([etiqueta, valor]) => (
          <div key={etiqueta}>
            <dt className="text-muted-foreground">{etiqueta}</dt>
            <dd className="text-foreground text-lg font-bold tabular-nums">{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((d) => (
          <span key={d} className="text-muted-foreground text-xs font-semibold">
            {d}
          </span>
        ))}
        {Array.from({ length: huecosAntesDelDiaUno(mes) }, (_, i) => (
          <span key={`hueco-${i}`} />
        ))}
        {dias.map((d) => (
          <button
            key={d.fecha}
            type="button"
            onClick={() => onElegir(d.fecha)}
            aria-pressed={d.fecha === elegido}
            aria-label={`${fechaLarga(d.fecha)}: ${ESTADOS_DIA[d.estado].label}${
              llegoTarde(d) ? ", con tardanza" : ""
            }`}
            title={ESTADOS_DIA[d.estado].label}
            className={cn(
              "focus-visible:ring-primary relative flex h-10 items-center justify-center rounded-lg text-xs font-semibold tabular-nums outline-none focus-visible:ring-2",
              ESTADOS_DIA[d.estado].celda,
              d.fecha === elegido && "ring-primary ring-2",
            )}
          >
            {Number(d.fecha.slice(8))}
            {llegoTarde(d) && (
              <span className="bg-warning absolute top-1 right-1 size-1.5 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <ul className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {(["completo", "en_el_colegio", "sin_salida", "sin_marca", "no_corresponde"] as const).map(
          (estado) => (
            <li key={estado} className="flex items-center gap-1.5">
              <span className={cn("size-3 rounded", ESTADOS_DIA[estado].celda)} />
              {estado === "sin_salida" ? "Falta una marca" : ESTADOS_DIA[estado].label}
            </li>
          ),
        )}
        <li className="flex items-center gap-1.5">
          <span className="bg-warning size-1.5 rounded-full" />
          Tardanza
        </li>
      </ul>
    </div>
  );
}
