"use client";

import * as React from "react";
import { EmptyState } from "@/components/common/empty-state";
import { PageState } from "@/components/common/page-state";
import { useLibroNotas } from "../../hooks";
import { descargarExcelLibroNotas } from "../../api";
import { toast } from "@/lib/toast";
import { LibroNotasHeader, LibroNotasFiltros, LibroNotasTabla } from "./libro-notas";

export function LibroNotasTab({
  cursoSeccionId,
  periodoId,
}: {
  cursoSeccionId: string;
  periodoId?: string;
}) {
  const {
    data: libro,
    isLoading,
    isError,
    error,
    refetch,
  } = useLibroNotas(cursoSeccionId, periodoId);
  const [descargando, setDescargando] = React.useState(false);

  // Estados de filtros reactivos
  const [busqueda, setBusqueda] = React.useState("");
  const [tipoFiltro, setTipoFiltro] = React.useState<string>("todos");

  const handleDescargarExcel = async () => {
    if (!libro) return;
    try {
      setDescargando(true);
      await descargarExcelLibroNotas(cursoSeccionId, libro.cursoNombre, periodoId);
      toast.success("Libro de notas descargado en formato Excel.");
    } catch {
      toast.error("No se pudo descargar el archivo Excel.");
    } finally {
      setDescargando(false);
    }
  };

  const tareas = libro?.tareas;
  const estudiantes = libro?.estudiantes;

  // Conteo de tareas por tipo para las píldoras de filtro
  const conteoPorTipo = React.useMemo(() => {
    if (!tareas) return {};
    const conteo: Record<string, number> = {};
    for (const t of tareas) {
      conteo[t.tipo] = (conteo[t.tipo] || 0) + 1;
    }
    return conteo;
  }, [tareas]);

  // Tareas filtradas por tipo de evaluación
  const tareasFiltradas = React.useMemo(() => {
    if (!tareas) return [];
    if (tipoFiltro === "todos") return tareas;
    return tareas.filter((t) => t.tipo === tipoFiltro);
  }, [tareas, tipoFiltro]);

  // Estudiantes filtrados por búsqueda
  const estudiantesFiltrados = React.useMemo(() => {
    if (!estudiantes) return [];
    if (!busqueda.trim()) return estudiantes;
    const q = busqueda.toLowerCase().trim();
    return estudiantes.filter(
      (est) =>
        est.estudianteNombre.toLowerCase().includes(q) || est.codigo?.toLowerCase().includes(q),
    );
  }, [estudiantes, busqueda]);

  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      errorTitle="No se pudo cargar el libro de calificaciones"
    >
      {libro && (
        <div className="space-y-4">
          {/* Header Modular con pesos evaluativos y exportación */}
          <LibroNotasHeader
            periodoNombre={libro.periodoNombre}
            totalEstudiantes={libro.estudiantes.length}
            pesosEfectivos={libro.pesosEfectivos}
            descargando={descargando}
            onDescargarExcel={handleDescargarExcel}
          />

          {/* Filtros Modulares: Buscador de alumnos y filtro de tipo de tarea */}
          {libro.estudiantes.length > 0 && (
            <LibroNotasFiltros
              busqueda={busqueda}
              onBusquedaChange={setBusqueda}
              tipoFiltro={tipoFiltro}
              onTipoFiltroChange={setTipoFiltro}
              conteoPorTipo={conteoPorTipo}
              totalTareas={libro.tareas.length}
            />
          )}

          {/* Tabla Modular con Sticky Columns (Código, Estudiante, Promedio, Literal) */}
          {libro.estudiantes.length === 0 ? (
            <EmptyState
              title="No hay estudiantes en la sección"
              description="No se encontraron estudiantes matriculados en esta sección."
            />
          ) : estudiantesFiltrados.length === 0 ? (
            <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-xs">
              No se encontraron estudiantes que coincidan con &quot;{busqueda}&quot;.
            </div>
          ) : (
            <LibroNotasTabla
              cursoSeccionId={cursoSeccionId}
              tareas={tareasFiltradas}
              estudiantes={estudiantesFiltrados}
            />
          )}
        </div>
      )}
    </PageState>
  );
}
