"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  FilterIcon,
  RefreshIcon,
  UserIcon,
  SparklesIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import type { EstudianteAsociado } from "../types/dashboard.types";

interface DashboardHeaderFiltersProps {
  userName?: string;
  userAvatar?: string | null;
  rolActivo: string;
  periodoIdSeleccionado?: string;
  onPeriodoChange: (periodoId?: string) => void;
  rangoFechaSeleccionado: string;
  onRangoFechaChange: (rango: string) => void;
  estudiantesAsociados?: EstudianteAsociado[];
  estudianteSeleccionadoId?: string;
  onEstudianteChange?: (estudianteId: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  descripcion?: string;
}

function obtenerSaludo(): string {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

function formatearFechaHoy(): string {
  try {
    const str = new Intl.DateTimeFormat("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    return str.charAt(0).toUpperCase() + str.slice(1);
  } catch {
    return "";
  }
}

function obtenerIniciales(nombre?: string): string {
  if (!nombre) return "";
  const partes = nombre.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + (partes[1]?.[0] || partes[partes.length - 1][0])).toUpperCase();
}

export function DashboardHeaderFilters({
  userName,
  userAvatar,
  rolActivo,
  periodoIdSeleccionado,
  onPeriodoChange,
  rangoFechaSeleccionado,
  onRangoFechaChange,
  estudiantesAsociados,
  estudianteSeleccionadoId,
  onEstudianteChange,
  onRefresh,
  isRefreshing,
  descripcion,
}: DashboardHeaderFiltersProps) {
  const { anio, anios, seleccionar } = useAnioLectivo();
  const saludo = React.useMemo(() => obtenerSaludo(), []);
  const fechaHoy = React.useMemo(() => formatearFechaHoy(), []);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const iniciales = React.useMemo(() => obtenerIniciales(userName), [userName]);

  // Nombre del período seleccionado para mostrar en el badge del trigger
  const nombrePeriodoActual = React.useMemo(() => {
    if (!periodoIdSeleccionado || periodoIdSeleccionado === "todos") return "Todo el año";
    const bim = anio?.bimestres?.find((b) => b.id === periodoIdSeleccionado);
    return bim ? `Bimestre ${bim.nombre}` : "Período";
  }, [periodoIdSeleccionado, anio]);

  const textoRangoActual = React.useMemo(() => {
    if (rangoFechaSeleccionado === "hoy") return "Hoy";
    if (rangoFechaSeleccionado === "semana") return "7 días";
    if (rangoFechaSeleccionado === "mes") return "30 días";
    return null;
  }, [rangoFechaSeleccionado]);

  const estudianteOptions: SelectOptionItem[] = React.useMemo(() => {
    return (estudiantesAsociados || []).map((hijo) => ({
      value: hijo.id,
      label: hijo.nombreCompleto,
      description: `${hijo.grado} ${hijo.seccion}`,
    }));
  }, [estudiantesAsociados]);

  const anioOptions: SelectOptionItem[] = React.useMemo(() => {
    return anios.map((item) => ({
      value: item.id,
      label: `Año escolar ${item.anio}`,
      description: item.estado === "en_curso" ? "En curso" : undefined,
    }));
  }, [anios]);

  const periodoOptions: SelectOptionItem[] = React.useMemo(() => {
    const opts: SelectOptionItem[] = [
      { value: "todos", label: "Todo el año", description: "Consolidado anual" },
    ];
    if (anio?.bimestres) {
      anio.bimestres.forEach((bimestre) => {
        opts.push({
          value: bimestre.id,
          label: `Bimestre ${bimestre.nombre}`,
          description: bimestre.estado === "en_curso" ? "En curso" : undefined,
        });
      });
    }
    return opts;
  }, [anio]);

  const rangoOptions: SelectOptionItem[] = React.useMemo(
    () => [
      { value: "periodo", label: "Todo el período", description: "Acumulado del lapso" },
      { value: "hoy", label: "Solo hoy", description: "Métricas del día actual" },
      { value: "semana", label: "Últimos 7 días", description: "Última semana" },
      { value: "mes", label: "Últimos 30 días", description: "Últimos 30 días" },
    ],
    [],
  );

  // Panel de fondo sólido (sin degradados ni transparencias) con una franja del color primario.
  return (
    <section className="bg-card border-border border-l-primary relative rounded-2xl border border-l-4 p-4 shadow-sm sm:p-5">
      <div className="relative flex flex-col gap-4 sm:gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4 sm:items-center sm:gap-5">
          <Avatar className="ring-primary/10 border-primary/20 size-13 shrink-0 rounded-2xl border shadow-sm ring-4 sm:size-14">
            {userAvatar ? (
              <AvatarImage
                src={userAvatar}
                alt={userName || ""}
                className="rounded-2xl object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground rounded-2xl text-base font-bold select-none sm:text-lg">
              {iniciales || <HugeiconsIcon icon={UserIcon} className="size-5" />}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                {saludo}
                {userName ? `, ${userName}` : ""}
              </h1>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary gap-1 rounded-lg border-0 px-2.5 py-0.5 text-[11px] font-semibold"
              >
                <HugeiconsIcon icon={SparklesIcon} className="size-3" />
                {rolActivo || "Usuario"}
              </Badge>
            </div>

            <p className="text-muted-foreground line-clamp-1 text-xs sm:text-sm">
              {descripcion ||
                "Supervisa en tiempo real el progreso institucional, asistencia y actividades."}
            </p>

            <div className="text-muted-foreground/80 flex flex-wrap items-center gap-2 pt-0.5 text-[11px] sm:text-xs">
              <span>{fechaHoy}</span>
              {anio ? (
                <>
                  <span>·</span>
                  <span className="text-foreground/80 inline-flex items-center gap-1 font-medium">
                    <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-3.5" />
                    Año lectivo {anio.anio}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Lado derecho: Botón Popover de Filtros + Recarga Rápida */}
        <div className="flex shrink-0 items-center gap-2 self-start md:self-auto">
          {/* Selector de estudiante para Apoderados si aplica */}
          {estudiantesAsociados && estudiantesAsociados.length > 0 && onEstudianteChange && (
            <div className="w-44 sm:w-52">
              <SelectOption
                value={estudianteSeleccionadoId || estudiantesAsociados[0].id}
                onSelect={onEstudianteChange}
                options={estudianteOptions}
                placeholder="Hijo(a)"
                searchPlaceholder="Buscar estudiante..."
                className="h-9.5 rounded-xl text-xs"
              />
            </div>
          )}

          {/* Botón Popover de Filtros */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-card hover:bg-muted border-border h-9.5 gap-2 rounded-xl px-3.5 text-xs font-medium shadow-xs transition-all"
              >
                <HugeiconsIcon icon={FilterIcon} className="text-primary size-3.5" />
                <span className="hidden sm:inline">Filtros:</span>
                <span className="text-foreground font-semibold">
                  {anio?.anio || "Año"} · {nombrePeriodoActual}
                </span>
                {textoRangoActual && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary h-4.5 rounded border-0 px-1.5 py-0 text-[10px]"
                  >
                    {textoRangoActual}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="border-border/60 bg-card w-80 space-y-4 rounded-2xl p-4 shadow-xl"
            >
              <PopoverHeader className="border-border/50 border-b pb-1">
                <PopoverTitle className="flex items-center gap-1.5 text-sm font-semibold">
                  <HugeiconsIcon icon={FilterIcon} className="text-primary size-4" />
                  Filtros del Dashboard
                </PopoverTitle>
                <p className="text-muted-foreground text-[11px]">
                  Personaliza el período y las fechas para el cálculo de analíticas.
                </p>
              </PopoverHeader>

              <div className="space-y-3 pt-1 text-xs">
                {/* Año Académico */}
                {anios.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                      Año Académico
                    </Label>
                    <SelectOption
                      value={anio?.id || ""}
                      onSelect={(valor) => {
                        if (valor) seleccionar(valor);
                      }}
                      options={anioOptions}
                      placeholder="Seleccionar año"
                      searchPlaceholder="Buscar año..."
                      className="h-9 rounded-xl text-xs"
                    />
                  </div>
                )}

                {/* Período / Bimestre */}
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                    Período / Bimestre
                  </Label>
                  <SelectOption
                    value={periodoIdSeleccionado || "todos"}
                    onSelect={(val) => onPeriodoChange(val === "todos" ? undefined : val)}
                    options={periodoOptions}
                    placeholder="Todo el año"
                    searchPlaceholder="Buscar período..."
                    className="h-9 rounded-xl text-xs"
                  />
                </div>

                {/* Rango de Fechas */}
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                    Rango de Tiempo
                  </Label>
                  <SelectOption
                    value={rangoFechaSeleccionado}
                    onSelect={onRangoFechaChange}
                    options={rangoOptions}
                    placeholder="Seleccionar rango"
                    searchPlaceholder="Buscar rango..."
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="border-border/50 flex justify-end border-t pt-2">
                <Button
                  size="sm"
                  className="h-7.5 gap-1.5 rounded-lg px-3 text-xs"
                  onClick={() => setPopoverOpen(false)}
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                  Aplicar filtros
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Botón de recarga rápida */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-card hover:bg-card border-border/40 text-muted-foreground hover:text-foreground size-9.5 shrink-0 rounded-xl shadow-xs transition-all"
            title="Actualizar datos"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              className={`size-4 ${isRefreshing ? "text-primary animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>
    </section>
  );
}
