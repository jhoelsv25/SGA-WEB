"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircleIcon,
  Analytics01Icon,
  FileExportIcon,
  PlusSignIcon,
  RefreshIcon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { exportDataToSpreadsheet, type ExportColumnDef } from "@/lib/export-data";
import { toast } from "@/lib/toast";
import {
  useDescargarFichaPdf,
  useGenerarConsolidadoDocente,
  useGenerarTodosConsolidados,
  usePuedeGestionarConsolidado,
  usePuedeVerConsolidadoBimestre,
  useReabrirConsolidado,
  useReporteBimestre,
} from "../../hooks";
import type { ConsolidadoResumenDto } from "../../types";
import { obtenerEtiquetaDecision } from "../../utils";
import { ConsolidadoMetricas } from "./consolidado-metricas";
import { ConsolidadoTabla } from "./consolidado-tabla";
import { ModalCerrarConsolidado } from "./modal-cerrar-consolidado";
import { ModalDetalleDocente } from "./modal-detalle-docente";
import { ModalGenerarIndividual } from "./modal-generar-individual";
import { ModalHistorialConsolidado } from "./modal-historial-consolidado";

/** Definición de columnas para la exportación a hoja de cálculo Excel */
const COLUMNAS_EXPORTACION_EXCEL: ExportColumnDef<ConsolidadoResumenDto>[] = [
  { key: "docenteNombre", header: "Docente" },
  { key: "docenteDocumento", header: "Documento" },
  { key: "periodoNombre", header: "Bimestre" },
  { key: "sesionesProgramadas", header: "Sesiones Programadas" },
  { key: "sesionesCumplidas", header: "Sesiones Cumplidas" },
  { key: "sesionesParciales", header: "Sesiones Parciales" },
  { key: "sesionesNoCumplidas", header: "Sesiones No Cumplidas" },
  { key: "sesionesJustificadas", header: "Sesiones Justificadas" },
  { key: "minutosPerdidosFirma", header: "Minutos Perdidos Firma" },
  { key: "totalAusencias", header: "Total Ausencias" },
  { key: "minutosFueraAula", header: "Minutos Fuera Aula" },
  { key: "tiempoFueraClaseTexto", header: "Tiempo Fuera Clase" },
  { key: "version", header: "Versión" },
  {
    key: "estado",
    header: "Estado",
    format: (v) => (v === "cerrado" ? "Cerrado" : "Reabierto"),
  },
  {
    key: "decision",
    header: "Decisión Directiva",
    format: (v) => obtenerEtiquetaDecision(v as ConsolidadoResumenDto["decision"]),
  },
  {
    key: "observacion",
    header: "Observación",
    format: (v) => (v ? String(v) : "-"),
  },
];

/**
 * Vista principal «Consolidado del bimestre» (Director / Subdirector) (RF-013).
 */
