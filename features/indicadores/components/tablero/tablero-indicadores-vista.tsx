"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Analytics01Icon,
  Archive02Icon,
  ChartHistogramIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  DashboardSquare01Icon,
  RefreshIcon,
  UserSearch01Icon,
} from "@hugeicons/core-free-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import {
  MENSAJES_INDICADORES,
  useComparacionQuery,
  usePuedeVerIndicadores,
  useTableroIndicadoresQuery,
  type FiltroIndicadoresQueryDto,
} from "@/features/indicadores";
import { ComparacionPretestPostest } from "./comparacion-pretest-postest";
import { DetalleCursosDocente } from "./detalle-cursos-docente";
import { GraficoEvolucionBimestres } from "./grafico-evolucion-bimestres";
import { TableroFiltros } from "./tablero-filtros";
import { TableroSkeleton } from "./tablero-skeleton";
import { TarjetasIndicadoresGrid } from "./tarjetas-indicadores-grid";
import { GestionMedicionPanel } from "../medicion/gestion-medicion-panel";
import { PanelGeneralVista } from "../panel/panel-general-vista";
import { SeccionApoyo } from "../apoyo/seccion-apoyo";

/**
 * Componente principal interactivo del Tablero de Indicadores de la Tesis (RF-020).
 * Accesible para Director, Subdirector y Administrador con alcance colegio.
 */
export function TableroIndicadoresVista() {
  return (
    <React.Suspense fallback={<TableroSkeleton />}>
      <TableroIndicadoresContenido />
    </React.Suspense>
  );
}

