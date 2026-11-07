"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, RotateLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { SelectOptionItem } from "@/components/common/select";
import { useSession } from "@/features/auth";
import type { CursoAula } from "../../types";
import { CursoClassroomCard } from "./curso-classroom-card";
import { CursosFiltrosBar } from "./cursos-filtros-bar";

export interface CursosClassroomGridProps {
  cursos: CursoAula[];
  onSelectCurso?: (cursoSeccionId: string) => void;
  basePath?: string;
}

export function CursosClassroomGrid({
  cursos,
  onSelectCurso,
  basePath = "/admin/aula-virtual",
}: CursosClassroomGridProps) {
  const { data: sessionData } = useSession();
  const rolNombre = sessionData?.user?.activeRoleName ?? sessionData?.user?.roles?.[0] ?? "";

  const [busqueda, setBusqueda] = React.useState("");
  const [gradoFiltro, setGradoFiltro] = React.useState<string>("");
  const [seccionFiltro, setSeccionFiltro] = React.useState<string>("");
  const [materiaFiltro, setMateriaFiltro] = React.useState<string>("");
  const [docenteFiltro, setDocenteFiltro] = React.useState<string>("");

  // Grados disponibles
  const gradosDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (c.gradoNombre) mapa.add(c.gradoNombre);
    }
    return Array.from(mapa).sort();
  }, [cursos]);

  // Secciones disponibles (dependen del grado seleccionado si lo hay)
  const seccionesDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (!gradoFiltro || c.gradoNombre === gradoFiltro) {
        if (c.seccionNombre) mapa.add(c.seccionNombre);
      }
    }
    return Array.from(mapa).sort();
  }, [cursos, gradoFiltro]);

  // Materias únicas
  const materiasDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (c.cursoNombre) mapa.add(c.cursoNombre);
    }
    return Array.from(mapa).sort();
  }, [cursos]);

  // Docentes disponibles
  const docentesDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (c.docenteNombre && c.docenteNombre.trim()) {
        mapa.add(c.docenteNombre.trim());
      }
    }
    return Array.from(mapa).sort();
  }, [cursos]);

  // Opciones para SelectOption
  const opcionesGrados: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "", label: "Todos los grados" },
      ...gradosDisponibles.map((g) => ({ value: g, label: g })),
    ],
    [gradosDisponibles],
  );

  const opcionesSecciones: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "", label: "Todas las secciones" },
      ...seccionesDisponibles.map((s) => ({ value: s, label: s })),
    ],
    [seccionesDisponibles],
  );

  const opcionesMaterias: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "", label: "Todas las materias" },
      ...materiasDisponibles.map((m) => ({ value: m, label: m })),
    ],
    [materiasDisponibles],
  );

  const opcionesDocentes: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "", label: "Todos los docentes" },
      { value: "sin_asignar", label: "⚠️ Sin docente asignado" },
      ...docentesDisponibles.map((d) => ({ value: d, label: d })),
    ],
    [docentesDisponibles],
  );

  // Filtrado reactivo multidimensional
  const cursosFiltrados = React.useMemo(() => {
    return cursos.filter((c) => {
      const matchBusqueda =
        !busqueda ||
        c.cursoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.seccionNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.docenteNombre && c.docenteNombre.toLowerCase().includes(busqueda.toLowerCase()));

      const matchGrado = !gradoFiltro || c.gradoNombre === gradoFiltro;
      const matchSeccion = !seccionFiltro || c.seccionNombre === seccionFiltro;
      const matchMateria = !materiaFiltro || c.cursoNombre === materiaFiltro;
      const matchDocente =
        !docenteFiltro ||
        (docenteFiltro === "sin_asignar"
          ? !c.docenteNombre || c.docenteNombre.trim() === ""
          : c.docenteNombre === docenteFiltro);

      return matchBusqueda && matchGrado && matchSeccion && matchMateria && matchDocente;
    });
  }, [cursos, busqueda, gradoFiltro, seccionFiltro, materiaFiltro, docenteFiltro]);

  const hayFiltrosActivos = Boolean(
    busqueda || gradoFiltro || seccionFiltro || materiaFiltro || docenteFiltro,
  );

  const limpiarFiltros = () => {
    setBusqueda("");
    setGradoFiltro("");
    setSeccionFiltro("");
    setMateriaFiltro("");
    setDocenteFiltro("");
  };

  return (
    <div className="space-y-6">
      {/* Panel Superior: Contexto de Rol y Barra de Filtros */}
      <CursosFiltrosBar
        rolNombre={rolNombre}
        totalCursos={cursos.length}
        totalCursosFiltrados={cursosFiltrados.length}
        hayFiltrosActivos={hayFiltrosActivos}
        onLimpiarFiltros={limpiarFiltros}
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        gradosDisponibles={gradosDisponibles}
        opcionesGrados={opcionesGrados}
        gradoFiltro={gradoFiltro}
        onGradoChange={(val) => {
          setGradoFiltro(val);
          setSeccionFiltro("");
        }}
        seccionesDisponibles={seccionesDisponibles}
        opcionesSecciones={opcionesSecciones}
        seccionFiltro={seccionFiltro}
        onSeccionChange={setSeccionFiltro}
        materiasDisponibles={materiasDisponibles}
        opcionesMaterias={opcionesMaterias}
        materiaFiltro={materiaFiltro}
        onMateriaChange={setMateriaFiltro}
        docentesDisponibles={docentesDisponibles}
        opcionesDocentes={opcionesDocentes}
        docenteFiltro={docenteFiltro}
        onDocenteChange={setDocenteFiltro}
      />

      {/* Grid de Materias tipo Google Classroom */}
      {cursosFiltrados.length === 0 ? (
        <div className="border-border/80 bg-card/40 rounded-2xl border border-dashed p-12 text-center">
          <HugeiconsIcon
            icon={BookOpen01Icon}
            size={40}
            className="text-muted-foreground/60 mx-auto mb-3"
          />
          <h3 className="text-foreground text-base font-semibold">No se encontraron materias</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            {hayFiltrosActivos
              ? "Prueba cambiando los filtros seleccionados o limpiándolos para ver todas las materias."
              : "No tienes materias asignadas en este periodo escolar."}
          </p>
          {hayFiltrosActivos && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={limpiarFiltros}
              className="mt-4 gap-1.5 rounded-xl text-xs font-medium"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
              <span>Limpiar filtros</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cursosFiltrados.map((curso) => (
            <CursoClassroomCard
              key={curso.cursoSeccionId}
              curso={curso}
              basePath={basePath}
              onSelect={onSelectCurso}
            />
          ))}
        </div>
      )}
    </div>
  );
}
