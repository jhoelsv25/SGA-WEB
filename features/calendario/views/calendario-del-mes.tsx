"use client";

import { ListToolbar } from "@/components/common/list-toolbar";
import type { ListFilterController } from "@/components/common/list-toolbar/filters";
import { calendarioFilterDefs } from "../config";
import type { EventoCalendario } from "../types";
import { diasSinClasesDe, filtrarEventos } from "../utils";
import { EventosMes } from "./eventos/eventos-mes";
import { CalendarioMes } from "./mes/calendario-mes";

interface CalendarioDelMesProps {
  anioVisible: number;
  mesVisible: number;
  anioEscolar: number;
  desde: string;
  hasta: string;
  eventos: EventoCalendario[];
  busqueda: string;
  tipo: string;
  clases: string;
  listFilters: ListFilterController;
  isRefreshing: boolean;
  onRefresh: () => void;
  puedeRegistrar: boolean;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
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
  tipo,
  clases,
  listFilters,
  isRefreshing,
  onRefresh,
  puedeRegistrar,
  onMesAnterior,
  onMesSiguiente,
  onSeleccionarDia,
  onEditar,
  onEliminar,
}: CalendarioDelMesProps) {
  const visibles = filtrarEventos(eventos, { busqueda, tipo, clases });
  const diasSinClases = diasSinClasesDe(visibles, desde, hasta);

  return (
    <div className="flex flex-col gap-4">
      <ListToolbar
        filterDefs={calendarioFilterDefs}
        listFilters={listFilters}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_20rem]">
        <CalendarioMes
          anio={anioVisible}
          mes={mesVisible}
          anioEscolar={anioEscolar}
          diasSinClases={diasSinClases}
          eventos={visibles}
          onMesAnterior={onMesAnterior}
          onMesSiguiente={onMesSiguiente}
          onSeleccionarDia={onSeleccionarDia}
          onEditar={puedeRegistrar ? onEditar : undefined}
          onEliminar={puedeRegistrar ? onEliminar : undefined}
        />
        <EventosMes
          eventos={visibles}
          filtrado={listFilters.hasActive}
          puedeRegistrar={puedeRegistrar}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      </div>
    </div>
  );
}
