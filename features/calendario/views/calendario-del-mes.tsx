"use client";

import * as React from "react";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Checkbox } from "@/components/ui/checkbox";
import type { ListFilterController } from "@/components/common/list-toolbar/filters";
import { calendarioFilterDefs } from "../config";
import { ETIQUETAS_EVENTO } from "../consts";
import { CASILLA_EVENTO } from "../consts/colores";
import { TIPOS_EVENTO, type EventoCalendario } from "../types";
import { diasSinClasesDe, filtrarEventos } from "../utils";
import { PanelDetalle } from "./detalle/panel-detalle";
import { MiniCalendario } from "./lateral/mini-calendario";
import { CalendarioMes } from "./mes/calendario-mes";
import { NavegacionMes } from "./mes/navegacion-mes";

// Los tipos se marcan con las casillas; no se repiten en la barra de filtros.
const filtrosBarra = calendarioFilterDefs.filter((f) => f.type !== "multiSelect");

interface CalendarioDelMesProps {
  anioVisible: number;
  mesVisible: number;
  anioEscolar: number;
  desde: string;
  hasta: string;
  eventos: EventoCalendario[];
  busqueda: string;
  ocultos: string[];
  clases: string;
  listFilters: ListFilterController;
  isRefreshing: boolean;
  onRefresh: () => void;
  puedeRegistrar: boolean;
  acciones?: React.ReactNode;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onHoy: () => void;
  onSeleccionarDia?: (iso: string) => void;
  onEditar: (evento: EventoCalendario) => void;
  onEliminar: (evento: EventoCalendario) => void;
}

export function CalendarioDelMes({
  anioVisible,
  mesVisible,
  anioEscolar,
  desde,
  hasta,
  eventos,
  busqueda,
  ocultos,
  clases,
  listFilters,
  isRefreshing,
  onRefresh,
  puedeRegistrar,
  acciones,
  onMesAnterior,
  onMesSiguiente,
  onHoy,
  onSeleccionarDia,
  onEditar,
  onEliminar,
}: CalendarioDelMesProps) {
  const [dia, setDia] = React.useState<string | null>(null);
  const [eventoId, setEventoId] = React.useState<string | null>(null);

  // Las casillas cuentan según la búsqueda y el filtro de clases, sin importar lo marcado.
  const sinFiltroTipo = filtrarEventos(eventos, { busqueda, ocultos: [], clases });
  const visibles = filtrarEventos(eventos, { busqueda, ocultos, clases });
  const diasSinClases = diasSinClasesDe(visibles, desde, hasta);

  const marcados = TIPOS_EVENTO.filter((t) => !ocultos.includes(t));
  const estadoTodos =
    marcados.length === TIPOS_EVENTO.length ? true : marcados.length ? "indeterminate" : false;
  const alternar = (tipo: string) =>
    listFilters.setMultiFilter(
      "ocultar",
      ocultos.includes(tipo) ? ocultos.filter((t) => t !== tipo) : [...ocultos, tipo],
    );

  const casillas = [
    {
      valor: "todos",
      etiqueta: "Todos",
      total: sinFiltroTipo.length,
      color: "",
      estado: estadoTodos as boolean | "indeterminate",
      cambiar: () =>
        listFilters.setMultiFilter("ocultar", estadoTodos === true ? [...TIPOS_EVENTO] : []),
    },
    ...TIPOS_EVENTO.map((t) => ({
      valor: t,
      etiqueta: ETIQUETAS_EVENTO[t],
      total: sinFiltroTipo.filter((e) => e.tipo === t).length,
      color: CASILLA_EVENTO[t],
      estado: !ocultos.includes(t) as boolean | "indeterminate",
      cambiar: () => alternar(t),
    })),
  ];

  const eventoAbierto = visibles.find((e) => e.id === eventoId) ?? null;
  const cerrar = () => {
    setDia(null);
    setEventoId(null);
  };
  const abrirDia = (iso: string) => {
    setEventoId(null);
    setDia(iso);
  };
  const abrirEvento = (evento: EventoCalendario) => setEventoId(evento.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Barra superior: navegación del mes y búsqueda */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <NavegacionMes
          anio={anioVisible}
          mes={mesVisible}
          onMesAnterior={onMesAnterior}
          onMesSiguiente={onMesSiguiente}
          onHoy={onHoy}
        />
        <ListToolbar
          className="min-w-0 flex-1"
          filterDefs={filtrosBarra}
          listFilters={listFilters}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-4">
        <aside className="flex shrink-0 flex-col gap-4 lg:w-56 lg:overflow-y-auto">
          {acciones}
          <div className="hidden lg:block">
            <MiniCalendario
              anio={anioVisible}
              mes={mesVisible}
              onMesAnterior={onMesAnterior}
              onMesSiguiente={onMesSiguiente}
              onAbrirDia={abrirDia}
            />
          </div>
          <div role="group" aria-labelledby="calendario-tipos">
            <p id="calendario-tipos" className="text-foreground mb-1 text-sm font-semibold">
              Tipos de evento
            </p>
            <div className="flex flex-wrap gap-x-5 lg:flex-col">
              {casillas.map((c) => (
                <label
                  key={c.valor}
                  className="text-foreground flex min-h-8 cursor-pointer items-center gap-2.5 text-sm select-none pointer-coarse:min-h-11"
                >
                  <Checkbox checked={c.estado} onCheckedChange={c.cambiar} className={c.color} />
                  <span className="min-w-0 flex-1 truncate">{c.etiqueta}</span>
                  <span className="text-muted-foreground text-xs tabular-nums">{c.total}</span>
                </label>
              ))}
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Año académico {anioEscolar}. Los días sin clases se ven con fondo amarillo.
          </p>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          {visibles.length === 0 && (
            <p className="text-muted-foreground text-sm" role="status">
              {listFilters.hasActive
                ? "Ningún evento coincide con el filtro."
                : "Este mes no tiene eventos."}
            </p>
          )}
          <CalendarioMes
            anio={anioVisible}
            mes={mesVisible}
            diasSinClases={diasSinClases}
            eventos={visibles}
            onAbrirDia={abrirDia}
            onAbrirEvento={abrirEvento}
          />
        </div>
      </div>

      <PanelDetalle
        evento={eventoAbierto}
        dia={dia}
        eventosDelDia={visibles.filter((e) => dia && e.fechaInicio <= dia && e.fechaFin >= dia)}
        sinClases={Boolean(dia && diasSinClases.includes(dia))}
        puedeRegistrar={puedeRegistrar}
        onCerrar={cerrar}
        onAbrirEvento={abrirEvento}
        // El panel se cierra antes de abrir el formulario o la confirmación
        onRegistrar={(iso) => {
          cerrar();
          onSeleccionarDia?.(iso);
        }}
        onEditar={(evento) => {
          cerrar();
          onEditar(evento);
        }}
        onEliminar={(evento) => {
          cerrar();
          onEliminar(evento);
        }}
      />
    </div>
  );
}
