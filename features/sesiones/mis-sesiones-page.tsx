"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen01Icon,
  FileEditIcon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectorBimestre, useRangoBimestre } from "@/features/asistencia/components";
import { cn } from "@/lib/utils";
import { ModalTexto } from "./components";
import { getMisSesionesColumns } from "./views";
import { useCorregirTema, useMisSesiones, useSolicitarJustificacion } from "./hooks";
import type { Sesion } from "./types";

type Accion = { tipo: "tema" | "justificar"; sesion: Sesion } | null;
type FiltroEstado = "todas" | "cumplidas" | "parciales" | "no_cumplidas";

export function MisSesionesPage() {
  const { bimestres, bimestreId, setElegido, rango } = useRangoBimestre();
  const { data, isLoading, isError, error, refetch } = useMisSesiones(rango);
  const [accion, setAccion] = React.useState<Accion>(null);
  const [busqueda, setBusqueda] = React.useState("");
  const [filtro, setFiltro] = React.useState<FiltroEstado>("todas");

  const tema = useCorregirTema();
  const justificar = useSolicitarJustificacion();
  const cerrar = () => setAccion(null);

  const handleCorregirTema = React.useCallback((sesion: Sesion) => {
    setAccion({ tipo: "tema", sesion });
  }, []);

  const handleSolicitarJustificacion = React.useCallback((sesion: Sesion) => {
    setAccion({ tipo: "justificar", sesion });
  }, []);

  const columns = React.useMemo(
    () =>
      getMisSesionesColumns({
        onCorregirTema: handleCorregirTema,
        onSolicitarJustificacion: handleSolicitarJustificacion,
      }),
    [handleCorregirTema, handleSolicitarJustificacion],
  );

  const sesionesFiltradas = React.useMemo(() => {
    if (!data?.sesiones) return [];
    return data.sesiones.filter((s) => {
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase().trim();
        const coincide =
          s.cursoNombre.toLowerCase().includes(query) ||
          s.seccionNombre.toLowerCase().includes(query) ||
          (s.tema && s.tema.toLowerCase().includes(query));
        if (!coincide) return false;
      }
      if (filtro === "cumplidas") return s.estado === "cumplida";
      if (filtro === "parciales") return s.estado === "parcial";
      if (filtro === "no_cumplidas") return s.estado === "no_cumplida";
      return true;
    });
  }, [data, busqueda, filtro]);

  const esNoDocente =
    error &&
    ((error as unknown as { status?: number }).status === 403 ||
      error.message?.toLowerCase().includes("docente"));

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Mis sesiones"
        description="Historial de sus sesiones con tema, horas firmadas, estado y minutos perdidos."
        icon={BookOpen01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mis sesiones" }]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SelectorBimestre bimestres={bimestres} valor={bimestreId} onCambiar={setElegido} />
      </div>

      {esNoDocente ? (
        <div className="bg-card border-border/60 flex flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-xs">
          <div className="bg-warning/10 text-warning mb-3 flex size-12 items-center justify-center rounded-full">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-6" />
          </div>
          <h3 className="text-foreground text-base font-bold">Vista exclusiva para docentes</h3>
          <p className="text-muted-foreground mt-1 max-w-md text-xs leading-relaxed">
            Tu cuenta no está vinculada a un docente activo. Como personal directivo o de
            administración, puedes supervisar las clases de todo el colegio en el panel general.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/admin/sesiones-hoy"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Ir a Sesiones de hoy
            </Link>
          </div>
        </div>
      ) : (
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          errorTitle="No se pudieron cargar sus sesiones"
        >
          {data && (
            <div className="space-y-4">
              {/* Tarjetas KPI de Resumen */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs">
                  <span className="flex items-center justify-between text-xs font-semibold text-emerald-700 uppercase dark:text-emerald-400">
                    <span>Cumplidas</span>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                  </span>
                  <p className="mt-1 text-2xl font-black text-emerald-700 tabular-nums dark:text-emerald-400">
                    {data.totales.cumplidas}
                  </p>
                  <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                    Completadas a tiempo
                  </span>
                </div>

                <div
                  className={`rounded-2xl border p-4 shadow-xs ${
                    data.totales.parciales > 0
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-border/80 bg-card"
                  }`}
                >
                  <span className="text-muted-foreground flex items-center justify-between text-xs font-semibold uppercase">
                    <span>Parciales</span>
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      className={`size-4 ${data.totales.parciales > 0 ? "text-amber-500" : "text-muted-foreground"}`}
                    />
                  </span>
                  <p
                    className={`mt-1 text-2xl font-black tabular-nums ${
                      data.totales.parciales > 0
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-foreground"
                    }`}
                  >
                    {data.totales.parciales}
                  </p>
                  <span className="text-muted-foreground text-[11px]">Con tiempo incompleto</span>
                </div>

                <div
                  className={`rounded-2xl border p-4 shadow-xs ${
                    data.totales.noCumplidas > 0
                      ? "border-rose-500/30 bg-rose-500/5"
                      : "border-border/80 bg-card"
                  }`}
                >
                  <span className="text-muted-foreground flex items-center justify-between text-xs font-semibold uppercase">
                    <span>No cumplidas</span>
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      className={`size-4 ${data.totales.noCumplidas > 0 ? "text-rose-500" : "text-emerald-500"}`}
                    />
                  </span>
                  <p
                    className={`mt-1 text-2xl font-black tabular-nums ${
                      data.totales.noCumplidas > 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-foreground"
                    }`}
                  >
                    {data.totales.noCumplidas}
                  </p>
                  <span className="text-muted-foreground text-[11px]">Sin registro de firma</span>
                </div>

                <div className="border-border/80 bg-card rounded-2xl border p-4 shadow-xs">
                  <span className="text-muted-foreground flex items-center justify-between text-xs font-semibold uppercase">
                    <span>Justificadas</span>
                    <HugeiconsIcon icon={FileEditIcon} className="text-primary size-4" />
                  </span>
                  <p className="text-foreground mt-1 text-2xl font-black tabular-nums">
                    {data.totales.justificadas}
                  </p>
                  <span className="text-muted-foreground text-[11px]">Con sustento aprobado</span>
                </div>
              </div>

              {/* Barra de Filtro y Búsqueda */}
              <div className="border-border/80 bg-card flex flex-col justify-between gap-3 rounded-2xl border p-3.5 shadow-xs sm:flex-row sm:items-center">
                <div className="relative max-w-sm min-w-60 flex-1">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
                  />
                  <Input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por curso, sección o tema..."
                    className="h-8.5 rounded-xl pl-8.5 text-xs shadow-2xs"
                    aria-label="Buscar sesión"
                  />
                </div>

                <div className="bg-muted/60 border-border/60 inline-flex flex-wrap items-center gap-1 rounded-xl border p-1 shadow-inner">
                  {(
                    [
                      { id: "todas", label: `Todas (${data.sesiones.length})` },
                      { id: "cumplidas", label: `Cumplidas (${data.totales.cumplidas})` },
                      { id: "parciales", label: `Parciales (${data.totales.parciales})` },
                      { id: "no_cumplidas", label: `No cumplidas (${data.totales.noCumplidas})` },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFiltro(t.id)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all select-none",
                        filtro === t.id
                          ? "bg-card text-foreground font-bold shadow-xs"
                          : "text-muted-foreground hover:bg-card/40 hover:text-foreground",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <DataTable
                columns={columns}
                data={sesionesFiltradas}
                pagination={false}
                emptyState={{
                  title: busqueda ? "No se encontraron sesiones" : "Sin sesiones en este periodo",
                  description: busqueda
                    ? `No hay sesiones que coincidan con «${busqueda}».`
                    : "Elija otro bimestre para ver su historial.",
                }}
              />
            </div>
          )}
        </PageState>
      )}

      <ModalTexto
        abierto={accion?.tipo === "tema"}
        clave={`tema-${accion?.sesion.id ?? ""}`}
        onOpenChange={(abierto) => !abierto && cerrar()}
        titulo="Corregir tema"
        descripcion={
          accion ? `${accion.sesion.cursoNombre} · ${accion.sesion.seccionNombre}` : undefined
        }
        icono={FileEditIcon}
        etiqueta="Tema"
        placeholder="Ej. Ecuaciones cuadráticas"
        mensajeRequerido="Ingrese el tema de la sesión para firmar el ingreso."
        textoInicial={accion?.sesion.tema ?? ""}
        textoBoton="Guardar tema"
        pendiente={tema.isPending}
        onEnviar={({ texto }) =>
          accion && tema.mutate({ id: accion.sesion.id, tema: texto }, { onSuccess: cerrar })
        }
      />
      <ModalTexto
        abierto={accion?.tipo === "justificar"}
        clave={`justificar-${accion?.sesion.id ?? ""}`}
        onOpenChange={(abierto) => !abierto && cerrar()}
        titulo="Solicitar justificación"
        descripcion="La revisa el subdirector."
        icono={FileEditIcon}
        etiqueta="Motivo"
        placeholder="Ej. Descanso médico"
        mensajeRequerido="Indique el motivo de la justificación."
        conEnlace
        textoBoton="Enviar justificación"
        pendiente={justificar.isPending}
        onEnviar={({ texto, enlace }) =>
          accion &&
          justificar.mutate(
            { id: accion.sesion.id, motivo: texto, documentoUrl: enlace },
            { onSuccess: cerrar },
          )
        }
      />
    </div>
  );
}
