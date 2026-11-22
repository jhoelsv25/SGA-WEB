"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { SelectOptionItem } from "@/components/common/select";
import type { AnioAcademico } from "@/features/anio-escolar/types";
import { cargaAcademicaApi } from "@/features/carga-academica/api";
import type { Seccion } from "@/features/secciones/types";
import { descargarArchivoReporte } from "../api/reportes.api";
import type { ReporteCatalogoItem } from "../constants";
import type { GradoOpcionReporte, SolicitarReportePayload } from "../types";
import { construirSolicitudDescargaDirecta } from "../utils";

export interface UseModalGenerarReporteParams {
  reporte: ReporteCatalogoItem | null;
  anio: AnioAcademico | null;
  grados: GradoOpcionReporte[];
  secciones: Seccion[];
  onEncolar: (payload: SolicitarReportePayload) => void;
  onDescargarDirecto: (key: string, fn: () => Promise<string>) => Promise<boolean>;
  onClose: () => void;
}

export function useModalGenerarReporte({
  reporte,
  anio,
  grados,
  secciones,
  onEncolar,
  onDescargarDirecto,
  onClose,
}: UseModalGenerarReporteParams) {
  const bimestres = React.useMemo(
    () => [...(anio?.bimestres ?? [])].sort((a, b) => a.numero - b.numero),
    [anio],
  );
  const bimestreInicial =
    bimestres.find((b) => b.estado === "en_curso")?.id ?? bimestres[0]?.id ?? "all";

  const [periodoSel, setPeriodoSel] = React.useState(bimestreInicial);
  const [gradoId, setGradoId] = React.useState("all");
  const [seccionId, setSeccionId] = React.useState("all");
  const [cursoSeccionId, setCursoSeccionId] = React.useState("all");
  const [estadoMatricula, setEstadoMatricula] = React.useState("all");
  const [tipoPersona, setTipoPersona] = React.useState("all");
  const [desdeManual, setDesdeManual] = React.useState("");
  const [hastaManual, setHastaManual] = React.useState("");
  const [mesNumero, setMesNumero] = React.useState(() =>
    String(new Date().getMonth() + 1).padStart(2, "0"),
  );
  const [busqueda, setBusqueda] = React.useState("");

  const cfg = reporte?.filtros ?? {};
  const periodoActivo =
    periodoSel === "all" ? null : (bimestres.find((b) => b.id === periodoSel) ?? null);
  const periodoId = periodoActivo?.id ?? "";

  const seccionesFiltradas = React.useMemo(() => {
    const base = gradoId === "all" ? secciones : secciones.filter((s) => s.gradoId === gradoId);
    return base
      .slice()
      .sort((a, b) => a.gradoNumero - b.gradoNumero || a.nombre.localeCompare(b.nombre, "es"));
  }, [secciones, gradoId]);

  const seccionObj = seccionesFiltradas.find((s) => s.id === seccionId) ?? null;

  const cargaQuery = useQuery({
    queryKey: ["carga-academica", "modal-reporte", seccionId],
    queryFn: () => cargaAcademicaApi.getCargaSeccion(seccionId),
    enabled: Boolean(reporte && cfg.curso && seccionId !== "all"),
  });

  const opcionesPeriodo: SelectOptionItem<string>[] = React.useMemo(
    () => [
      ...(cfg.periodoObligatorio
        ? []
        : [{ value: "all", label: "Todo el año", description: "Sin filtro por bimestre" }]),
      ...bimestres.map((b) => ({
        value: b.id,
        label: `Bimestre ${b.nombre}`,
        description: `${b.fechaInicio.slice(0, 10)} al ${b.fechaFin.slice(0, 10)}`,
      })),
    ],
    [bimestres, cfg.periodoObligatorio],
  );

  const opcionesGrado: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "all", label: "Todos los grados", description: "1.° a 5.° de secundaria" },
      ...grados.map((g) => ({
        value: g.id,
        label: g.nombre,
        description: `Todas las secciones de ${g.numero}.°`,
      })),
    ],
    [grados],
  );

  const opcionesSeccion: SelectOptionItem<string>[] = React.useMemo(
    () => [
      ...(cfg.seccionObligatoria
        ? []
        : [
            {
              value: "all",
              label:
                gradoId === "all"
                  ? "Todas las secciones"
                  : "Todas las secciones del grado seleccionado",
            },
          ]),
      ...seccionesFiltradas.map((s) => ({
        value: s.id,
        label: `${s.gradoNumero}.° ${s.nombre}`,
        description: s.gradoNombre,
      })),
    ],
    [seccionesFiltradas, gradoId, cfg.seccionObligatoria],
  );

  const opcionesCurso: SelectOptionItem<string>[] = React.useMemo(
    () =>
      (cargaQuery.data?.items ?? []).map((item) => ({
        value: item.id,
        label: item.cursoNombre,
        description: item.docente?.nombreCompleto ?? "Sin docente asignado",
      })),
    [cargaQuery.data],
  );

  const anioId = anio?.id ?? "";
  const desde =
    desdeManual || periodoActivo?.fechaInicio.slice(0, 10) || anio?.fechaInicio.slice(0, 10) || "";
  const hasta =
    hastaManual || periodoActivo?.fechaFin.slice(0, 10) || anio?.fechaFin.slice(0, 10) || "";
  const mesValor = `${anio?.anio ?? new Date().getFullYear()}-${mesNumero}`;

  const gradoFiltro = gradoId === "all" ? undefined : gradoId;
  const seccionFiltro = seccionId === "all" ? undefined : seccionId;
  const cursoFiltro = cursoSeccionId === "all" ? undefined : cursoSeccionId;
  const estadoFiltro = estadoMatricula === "all" ? undefined : estadoMatricula;
  const tipoPersonaFiltro = tipoPersona === "all" ? undefined : tipoPersona;
  const busquedaLimpia = busqueda.trim() || undefined;

  const faltaRequerido = Boolean(
    (cfg.periodoObligatorio && !periodoId) ||
    (cfg.seccionObligatoria && !seccionFiltro) ||
    (cfg.cursoObligatorio && !cursoFiltro),
  );

  const sinFiltros = Object.keys(cfg).length === 0;

  const cambiarPeriodo = (val: string) => {
    setPeriodoSel(val);
    setDesdeManual("");
    setHastaManual("");
  };

  const cambiarGrado = (val: string) => {
    setGradoId(val);
    setSeccionId("all");
    setCursoSeccionId("all");
  };

  const cambiarSeccion = (val: string) => {
    setSeccionId(val);
    setCursoSeccionId("all");
  };

  const restaurarFechasBimestre = () => {
    setDesdeManual("");
    setHastaManual("");
  };

  const ejecutar = async (formato: "excel" | "pdf") => {
    if (!reporte) return;

    if (reporte.asincrono && reporte.tipoCola) {
      onEncolar({
        tipo: reporte.tipoCola,
        anioAcademicoId: anioId || undefined,
        periodoId: periodoId || undefined,
        gradoId: gradoFiltro,
        seccionId: seccionFiltro,
        estado: estadoFiltro,
        tipoPersona: tipoPersonaFiltro,
        desde: cfg.fechas ? desde || undefined : undefined,
        hasta: cfg.fechas ? hasta || undefined : undefined,
        search: busquedaLimpia,
      });
      onClose();
      return;
    }

    const solicitud = construirSolicitudDescargaDirecta({
      reporteId: reporte.id,
      formato,
      anioId,
      periodoId,
      seccionId: seccionFiltro,
      seccionObj,
      cursoSeccionId: cursoFiltro,
      desde,
      hasta,
      mesValor,
    });

    if (solicitud) {
      await onDescargarDirecto(`${reporte.id}-${formato}`, () =>
        descargarArchivoReporte(solicitud),
      );
    }

    onClose();
  };

  return {
    cfg,
    sinFiltros,
    faltaRequerido,
    cargandoCursos: cargaQuery.isLoading,
    valores: {
      periodoSel,
      gradoId,
      seccionId,
      cursoSeccionId,
      estadoMatricula,
      tipoPersona,
      desde,
      hasta,
      tieneFechasManuales: Boolean(desdeManual || hastaManual),
      mesNumero,
      busqueda,
    },
    opciones: {
      periodo: opcionesPeriodo,
      grado: opcionesGrado,
      seccion: opcionesSeccion,
      curso: opcionesCurso,
    },
    acciones: {
      cambiarPeriodo,
      cambiarGrado,
      cambiarSeccion,
      setCursoSeccionId,
      setEstadoMatricula,
      setTipoPersona,
      setDesdeManual,
      setHastaManual,
      restaurarFechasBimestre,
      setMesNumero,
      setBusqueda,
    },
    ejecutar,
  };
}
