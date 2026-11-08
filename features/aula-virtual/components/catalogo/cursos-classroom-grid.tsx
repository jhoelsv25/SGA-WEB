"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  RotateLeft01Icon,
} from "@hugeicons/core-free-icons";
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
  const [soloConAlumnos, setSoloConAlumnos] = React.useState<boolean>(false);

  // Paginación
  const [paginaActual, setPaginaActual] = React.useState(1);
  const [porPagina, setPorPagina] = React.useState<number>(12);

  // Conteo de cursos que tienen matriculados
  const totalConAlumnos = React.useMemo(() => {
    return cursos.filter((c) => (c.totalEstudiantes ?? 0) > 0).length;
  }, [cursos]);

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

  // Reset de página al cambiar cualquier filtro
  const handleBusquedaChange = (val: string) => {
    setBusqueda(val);
    setPaginaActual(1);
  };

  const handleGradoChange = (val: string) => {
    setGradoFiltro(val);
    setSeccionFiltro("");
    setPaginaActual(1);
  };

  const handleSeccionChange = (val: string) => {
    setSeccionFiltro(val);
    setPaginaActual(1);
  };

  const handleMateriaChange = (val: string) => {
    setMateriaFiltro(val);
    setPaginaActual(1);
  };

  const handleDocenteChange = (val: string) => {
    setDocenteFiltro(val);
    setPaginaActual(1);
  };

  const handleSoloConAlumnosChange = (val: boolean) => {
    setSoloConAlumnos(val);
    setPaginaActual(1);
  };

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

      const matchAlumnos = !soloConAlumnos || (c.totalEstudiantes ?? 0) > 0;

      return (
        matchBusqueda && matchGrado && matchSeccion && matchMateria && matchDocente && matchAlumnos
      );
    });
  }, [cursos, busqueda, gradoFiltro, seccionFiltro, materiaFiltro, docenteFiltro, soloConAlumnos]);

  // Cálculos de paginación
  const limiteEfectivo = porPagina > 0 ? porPagina : cursosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(cursosFiltrados.length / limiteEfectivo));
  const paginaValida = Math.min(paginaActual, totalPaginas);

  const cursosPaginados = React.useMemo(() => {
    if (porPagina <= 0) return cursosFiltrados;
    const inicio = (paginaValida - 1) * porPagina;
    return cursosFiltrados.slice(inicio, inicio + porPagina);
  }, [cursosFiltrados, paginaValida, porPagina]);

  const indiceInicio = cursosFiltrados.length === 0 ? 0 : (paginaValida - 1) * limiteEfectivo + 1;
  const indiceFin = Math.min(paginaValida * limiteEfectivo, cursosFiltrados.length);

  const hayFiltrosActivos = Boolean(
    busqueda || gradoFiltro || seccionFiltro || materiaFiltro || docenteFiltro || soloConAlumnos,
  );

  const limpiarFiltros = () => {
    setBusqueda("");
    setGradoFiltro("");
    setSeccionFiltro("");
    setMateriaFiltro("");
    setDocenteFiltro("");
    setSoloConAlumnos(false);
    setPaginaActual(1);
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
        onBusquedaChange={handleBusquedaChange}
        gradosDisponibles={gradosDisponibles}
        opcionesGrados={opcionesGrados}
        gradoFiltro={gradoFiltro}
        onGradoChange={handleGradoChange}
        seccionesDisponibles={seccionesDisponibles}
        opcionesSecciones={opcionesSecciones}
        seccionFiltro={seccionFiltro}
        onSeccionChange={handleSeccionChange}
        materiasDisponibles={materiasDisponibles}
        opcionesMaterias={opcionesMaterias}
        materiaFiltro={materiaFiltro}
        onMateriaChange={handleMateriaChange}
        docentesDisponibles={docentesDisponibles}
        opcionesDocentes={opcionesDocentes}
        docenteFiltro={docenteFiltro}
        onDocenteChange={handleDocenteChange}
        soloConAlumnos={soloConAlumnos}
        onSoloConAlumnosChange={handleSoloConAlumnosChange}
        totalConAlumnos={totalConAlumnos}
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cursosPaginados.map((curso) => (
              <CursoClassroomCard
                key={curso.cursoSeccionId}
                curso={curso}
                basePath={basePath}
                onSelect={onSelectCurso}
              />
            ))}
          </div>

          {/* Barra de Paginación */}
          {cursosFiltrados.length > 0 && (
            <div className="border-border/70 bg-card flex flex-col items-center justify-between gap-4 rounded-2xl border p-4 shadow-xs sm:flex-row">
              {/* Información de elementos */}
              <div className="text-muted-foreground text-xs font-medium">
                Mostrando <span className="text-foreground font-semibold">{indiceInicio}</span> a{" "}
                <span className="text-foreground font-semibold">{indiceFin}</span> de{" "}
                <span className="text-foreground font-semibold">{cursosFiltrados.length}</span>{" "}
                materias
                {totalPaginas > 1 && (
                  <span className="text-muted-foreground/80 ml-1.5">
                    · Página {paginaValida} de {totalPaginas}
                  </span>
                )}
              </div>

              {/* Controles de página y selector de límite */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Selector de límite por página */}
                <div className="bg-muted/60 mr-2 flex items-center rounded-xl p-0.5 text-xs">
                  <span className="text-muted-foreground px-2 text-[11px] font-medium">Ver:</span>
                  {[12, 24, 0].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setPorPagina(num);
                        setPaginaActual(1);
                      }}
                      className={`cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${
                        porPagina === num
                          ? "bg-card text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {num === 0 ? "Todos" : num}
                    </button>
                  ))}
                </div>

                {/* Botones de navegación cuando hay más de 1 página */}
                {totalPaginas > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
                      disabled={paginaValida <= 1}
                      className="h-8 gap-1 rounded-xl px-2.5 text-xs"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                      <span className="hidden sm:inline">Anterior</span>
                    </Button>

                    {/* Botones numéricos de página */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => {
                        // Limitar la cantidad de botones mostrados si hay muchas páginas
                        if (
                          num === 1 ||
                          num === totalPaginas ||
                          (num >= paginaValida - 1 && num <= paginaValida + 1)
                        ) {
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setPaginaActual(num)}
                              className={`h-8 w-8 cursor-pointer rounded-xl text-xs font-semibold transition-all ${
                                paginaValida === num
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              {num}
                            </button>
                          );
                        }
                        if (num === paginaValida - 2 || num === paginaValida + 2) {
                          return (
                            <span key={num} className="text-muted-foreground px-1 text-xs">
                              …
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
                      disabled={paginaValida >= totalPaginas}
                      className="h-8 gap-1 rounded-xl px-2.5 text-xs"
                    >
                      <span className="hidden sm:inline">Siguiente</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
