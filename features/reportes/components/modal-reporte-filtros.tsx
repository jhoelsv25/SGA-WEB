"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { DatePicker } from "@/components/common/date-picker";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type FiltrosConfigReporte,
  MESES_ANIO,
  OPCIONES_ESTADO_MATRICULA,
  OPCIONES_TIPO_PERSONA,
  OPCIONES_TIPO_PERSONAL,
} from "../constants";
import { formatearFechaIso, parsearFechaIso } from "../utils";

export interface ModalReporteFiltrosProps {
  cfg: FiltrosConfigReporte;
  sinFiltros: boolean;
  anioNumero?: number;
  cargandoCursos: boolean;
  valores: {
    periodoSel: string;
    gradoId: string;
    seccionId: string;
    cursoSeccionId: string;
    estadoMatricula: string;
    tipoPersona: string;
    desde: string;
    hasta: string;
    tieneFechasManuales: boolean;
    mesNumero: string;
    busqueda: string;
  };
  opciones: {
    periodo: SelectOptionItem<string>[];
    grado: SelectOptionItem<string>[];
    seccion: SelectOptionItem<string>[];
    curso: SelectOptionItem<string>[];
  };
  acciones: {
    cambiarPeriodo: (val: string) => void;
    cambiarGrado: (val: string) => void;
    cambiarSeccion: (val: string) => void;
    setCursoSeccionId: (val: string) => void;
    setEstadoMatricula: (val: string) => void;
    setTipoPersona: (val: string) => void;
    setDesdeManual: (val: string) => void;
    setHastaManual: (val: string) => void;
    restaurarFechasBimestre: () => void;
    setMesNumero: (val: string) => void;
    setBusqueda: (val: string) => void;
  };
}

export function ModalReporteFiltros({
  cfg,
  sinFiltros,
  anioNumero,
  cargandoCursos,
  valores,
  opciones,
  acciones,
}: ModalReporteFiltrosProps) {
  if (sinFiltros) {
    return (
      <p className="text-muted-foreground text-xs">
        Este reporte no requiere filtros adicionales. Se generará con toda la información vigente.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cfg.periodo ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold">
            Período (Bimestre){" "}
            {cfg.periodoObligatorio ? <span className="text-destructive">*</span> : null}
          </Label>
          <SelectOption
            options={opciones.periodo}
            value={valores.periodoSel}
            onSelect={acciones.cambiarPeriodo}
            placeholder="Seleccionar bimestre..."
            searchPlaceholder="Buscar bimestre..."
            className="h-9 text-xs"
          />
        </div>
      ) : null}

      {cfg.grado ? (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Grado</Label>
          <SelectOption
            options={opciones.grado}
            value={valores.gradoId}
            onSelect={acciones.cambiarGrado}
            placeholder="Todos los grados"
            searchPlaceholder="Buscar grado..."
            className="h-9 text-xs"
          />
        </div>
      ) : null}

      {cfg.seccion ? (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            Sección {cfg.seccionObligatoria ? <span className="text-destructive">*</span> : null}
          </Label>
          <SelectOption
            options={opciones.seccion}
            value={valores.seccionId}
            onSelect={acciones.cambiarSeccion}
            placeholder={
              cfg.seccionObligatoria ? "Seleccione una sección..." : "Todas las secciones"
            }
            searchPlaceholder="Buscar sección..."
            className="h-9 text-xs"
          />
        </div>
      ) : null}

      {cfg.curso ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold">
            Curso <span className="text-destructive">*</span>
          </Label>
          <SelectOption
            options={opciones.curso}
            value={valores.cursoSeccionId}
            onSelect={acciones.setCursoSeccionId}
            placeholder={
              valores.seccionId === "all"
                ? "Primero elija una sección..."
                : cargandoCursos
                  ? "Cargando cursos..."
                  : "Seleccionar curso..."
            }
            searchPlaceholder="Buscar curso..."
            disabled={valores.seccionId === "all" || cargandoCursos}
            className="h-9 text-xs"
          />
        </div>
      ) : null}

      {cfg.estadoMatricula ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold">Estado de matrícula</Label>
          <SelectOption
            options={OPCIONES_ESTADO_MATRICULA}
            value={valores.estadoMatricula}
            onSelect={acciones.setEstadoMatricula}
            placeholder="Todos los estados"
            className="h-9 text-xs"
          />
        </div>
      ) : null}

      {cfg.tipoPersona ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold">Tipo de persona</Label>
          <SelectOption
            options={OPCIONES_TIPO_PERSONA}
            value={valores.tipoPersona}
            onSelect={acciones.setTipoPersona}
            placeholder="Todos"
            className="h-9 text-xs"
          />
        </div>
      ) : null}

      {cfg.tipoPersonal ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold">Personal</Label>
          <SelectOption
            options={OPCIONES_TIPO_PERSONAL}
            value={valores.tipoPersona}
            onSelect={acciones.setTipoPersona}
            placeholder="Todo el personal"
            className="h-9 text-xs"
          />
        </div>
      ) : null}

      {cfg.mes ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold">
            Mes calendario ({anioNumero ?? new Date().getFullYear()})
          </Label>
          <SelectOption
            options={MESES_ANIO}
            value={valores.mesNumero}
            onSelect={acciones.setMesNumero}
            placeholder="Elegir mes..."
            searchPlaceholder="Buscar mes..."
            className="h-9 text-xs"
          />
        </div>
      ) : null}

      {cfg.fechas ? (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Desde</Label>
            <DatePicker
              date={parsearFechaIso(valores.desde)}
              onSelect={(d) => acciones.setDesdeManual(formatearFechaIso(d))}
              dateFormat="dd/MM/yyyy"
              placeholder="Fecha de inicio"
              clearable
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Hasta</Label>
              {valores.tieneFechasManuales ? (
                <button
                  type="button"
                  onClick={acciones.restaurarFechasBimestre}
                  className="text-primary inline-flex items-center gap-1 text-[11px] hover:underline"
                >
                  <HugeiconsIcon icon={RefreshIcon} className="size-3" />
                  Fechas del bimestre
                </button>
              ) : null}
            </div>
            <DatePicker
              date={parsearFechaIso(valores.hasta)}
              onSelect={(d) => acciones.setHastaManual(formatearFechaIso(d))}
              dateFormat="dd/MM/yyyy"
              placeholder="Fecha de fin"
              clearable
            />
          </div>
        </>
      ) : null}

      {cfg.busqueda ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold">Búsqueda rápida (opcional)</Label>
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
            />
            <Input
              value={valores.busqueda}
              onChange={(e) => acciones.setBusqueda(e.target.value)}
              placeholder="Filtrar por nombre, apellido, DNI o código..."
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