function TableroIndicadoresContenido() {
  const searchParams = useSearchParams();
  const puedeVer = usePuedeVerIndicadores();
  const { anio, cargando: cargandoAnio } = useAnioLectivo();

  // Estado de pestaña activa
  const [pestanaActiva, setPestanaActiva] = React.useState<string>("tablero");

  // Estado local de filtros
  const [filtros, setFiltros] = React.useState<FiltroIndicadoresQueryDto>(() => ({
    periodoId: searchParams.get("periodoId") ?? undefined,
    fechaInicio: searchParams.get("fechaInicio") ?? undefined,
    fechaFin: searchParams.get("fechaFin") ?? undefined,
    docenteId: searchParams.get("docenteId") ?? undefined,
    cursoId: searchParams.get("cursoId") ?? undefined,
    seccionId: searchParams.get("seccionId") ?? undefined,
  }));

  // Bimestres disponibles del año lectivo activo
  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio?.bimestres]);

  // Período para comparación: el seleccionado en el filtro o el primer bimestre disponible
  const bimestreComparacionId = React.useMemo(() => {
    if (filtros.periodoId && filtros.periodoId !== "all") {
      return filtros.periodoId;
    }
    // Preferir el primer bimestre cerrado o en curso
    const cerradoOEnCurso = bimestres.find(
      (b) => b.estado === "cerrado" || b.estado === "en_curso",
    );
    return cerradoOEnCurso?.id ?? bimestres[0]?.id ?? "";
  }, [filtros.periodoId, bimestres]);

  // Consulta de datos del tablero (CSP, ISA, IGM)
  const {
    data: tableroData,
    isLoading: cargandoTablero,
    isError: errorTablero,
    refetch: recargarTablero,
    isFetching: actualizandoTablero,
  } = useTableroIndicadoresQuery(filtros, puedeVer && Boolean(anio?.id));

  // Consulta de datos de comparación pretest vs postest
  const {
    data: comparacionData,
    isLoading: cargandoComparacion,
    refetch: recargarComparacion,
  } = useComparacionQuery(bimestreComparacionId, puedeVer && Boolean(bimestreComparacionId));

  const manejarLimpiarFiltros = () => {
    setFiltros({});
  };

  const manejarRecargar = () => {
    void recargarTablero();
    if (bimestreComparacionId) {
      void recargarComparacion();
    }
  };

  // Verificación de autorización de rol
  if (!puedeVer) {
    return (
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6">
        <PageHeader
          title="Indicadores de la Tesis"
          description="Panel de evaluación de impacto del sistema web de gestión académica"
          breadcrumbs={[
            { label: "Inicio", href: "/admin/dashboard" },
            { label: "Reportes" },
            { label: "Indicadores" },
          ]}
        />
        <Alert variant="destructive">
          <HugeiconsIcon icon={AlertCircleIcon} size={20} className="shrink-0" />
          <AlertTitle>Acceso Restringido</AlertTitle>
          <AlertDescription>
            {MENSAJES_INDICADORES.ROL_NO_AUTORIZADO} Este panel es exclusivo para los roles de
            Director, Subdirector y Administrador con alcance institucional.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Estado de carga inicial
  if (cargandoAnio || (cargandoTablero && !tableroData)) {
    return (
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6">
        <PageHeader
          title="Indicadores de la Tesis"
          description="Panel de evaluación de impacto del sistema web de gestión académica"
          breadcrumbs={[
            { label: "Inicio", href: "/admin/dashboard" },
            { label: "Reportes" },
            { label: "Indicadores" },
          ]}
        />
        <TableroSkeleton />
      </div>
    );
  }

  // Estado de error en la consulta
  if (errorTablero && !tableroData) {
    return (
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6">
        <PageHeader
          title="Indicadores de la Tesis"
          description="Panel de evaluación de impacto del sistema web de gestión académica"
          breadcrumbs={[
            { label: "Inicio", href: "/admin/dashboard" },
            { label: "Reportes" },
            { label: "Indicadores" },
          ]}
        />
        <Alert variant="destructive">
          <HugeiconsIcon icon={AlertCircleIcon} size={20} className="shrink-0" />
          <AlertTitle>Error al cargar indicadores</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p>
              No se pudo obtener la información de los indicadores. Por favor, verifique su conexión
              o intente nuevamente.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={manejarRecargar}
              className="bg-background gap-2"
            >
              <HugeiconsIcon icon={RefreshIcon} size={15} />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const enCursoGlobal = tableroData?.enCurso ?? false;
  const periodoNombreMostrado = tableroData?.periodoNombre ?? "Año completo";

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6">
      {/* Encabezado con Migas de Pan y Acciones */}
      <PageHeader
        title="Indicadores de la Tesis"
        description="Seguimiento cuantitativo de prácticas pedagógicas (CSP), seguimiento académico (ISA) y aula virtual (IGM)."
        icon={Analytics01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Reportes" },
          { label: "Indicadores" },
        ]}
        badge={
          anio ? (
            <Badge variant="outline" className="gap-1.5 font-medium">
              <span className="bg-primary size-2 rounded-full" />
              Año {anio.anio}
            </Badge>
          ) : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={manejarRecargar}
              disabled={actualizandoTablero}
              className="gap-2"
              aria-label="Actualizar datos del tablero"
            >
              <HugeiconsIcon
                icon={RefreshIcon}
                size={15}
                strokeWidth={2}
                className={actualizandoTablero ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
          </div>
        }
      />

      {/* Notificación de Valor en Curso */}
      {enCursoGlobal && (
        <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <HugeiconsIcon icon={Clock01Icon} size={18} className="shrink-0 text-amber-600" />
          <AlertTitle className="font-semibold">
            Período en curso ({periodoNombreMostrado})
          </AlertTitle>
          <AlertDescription className="text-xs">
            Los valores mostrados corresponden a la medición dinámica calculada al momento actual.
            Al concluir el período y cerrarse el bimestre, se procederá al congelamiento formal del
            postest.
          </AlertDescription>
        </Alert>
      )}

      {/* Pestañas de Navegación del Módulo */}
      <Tabs value={pestanaActiva} onValueChange={setPestanaActiva} className="space-y-6">
        <TabsList className="bg-muted/80 flex-wrap p-1">
          <TabsTrigger value="tablero" className="gap-2">
            <HugeiconsIcon icon={Analytics01Icon} size={15} />
            <span>Tablero de Indicadores</span>
          </TabsTrigger>
          <TabsTrigger value="medicion" className="gap-2">
            <HugeiconsIcon icon={Archive02Icon} size={15} />
            <span>Mediciones, Pretest y Exportación</span>
          </TabsTrigger>
          <TabsTrigger value="comparacion" className="gap-2">
            <HugeiconsIcon icon={ChartHistogramIcon} size={15} />
            <span>Comparación Pretest – Postest</span>
          </TabsTrigger>
          <TabsTrigger value="evolucion" className="gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
            <span>Evolución Bimestral</span>
          </TabsTrigger>
          <TabsTrigger value="apoyo" className="gap-2">
            <HugeiconsIcon icon={UserSearch01Icon} size={15} />
            <span>Indicadores de apoyo</span>
          </TabsTrigger>
          <TabsTrigger value="panel-general" className="gap-2">
            <HugeiconsIcon icon={DashboardSquare01Icon} size={15} />
            <span>Panel Operativo</span>
          </TabsTrigger>
        </TabsList>

        {/* ================================================================= */}
        {/* PESTAÑA 1: Tablero de Indicadores (Filtros, CSP, ISA, IGM)       */}
        {/* ================================================================= */}
        <TabsContent value="tablero" className="space-y-6 focus-visible:outline-none">
          {/* Barra de Filtros Reactivos */}
          <TableroFiltros
            filtros={filtros}
            onChange={setFiltros}
            onLimpiar={manejarLimpiarFiltros}
            bimestres={bimestres}
            cargando={actualizandoTablero}
          />

          {/* Tarjetas Principales CSP, ISA e IGM */}
          {tableroData ? (
            <TarjetasIndicadoresGrid
              csp={tableroData.csp}
              isa={tableroData.isa}
              igm={tableroData.igm}
              onLimpiarFiltros={manejarLimpiarFiltros}
            />
          ) : (
            <TableroSkeleton />
          )}

          {/* Desglose por Cursos si se filtró por docente */}
          {tableroData?.detallePorCursos && tableroData.detallePorCursos.length > 0 && (
            <DetalleCursosDocente cursos={tableroData.detallePorCursos} />
          )}
        </TabsContent>

        {/* ================================================================= */}
        {/* PESTAÑA 2: Gestión de Medición (Pretest, Cierre, Exportación)     */}
        {/* ================================================================= */}
        <TabsContent value="medicion" className="space-y-6 focus-visible:outline-none">
          <GestionMedicionPanel />
        </TabsContent>

        {/* ================================================================= */}
        {/* PESTAÑA 3: Comparación Pretest vs Postest con Gráfico de Barras   */}
        {/* ================================================================= */}
        <TabsContent value="comparacion" className="space-y-6 focus-visible:outline-none">
          <ComparacionPretestPostest
            comparacionData={comparacionData}
            cargando={cargandoComparacion}
          />
        </TabsContent>

        {/* ================================================================= */}
        {/* PESTAÑA 4: Evolución por Bimestre del Año Lectivo                 */}
        {/* ================================================================= */}
        <TabsContent value="evolucion" className="space-y-6 focus-visible:outline-none">
          {comparacionData?.evolucionBimestres ? (
            <GraficoEvolucionBimestres evolucion={comparacionData.evolucionBimestres} />
          ) : (
            <Card className="border-border/60 text-muted-foreground p-8 text-center text-xs">
              Sin datos de evolución para los períodos del año académico.
            </Card>
          )}
        </TabsContent>

        {/* ================================================================= */}
        {/* PESTAÑA APARTE: Indicadores de apoyo del seguimiento docente      */}
        {/* (RF-020 V2). Separados de la tesis: no se congelan ni se comparan */}
        {/* ================================================================= */}
        <TabsContent value="apoyo" className="space-y-6 focus-visible:outline-none">
          <SeccionApoyo modo="directivo" />
        </TabsContent>

        {/* ================================================================= */}
        {/* PESTAÑA 5: Panel General Operativo (HU4)                          */}
        {/* ================================================================= */}
        <TabsContent value="panel-general" className="space-y-6 focus-visible:outline-none">
          <PanelGeneralVista />
        </TabsContent>
      </Tabs>
    </div>
  );
}
