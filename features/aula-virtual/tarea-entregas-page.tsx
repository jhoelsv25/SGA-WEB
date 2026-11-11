"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/common/status-badge";
import { PageState } from "@/components/common/page-state";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/formatters/date";
import { CalificarEntregaForm } from "./components/forms/calificar-entrega-form";
import {
  useAula,
  useCalificarDirecto,
  useDetalleTarea,
  useEntregasDeTarea,
  useLibroNotas,
} from "./hooks";
import type { Entrega } from "./types";

interface EstudianteRoster {
  matriculaId: string;
  estudianteId: string;
  codigo: string;
  nombre: string;
  entrega: Entrega | null;
  estado: "calificada" | "entregada" | "devuelta" | "sin_entregar";
}

export function TareaEntregasPage({
  cursoSeccionId,
  tareaId,
}: {
  cursoSeccionId: string;
  tareaId: string;
}) {
  // 1. Cargar datos de la tarea, entregas y lista de alumnos
  const {
    data: tarea,
    isLoading: cargandoTarea,
    error: errorTarea,
    refetch: refetchTarea,
  } = useDetalleTarea(tareaId);
  const {
    data: entregas = [],
    isLoading: cargandoEntregas,
    refetch: refetchEntregas,
  } = useEntregasDeTarea(tareaId);
  const { data: aula } = useAula(cursoSeccionId);
  const { data: libroNotas } = useLibroNotas(cursoSeccionId);

  const listaEstudiantesLibro = libroNotas?.estudiantes;

  // 2. Construir lista unificada de estudiantes del aula
  const estudiantesRoster = React.useMemo<EstudianteRoster[]>(() => {
    // Si tenemos la lista de matriculados del libro de notas
    if (listaEstudiantesLibro && listaEstudiantesLibro.length > 0) {
      return listaEstudiantesLibro.map((est) => {
        const entrega =
          entregas.find(
            (e) =>
              e.matriculaId === est.matriculaId ||
              (e.estudianteId && e.estudianteId === est.estudianteId) ||
              (e.codigo && est.codigo && e.codigo === est.codigo),
          ) ?? null;

        let estado: EstudianteRoster["estado"] = "sin_entregar";
        if (entrega) {
          if (entrega.estado === "calificada") estado = "calificada";
          else if (entrega.estado === "devuelta") estado = "devuelta";
          else estado = "entregada";
        }

        return {
          matriculaId: est.matriculaId,
          estudianteId: est.estudianteId,
          codigo: est.codigo || "",
          nombre: est.estudianteNombre || "Estudiante",
          entrega,
          estado,
        };
      });
    }

    // Fallback: utilizar las entregas registradas
    return entregas.map((e) => ({
      matriculaId: e.matriculaId,
      estudianteId: e.estudianteId ?? e.id,
      codigo: e.codigo ?? "",
      nombre: e.estudianteNombre ?? "Estudiante",
      entrega: e,
      estado:
        e.estado === "calificada"
          ? "calificada"
          : e.estado === "devuelta"
            ? "devuelta"
            : "entregada",
    }));
  }, [listaEstudiantesLibro, entregas]);

  // Filtros reactivos
  const [busqueda, setBusqueda] = React.useState("");
  const [filtroEstado, setFiltroEstado] = React.useState<
    "todos" | "por_calificar" | "calificados" | "sin_entregar"
  >("todos");

  // Estudiantes filtrados
  const estudiantesFiltrados = React.useMemo(() => {
    return estudiantesRoster.filter((est) => {
      // Filtro de estado
      if (filtroEstado === "por_calificar" && est.estado !== "entregada") return false;
      if (filtroEstado === "calificados" && est.estado !== "calificada") return false;
      if (filtroEstado === "sin_entregar" && est.estado !== "sin_entregar") return false;

      // Filtro de búsqueda
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase().trim();
      return est.nombre.toLowerCase().includes(q) || est.codigo.toLowerCase().includes(q);
    });
  }, [estudiantesRoster, filtroEstado, busqueda]);

  // El estudiante seleccionado se deriva directamente:
  // Si el usuario seleccionó uno manualmente y existe en la lista filtrada, lo usamos.
  // Si no, seleccionamos por defecto el primero (priorizando uno por calificar).
  const [estudianteManualId, setEstudianteManualId] = React.useState<string | null>(null);

  const estudianteSeleccionadoId = React.useMemo(() => {
    if (estudiantesFiltrados.length === 0) return "";
    if (
      estudianteManualId &&
      estudiantesFiltrados.some((e) => (e.estudianteId || e.matriculaId) === estudianteManualId)
    ) {
      return estudianteManualId;
    }
    const pendiente = estudiantesFiltrados.find((e) => e.estado === "entregada");
    const primero = pendiente ?? estudiantesFiltrados[0];
    return primero.estudianteId || primero.matriculaId;
  }, [estudiantesFiltrados, estudianteManualId]);

  // Estudiante actualmente activo en el panel derecho
  const estudianteActualIndex = estudiantesFiltrados.findIndex(
    (e) => (e.estudianteId || e.matriculaId) === estudianteSeleccionadoId,
  );
  const estudianteActual = estudiantesFiltrados[estudianteActualIndex] ?? null;

  // Navegación entre estudiantes (Anterior / Siguiente)
  const irAlAnterior = () => {
    if (estudianteActualIndex > 0) {
      const prev = estudiantesFiltrados[estudianteActualIndex - 1];
      setEstudianteManualId(prev.estudianteId || prev.matriculaId);
    }
  };

  const irAlSiguiente = () => {
    if (estudianteActualIndex < estudiantesFiltrados.length - 1) {
      const next = estudiantesFiltrados[estudianteActualIndex + 1];
      setEstudianteManualId(next.estudianteId || next.matriculaId);
    }
  };

  // Métricas de resumen
  const metricas = React.useMemo(() => {
    const total = estudiantesRoster.length;
    const entregadas = estudiantesRoster.filter((e) => e.entrega !== null).length;
    const calificadas = estudiantesRoster.filter((e) => e.estado === "calificada").length;
    const pendientes = estudiantesRoster.filter((e) => e.estado === "entregada").length;
    const sinEntregar = estudiantesRoster.filter((e) => e.estado === "sin_entregar").length;

    const notasValidas = estudiantesRoster
      .map((e) => e.entrega?.nota)
      .filter((n): n is number => typeof n === "number" && !isNaN(n));

    const promedio =
      notasValidas.length > 0
        ? notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length
        : null;

    return { total, entregadas, calificadas, pendientes, sinEntregar, promedio };
  }, [estudiantesRoster]);

  const isLoading = cargandoTarea || cargandoEntregas;

  return (
    <div className="animate-in fade-in-50 space-y-6 pb-12 duration-300">
      {/* Botón de regreso rápido al aula virtual */}
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-xs font-medium">
          <Link href={`/admin/aula-virtual/${cursoSeccionId}?tab=tareas`}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            <span>Volver a Tareas del Aula</span>
          </Link>
        </Button>

        {aula && (
          <span className="text-muted-foreground hidden text-xs font-medium sm:inline">
            {aula.cursoNombre} · Sección {aula.seccionNombre}
          </span>
        )}
      </div>

      <PageState
        isLoading={isLoading}
        isError={Boolean(errorTarea)}
        error={errorTarea}
        onRetry={() => {
          void refetchTarea();
          void refetchEntregas();
        }}
        errorTitle="No se pudo cargar la tarea"
      >
        {tarea && (
          <>
            {/* Cabecera Principal de la Tarea */}
            <div className="bg-card rounded-2xl border p-5 shadow-xs sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="brand">{tarea.tipo.toUpperCase()}</StatusBadge>
                    {tarea.estado === "publicada" ? (
                      <StatusBadge tone="success">Publicada</StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">Borrador</StatusBadge>
                    )}
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <HugeiconsIcon icon={Clock01Icon} size={14} />
                      Límite: {formatDate(tarea.fechaLimite)}
                    </span>
                  </div>
                  <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                    {tarea.titulo}
                  </h1>
                  {tarea.instrucciones && (
                    <p className="text-muted-foreground line-clamp-2 text-xs sm:text-sm">
                      {tarea.instrucciones}
                    </p>
                  )}
                </div>

                {/* Métricas en Tarjetas Compactas */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  <div className="bg-muted/40 rounded-xl border p-2.5 text-center">
                    <span className="text-muted-foreground block text-[11px] font-medium">
                      Estudiantes
                    </span>
                    <span className="text-foreground text-base font-bold">{metricas.total}</span>
                  </div>
                  <div className="bg-muted/40 rounded-xl border p-2.5 text-center">
                    <span className="text-muted-foreground block text-[11px] font-medium">
                      Entregados
                    </span>
                    <span className="text-primary text-base font-bold">{metricas.entregadas}</span>
                  </div>
                  <div className="bg-muted/40 rounded-xl border p-2.5 text-center">
                    <span className="text-muted-foreground block text-[11px] font-medium">
                      Por calificar
                    </span>
                    <span className="text-base font-bold text-amber-600">
                      {metricas.pendientes}
                    </span>
                  </div>
                  <div className="bg-muted/40 rounded-xl border p-2.5 text-center">
                    <span className="text-muted-foreground block text-[11px] font-medium">
                      Promedio
                    </span>
                    <span className="text-foreground text-base font-bold">
                      {metricas.promedio !== null ? `${metricas.promedio.toFixed(1)}` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Classroom Split Workspace */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              {/* Columna Izquierda: Roster de Estudiantes (4 columnas en pantallas grandes) */}
              <div className="bg-card space-y-3 rounded-2xl border p-4 shadow-xs lg:col-span-5 xl:col-span-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold tracking-tight">Estudiantes de la sección</h2>
                  <span className="text-muted-foreground text-xs font-semibold">
                    {estudiantesFiltrados.length} listados
                  </span>
                </div>

                {/* Buscador de estudiante */}
                <div className="relative">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={16}
                    className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                  />
                  <Input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por apellido, nombre o código..."
                    className="h-9 pl-9 text-xs"
                  />
                </div>

                {/* Filtros rápidos por estado */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Button
                    type="button"
                    variant={filtroEstado === "todos" ? "default" : "outline"}
                    size="sm"
                    className="h-7 rounded-lg px-2.5 text-xs"
                    onClick={() => setFiltroEstado("todos")}
                  >
                    Todos ({metricas.total})
                  </Button>
                  <Button
                    type="button"
                    variant={filtroEstado === "por_calificar" ? "default" : "outline"}
                    size="sm"
                    className="h-7 rounded-lg px-2.5 text-xs"
                    onClick={() => setFiltroEstado("por_calificar")}
                  >
                    Por calificar ({metricas.pendientes})
                  </Button>
                  <Button
                    type="button"
                    variant={filtroEstado === "calificados" ? "default" : "outline"}
                    size="sm"
                    className="h-7 rounded-lg px-2.5 text-xs"
                    onClick={() => setFiltroEstado("calificados")}
                  >
                    Calificados ({metricas.calificadas})
                  </Button>
                  <Button
                    type="button"
                    variant={filtroEstado === "sin_entregar" ? "default" : "outline"}
                    size="sm"
                    className="h-7 rounded-lg px-2.5 text-xs"
                    onClick={() => setFiltroEstado("sin_entregar")}
                  >
                    Sin entregar ({metricas.sinEntregar})
                  </Button>
                </div>

                {/* Lista scrolleable de estudiantes */}
                <div className="max-h-[600px] space-y-1.5 overflow-y-auto pr-1">
                  {estudiantesFiltrados.length === 0 ? (
                    <div className="text-muted-foreground py-10 text-center text-xs">
                      No hay estudiantes con el filtro seleccionado.
                    </div>
                  ) : (
                    estudiantesFiltrados.map((est) => {
                      const idClave = est.estudianteId || est.matriculaId;
                      const isSelected = idClave === estudianteSeleccionadoId;

                      return (
                        <button
                          key={idClave}
                          type="button"
                          onClick={() => setEstudianteManualId(idClave)}
                          className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-primary/20 shadow-xs ring-2"
                              : "hover:bg-muted/50 border-border bg-card"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-xs font-semibold">{est.nombre}</span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 pt-0.5 text-[11px]">
                              {est.codigo && <span>{est.codigo}</span>}
                              {est.entrega?.entregadaEn && (
                                <span>· {formatDate(est.entrega.entregadaEn)}</span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            {est.estado === "calificada" && (
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {est.entrega?.nota !== null && est.entrega?.nota !== undefined
                                  ? `Nota: ${Number(est.entrega.nota).toFixed(1)}`
                                  : "Calificada"}
                              </span>
                            )}
                            {est.estado === "entregada" && (
                              <StatusBadge tone="brand">Entregó</StatusBadge>
                            )}
                            {est.estado === "devuelta" && (
                              <StatusBadge tone="warning">Devuelta</StatusBadge>
                            )}
                            {est.estado === "sin_entregar" && (
                              <span className="text-muted-foreground text-[11px]">
                                Sin entregar
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Columna Derecha: Panel de Revisión y Calificación (7 u 8 columnas) */}
              <div className="bg-card space-y-4 rounded-2xl border p-5 shadow-xs lg:col-span-7 xl:col-span-8">
                {/* Barra de Navegación del Estudiante (Anterior / Siguiente) */}
                <div className="border-border flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full text-xs font-bold">
                      {estudianteActual?.nombre.slice(0, 2).toUpperCase() || "AL"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">
                        {estudianteActual?.nombre || "Seleccione un estudiante"}
                      </h3>
                      {estudianteActual?.codigo && (
                        <p className="text-muted-foreground text-xs">
                          Código: {estudianteActual.codigo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground hidden text-xs sm:inline">
                      {estudianteActualIndex >= 0
                        ? `${estudianteActualIndex + 1} de ${estudiantesFiltrados.length}`
                        : "—"}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={irAlAnterior}
                      disabled={estudianteActualIndex <= 0}
                      title="Estudiante anterior"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={irAlSiguiente}
                      disabled={
                        estudianteActualIndex < 0 ||
                        estudianteActualIndex >= estudiantesFiltrados.length - 1
                      }
                      title="Estudiante siguiente"
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                    </Button>
                  </div>
                </div>

                {/* Contenido según si tiene entrega o no */}
                {!estudianteActual ? (
                  <div className="text-muted-foreground py-20 text-center text-sm">
                    Seleccione un estudiante de la lista izquierda para ver su entrega.
                  </div>
                ) : estudianteActual.entrega ? (
                  /* Formulario y Detalle de Calificación */
                  <div className="pt-2">
                    <CalificarEntregaForm
                      key={estudianteActual.entrega.id}
                      entrega={estudianteActual.entrega}
                      tarea={tarea}
                      onCancel={() => {
                        // Deseleccionar o regresar
                      }}
                      onSuccess={() => {
                        void refetchEntregas();
                      }}
                      onSiguiente={
                        estudianteActualIndex < estudiantesFiltrados.length - 1
                          ? irAlSiguiente
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  /* Estudiante sin entrega enviada: permitir calificación directa / entrega física */
                  <FormCalificacionDirecta
                    key={estudianteActual.matriculaId || estudianteActual.estudianteId}
                    tareaId={tarea.id}
                    matriculaId={estudianteActual.matriculaId}
                    estudianteNombre={estudianteActual.nombre}
                    onSuccess={() => {
                      void refetchEntregas();
                    }}
                    onSiguiente={
                      estudianteActualIndex < estudiantesFiltrados.length - 1
                        ? irAlSiguiente
                        : undefined
                    }
                  />
                )}
              </div>
            </div>
          </>
        )}
      </PageState>
    </div>
  );
}

function FormCalificacionDirecta({
  tareaId,
  matriculaId,
  estudianteNombre,
  onSuccess,
  onSiguiente,
}: {
  tareaId: string;
  matriculaId: string;
  estudianteNombre: string;
  onSuccess: () => void;
  onSiguiente?: () => void;
}) {
  const calificarDirecto = useCalificarDirecto();
  const [nota, setNota] = React.useState<number | "">("");
  const [retroalimentacion, setRetroalimentacion] = React.useState("");

  const handleGuardar = async () => {
    if (nota === "" || nota < 0 || nota > 20) {
      toast.error("La nota debe estar entre 0 y 20.");
      return;
    }
    if (!matriculaId) {
      toast.error("No se encontró la matrícula del estudiante.");
      return;
    }
    try {
      await calificarDirecto.mutateAsync({
        tareaId,
        matriculaId,
        nota: Number(nota),
        retroalimentacion: retroalimentacion.trim() || undefined,
      });
      onSuccess();
    } catch {
      // Error manejado en hook
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 text-xs text-amber-900 dark:border-amber-950 dark:bg-amber-950/20 dark:text-amber-200">
        <p className="font-semibold">Sin entrega virtual registrada</p>
        <p className="text-muted-foreground mt-0.5">
          {estudianteNombre} no ha subido archivos por la plataforma. Puedes asignarle su nota aquí
          directamente si presentó en físico (cartulina, cuaderno, maqueta), expuso en clase, o si
          deseas colocarle 00 por no presentar.
        </p>
      </div>

      <div className="bg-muted/20 space-y-3 rounded-xl border p-4">
        <div>
          <Label htmlFor="input-nota-directa" className="text-xs font-semibold">
            Calificación vigesimal (0 a 20) *
          </Label>
          <Input
            id="input-nota-directa"
            type="number"
            min={0}
            max={20}
            step={0.25}
            value={nota}
            onChange={(e) => setNota(e.target.value ? Number(e.target.value) : "")}
            placeholder="Ej. 16.0"
            className="mt-1 h-10 text-base font-bold"
          />
        </div>

        <div>
          <Label htmlFor="input-retro-directa" className="text-xs font-semibold">
            Retroalimentación u observación (opcional)
          </Label>
          <Textarea
            id="input-retro-directa"
            value={retroalimentacion}
            onChange={(e) => setRetroalimentacion(e.target.value)}
            placeholder="Ej. 'Entregó proyecto en físico en el aula' o 'Presentación oral destacada'..."
            rows={3}
            className="mt-1 resize-y text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSiguiente}
            disabled={!onSiguiente}
            className="text-xs"
          >
            <span>Omitir y pasar al siguiente</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleGuardar}
              disabled={calificarDirecto.isPending}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
              {calificarDirecto.isPending ? "Guardando..." : "Guardar calificación"}
            </Button>

            {onSiguiente && (
              <Button
                type="button"
                onClick={async () => {
                  await handleGuardar();
                  onSiguiente();
                }}
                disabled={calificarDirecto.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                <span>Guardar y siguiente</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