export function ConsolidadoBimestreVista() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const puedeVer = usePuedeVerConsolidadoBimestre();
  const puedeGestionar = usePuedeGestionarConsolidado();

  const { anio, cargando: cargandoAnio } = useAnioLectivo();
  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio?.bimestres]);

  // Bimestre seleccionado en sincronización con la URL
  const periodoIdParam = searchParams.get("periodoId");

  const periodoSeleccionado = React.useMemo(() => {
    if (bimestres.length === 0) return null;
    if (periodoIdParam) {
      const encontrado = bimestres.find((b) => b.id === periodoIdParam);
      if (encontrado) return encontrado;
    }
    // Por defecto: el bimestre en curso o el primer cerrado o el primero de la lista
    const enCurso = bimestres.find((b) => b.estado === "en_curso");
    if (enCurso) return enCurso;
    const cerrado = [...bimestres].reverse().find((b) => b.estado === "cerrado");
    if (cerrado) return cerrado;
    return bimestres[0];
  }, [bimestres, periodoIdParam]);

  const periodoId = periodoSeleccionado?.id;

  const handleCambiarPeriodo = (nuevoId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("periodoId", nuevoId);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Texto de búsqueda para filtrado reactivo de docentes
  const [busquedaTexto, setBusquedaTexto] = React.useState("");

  // Query del reporte consolidado del bimestre
  const {
    data: reporteData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useReporteBimestre(periodoId, undefined, Boolean(periodoId));

  // Filtrado de docentes por búsqueda
  const docentesFiltrados = React.useMemo(() => {
    const lista = reporteData?.docentes ?? [];
    if (!busquedaTexto.trim()) return lista;
    const termino = busquedaTexto.toLowerCase().trim();
    return lista.filter(
      (d) =>
        d.docenteNombre.toLowerCase().includes(termino) ||
        d.docenteDocumento.toLowerCase().includes(termino),
    );
  }, [reporteData?.docentes, busquedaTexto]);

  // Mutaciones
  const generarTodosMutation = useGenerarTodosConsolidados();
  const generarUnoMutation = useGenerarConsolidadoDocente();
  const reabrirMutation = useReabrirConsolidado();
  const descargarFichaMutation = useDescargarFichaPdf();

  // Estados de modales y diálogos de confirmación
  const [modalDetalleId, setModalDetalleId] = React.useState<string | null>(null);
  const [modalHistorial, setModalHistorial] = React.useState<{
    id: string;
    docenteNombre: string;
  } | null>(null);
  const [modalCerrar, setModalCerrar] = React.useState<ConsolidadoResumenDto | null>(null);
  const [modalGenerarIndividual, setModalGenerarIndividual] = React.useState(false);
  const [confirmGenerarTodos, setConfirmGenerarTodos] = React.useState(false);
  const [confirmReabrir, setConfirmReabrir] = React.useState<{
    id: string;
    docenteNombre: string;
  } | null>(null);

  // Exportación a Excel de los datos filtrados y ordenados
  const handleExportarExcel = () => {
    if (docentesFiltrados.length === 0) {
      toast.info("No hay datos disponibles para exportar en este bimestre.");
      return;
    }
    const nombrePeriodo = periodoSeleccionado?.nombre || "Bimestre";
    const nombreLimpio = `reporte-seguimiento-${nombrePeriodo.replace(/\s+/g, "_")}-${new Date().toISOString().split("T")[0]}`;

    exportDataToSpreadsheet({
      data: docentesFiltrados,
      columns: COLUMNAS_EXPORTACION_EXCEL,
      filename: nombreLimpio,
      sheetName: nombrePeriodo,
      format: "xlsx",
    });
    toast.success("Archivo Excel exportado exitosamente.");
  };

  // Confirmación de generación masiva (CP-RF013-01)
  const handleConfirmarGenerarTodos = async () => {
    if (!periodoId) return;
    try {
      await generarTodosMutation.mutateAsync(periodoId);
      setConfirmGenerarTodos(false);
      void refetch();
    } catch {
      // El error (ej. bimestre abierto) se notifica vía toast
    }
  };

  // Confirmación de reapertura (CP-RF013-07)
  const handleConfirmarReabrir = async () => {
    if (!confirmReabrir) return;
    try {
      await reabrirMutation.mutateAsync(confirmReabrir.id);
      setConfirmReabrir(null);
      void refetch();
    } catch {
      // El error se notifica vía toast
    }
  };

  // Descarga directa de ficha PDF (CP-RF013-18)
  const handleDescargarFicha = (consolidado: ConsolidadoResumenDto) => {
    const nombre = `ficha-seguimiento-${consolidado.docenteNombre.replace(/\s+/g, "_")}-${consolidado.periodoNombre.replace(/\s+/g, "_")}.pdf`;
    void descargarFichaMutation.mutateAsync({
      id: consolidado.id,
      nombreArchivo: nombre,
    });
  };

  // Generación individual (CP-RF013-02, CP-RF013-04)
  const handleGenerarUno = async (consolidado: ConsolidadoResumenDto) => {
    if (!periodoId) return;
    try {
      await generarUnoMutation.mutateAsync({
        periodoId,
        docenteId: consolidado.docenteId,
      });
      void refetch();
    } catch {
      // Mensaje de error (ej. consolidado ya existe) se notifica tal cual llega del servidor
    }
  };

  if (!puedeVer) {
    return (
      <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
        <PageHeader
          title="Consolidado del bimestre"
          description="Supervisión y control del tiempo de seguimiento docente por bimestre."
          icon={Analytics01Icon}
          breadcrumbs={[
            { label: "Inicio", href: "/admin/dashboard" },
            { label: "Consolidado del bimestre" },
          ]}
        />
        <EmptyState
          title="Acceso restringido"
          description="No cuenta con los permisos necesarios para visualizar el consolidado del bimestre."
          icon={AlertCircleIcon}
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      {/* Cabecera institucional de la página */}
      <PageHeader
        title="Consolidado del bimestre"
        description="Supervisión de sesiones, firmas y ausencias docentes con control de versiones y decisiones directivas."
        icon={Analytics01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Consolidado del bimestre" },
        ]}
      />

      {/* Métricas agregadas del bimestre seleccionado */}
      <ConsolidadoMetricas
        totalDocentes={reporteData?.totalDocentes ?? 0}
        totalMinutosPerdidosFirma={reporteData?.totalMinutosPerdidosFirma ?? 0}
        totalMinutosFueraAula={reporteData?.totalMinutosFueraAula ?? 0}
        tiempoTotalFueraClaseTexto={reporteData?.tiempoTotalFueraClaseTexto ?? "0 h 0 min"}
        isLoading={isLoading || cargandoAnio}
      />

      {/* Barra de herramientas: selector de bimestre, búsqueda y acciones */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Bimestre del Año académico */}
          <div className="w-56 sm:w-64">
            <Select
              value={periodoId ?? ""}
              onValueChange={handleCambiarPeriodo}
              disabled={cargandoAnio || bimestres.length === 0}
            >
              <SelectTrigger size="sm" className="h-10 text-xs shadow-2xs">
                <SelectValue placeholder="Seleccione un bimestre..." />
              </SelectTrigger>
              <SelectContent>
                {bimestres.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.nombre} (
                    {b.estado === "en_curso"
                      ? "En curso"
                      : b.estado === "cerrado"
                        ? "Cerrado"
                        : "Planificado"}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado del período seleccionado */}
          {periodoSeleccionado && (
            <Badge
              variant="outline"
              className={`text-2xs font-medium ${
                periodoSeleccionado.estado === "cerrado"
                  ? "bg-muted text-foreground"
                  : periodoSeleccionado.estado === "en_curso"
                    ? "border-primary/30 text-primary bg-primary/5"
                    : "text-muted-foreground"
              }`}
            >
              {periodoSeleccionado.estado === "en_curso"
                ? "Bimestre en curso"
                : periodoSeleccionado.estado === "cerrado"
                  ? "Bimestre cerrado"
                  : "Bimestre planificado"}
            </Badge>
          )}

          {/* Campo de búsqueda reactivo por docente */}
          <div className="w-full sm:w-56 lg:w-64">
            <InputGroup className="border-border/80 bg-card h-10 rounded-2xl shadow-2xs">
              <InputGroupAddon align="inline-start" className="text-muted-foreground pl-3">
                <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Buscar por docente o DNI..."
                value={busquedaTexto}
                onChange={(e) => setBusquedaTexto(e.target.value)}
                className="text-xs font-medium"
              />
            </InputGroup>
          </div>
        </div>

        {/* Acciones principales del Director y Subdirector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Botones directivos mutacionales (solo Director / Administrador) */}
          {puedeGestionar && (
            <>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setConfirmGenerarTodos(true)}
                disabled={!periodoId || isFetching || generarTodosMutation.isPending}
                aria-busy={generarTodosMutation.isPending}
                className="gap-1.5 text-xs shadow-xs"
              >
                {generarTodosMutation.isPending ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                )}
                <span>Generar consolidado</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalGenerarIndividual(true)}
                disabled={!periodoId || isFetching}
                className="gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={UserIcon} className="size-3.5" />
                <span>Generar uno</span>
              </Button>
            </>
          )}

          {/* Exportar a Excel (exactamente lo filtrado y ordenado) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportarExcel}
            disabled={docentesFiltrados.length === 0}
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={FileExportIcon} className="size-3.5" />
            <span>Exportar a Excel</span>
          </Button>

          {/* Botón de refresco */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Actualizar listado de consolidados"
            className="text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
          </Button>
        </div>
      </div>

      {/* Tabla con ordenamiento determinista y soporte responsive */}
      <ConsolidadoTabla
        data={docentesFiltrados}
        isLoading={isLoading || cargandoAnio}
        isError={isError}
        onRetry={() => void refetch()}
        puedeGestionar={puedeGestionar}
        hasActiveFilters={Boolean(busquedaTexto.trim())}
        onGenerarTodos={() => setConfirmGenerarTodos(true)}
        onVerDetalle={(c) => setModalDetalleId(c.id)}
        onVerHistorial={(c) => setModalHistorial({ id: c.id, docenteNombre: c.docenteNombre })}
        onDescargarFicha={handleDescargarFicha}
        onReabrir={(c) => setConfirmReabrir({ id: c.id, docenteNombre: c.docenteNombre })}
        onCerrar={(c) => setModalCerrar(c)}
        onRegistrarDecision={(c) => setModalDetalleId(c.id)}
        onGenerarUno={handleGenerarUno}
      />

      {/* Modal de Detalle Completo del Docente */}
      <ModalDetalleDocente
        consolidadoId={modalDetalleId}
        open={Boolean(modalDetalleId)}
        onOpenChange={(abierto) => !abierto && setModalDetalleId(null)}
        puedeGestionar={puedeGestionar}
        onVerHistorial={(id, docenteNombre) => {
          setModalDetalleId(null);
          setModalHistorial({ id, docenteNombre });
        }}
        onReabrir={(id, docenteNombre) => {
          setModalDetalleId(null);
          setConfirmReabrir({ id, docenteNombre });
        }}
        onCerrar={(id, _docenteNombre, _version) => {
          setModalDetalleId(null);
          const c = docentesFiltrados.find((item) => item.id === id);
          if (c) setModalCerrar(c);
        }}
      />

      {/* Modal de Historial de Versiones */}
      <ModalHistorialConsolidado
        consolidadoId={modalHistorial?.id ?? null}
        docenteNombre={modalHistorial?.docenteNombre}
        open={Boolean(modalHistorial)}
        onOpenChange={(abierto) => !abierto && setModalHistorial(null)}
      />

      {/* Modal de Cierre de Consolidado con Motivo */}
      <ModalCerrarConsolidado
        consolidado={modalCerrar}
        open={Boolean(modalCerrar)}
        onOpenChange={(abierto) => !abierto && setModalCerrar(null)}
        onSuccess={() => void refetch()}
      />

      {/* Modal de Generación Individual */}
      {periodoId && periodoSeleccionado && (
        <ModalGenerarIndividual
          periodoId={periodoId}
          periodoNombre={periodoSeleccionado.nombre}
          open={modalGenerarIndividual}
          onOpenChange={setModalGenerarIndividual}
          onSuccess={() => void refetch()}
        />
      )}

      {/* Diálogo de Confirmación: Generar para todos (CP-RF013-01) */}
      <ConfirmDialog
        open={confirmGenerarTodos}
        onOpenChange={setConfirmGenerarTodos}
        variant="default"
        title={`¿Generar consolidado del ${periodoSeleccionado?.nombre || "bimestre"}?`}
        description="Se calcularán las sesiones cumplidas, parciales, no cumplidas, firmas y ausencias vigentes de todos los docentes con sesiones en este bimestre. Cada docente recibirá una notificación."
        confirmText="Generar para todos"
        cancelText="Cancelar"
        onConfirm={handleConfirmarGenerarTodos}
        isLoading={generarTodosMutation.isPending}
      />

      {/* Diálogo de Confirmación: Reabrir consolidado (CP-RF013-07) */}
      <ConfirmDialog
        open={Boolean(confirmReabrir)}
        onOpenChange={(abierto) => !abierto && setConfirmReabrir(null)}
        variant="warning"
        title={`¿Reabrir consolidado de ${confirmReabrir?.docenteNombre}?`}
        description="Al reabrir el consolidado, se habilitará nuevamente la corrección de sesiones y ausencias del docente en este bimestre. El docente será notificado."
        confirmText="Reabrir consolidado"
        cancelText="Cancelar"
        onConfirm={handleConfirmarReabrir}
        isLoading={reabrirMutation.isPending}
      />
    </div>
  );
}
