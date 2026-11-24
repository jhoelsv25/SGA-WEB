"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileExportIcon,
  Download01Icon,
  Upload01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  CancelCircleIcon,
  ArrowLeft01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDropzone } from "@/components/common/file-dropzone";
import { Spinner } from "@/components/common/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useDescargarPlantilla,
  useDescargarReporteCredenciales,
  useEjecutarImportacion,
  useEstadoJobQuery,
  usePrevisualizarImportacion,
} from "../../hooks/use-importacion";
import type {
  EjecutarImportacionResponse,
  TipoImportacion,
  VistaPreviaResponse,
} from "../../types/importacion.types";
import { exportCredencialesReport } from "../../utils/excel-parser";

interface ImportarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: TipoImportacion;
  onSuccess?: () => void;
}

type Paso = "upload" | "preview" | "processing" | "result";

const TITULOS_TIPO: Record<TipoImportacion, string> = {
  personas: "Padrón General de Personas",
  estudiantes: "Padrón de Estudiantes",
  docentes: "Plana Docente",
  apoderados: "Padrón de Apoderados",
};

/**
 * Extrae valores de las filas de importación de forma resiliente
 * soportando camelCase, snake_case o encabezados originales en español.
 */
function getDato(datos: Record<string, unknown> | undefined, ...keys: string[]): string {
  if (!datos) return "";
  for (const k of keys) {
    const v = datos[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v).trim();
    }
  }
  const normalizar = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const targets = keys.map(normalizar);
  for (const [k, v] of Object.entries(datos)) {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      const normK = normalizar(k);
      // Evitar falsos positivos con claves muy cortas como 'n' o '#'
      if (
        targets.some(
          (t) =>
            normK === t ||
            (normK.length >= 3 && t.length >= 3 && (normK.includes(t) || t.includes(normK))),
        )
      ) {
        return String(v).trim();
      }
    }
  }
  return "";
}

export function ImportarModal({ open, onOpenChange, tipo, onSuccess }: ImportarModalProps) {
  const [paso, setPaso] = React.useState<Paso>("upload");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isParsing, setIsParsing] = React.useState(false);
  const [parseError, setParseError] = React.useState<string | undefined>();
  const [vistaPrevia, setVistaPrevia] = React.useState<VistaPreviaResponse | null>(null);
  const [filtroEstado, setFiltroEstado] = React.useState<
    "todos" | "valida" | "ya_registrada" | "error"
  >("todos");
  const [resultadoFinal, setResultadoFinal] = React.useState<EjecutarImportacionResponse | null>(
    null,
  );
  const [activeJobId, setActiveJobId] = React.useState<string | null>(null);
  const hasNotifiedRef = React.useRef(false);
  const queryClient = useQueryClient();

  const descargarMutation = useDescargarPlantilla();
  const descargarReporteMutation = useDescargarReporteCredenciales();
  const previsualizarMutation = usePrevisualizarImportacion();
  const ejecutarMutation = useEjecutarImportacion();
  const estadoJobQuery = useEstadoJobQuery(activeJobId ?? undefined, paso === "processing");

  // Resultado y paso efectivos derivados reactivamente del estado del job
  const resultadoEfectivo =
    resultadoFinal ??
    (estadoJobQuery.data?.estado === "completado" && estadoJobQuery.data.resultado
      ? estadoJobQuery.data.resultado
      : null);

  const pasoEfectivo: Paso = (() => {
    if (resultadoEfectivo) return "result";
    if (paso === "processing") {
      if (estadoJobQuery.data?.estado === "fallido") return "preview";
      return "processing";
    }
    return paso;
  })();

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPaso("upload");
      setSelectedFile(null);
      setIsParsing(false);
      setParseError(undefined);
      setVistaPrevia(null);
      setFiltroEstado("todos");
      setResultadoFinal(null);
      setActiveJobId(null);
      hasNotifiedRef.current = false;
      // Invalida y refresca inmediatamente la lista de la pantalla
      queryClient.invalidateQueries({ queryKey: [tipo] });
      queryClient.invalidateQueries({ queryKey: ["personas"] });
    }
    onOpenChange(newOpen);
  };

  // Notificaciones y efectos externos del worker BullMQ
  React.useEffect(() => {
    if (paso === "processing" && estadoJobQuery.data && !hasNotifiedRef.current) {
      if (estadoJobQuery.data.estado === "completado") {
        hasNotifiedRef.current = true;
        toast.success(estadoJobQuery.data.mensaje || "Importación masiva completada con éxito.");
        queryClient.invalidateQueries({ queryKey: [tipo] });
        queryClient.invalidateQueries({ queryKey: ["personas"] });
        onSuccess?.();
      } else if (estadoJobQuery.data.estado === "fallido") {
        hasNotifiedRef.current = true;
        toast.error(estadoJobQuery.data.error || "Falló la importación masiva en segundo plano.");
      }
    }
  }, [paso, estadoJobQuery.data, onSuccess, queryClient, tipo]);

  // Manejar subida y análisis previo del archivo Excel en el backend (multipart/form-data)
  const handleFileSelect = async (file: File | null) => {
    setSelectedFile(file);
    setParseError(undefined);

    if (!file) return;

    setIsParsing(true);
    try {
      const preview = await previsualizarMutation.mutateAsync({
        tipo,
        archivo: file,
      });

      setVistaPrevia(preview);
      setPaso("preview");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar el archivo Excel.";
      setParseError(msg);
      toast.error(msg);
    } finally {
      setIsParsing(false);
    }
  };

  // Confirmar y ejecutar la importación masiva usando el loteId previsualizado
  const handleConfirmarImportacion = async () => {
    if (!vistaPrevia || vistaPrevia.validasCount === 0 || !vistaPrevia.loteId) {
      toast.error("No hay filas válidas para importar en este lote.");
      return;
    }

    try {
      const res = await ejecutarMutation.mutateAsync({
        tipo,
        loteId: vistaPrevia.loteId,
      });

      if (res.estado === "completado" && res.resultado) {
        // Ejecución síncrona inmediata
        setResultadoFinal(res.resultado);
        setPaso("result");
        onSuccess?.();
      } else if (res.jobId) {
        // Encolado en BullMQ para procesamiento en segundo plano
        setActiveJobId(res.jobId);
        setPaso("processing");
        toast.info("Trabajo encolado en segundo plano. Procesando...");
      } else {
        toast.error("No se pudo iniciar el proceso de importación.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al ejecutar la importación.";
      toast.error(msg);
    }
  };

  // Filas filtradas en la vista previa
  const filasFiltradas = React.useMemo(() => {
    if (!vistaPrevia) return [];
    if (filtroEstado === "todos") return vistaPrevia.filas;
    return vistaPrevia.filas.filter((f) => f.estado === filtroEstado);
  }, [vistaPrevia, filtroEstado]);

  const progresoJob = estadoJobQuery.data?.progreso ?? 0;

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      size="5xl"
      title={`Carga Masiva — ${TITULOS_TIPO[tipo]}`}
      description="Importación por lotes de hasta 500 registros con procesamiento en segundo plano."
    >
      <div className="space-y-6 pt-2">
        {/* Indicador de 4 pasos */}
        <div className="grid grid-cols-4 items-center gap-2 border-b pb-4 text-center">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                pasoEfectivo === "upload"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </span>
            <span
              className={`text-xs sm:text-sm ${pasoEfectivo === "upload" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
            >
              Cargar archivo
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                pasoEfectivo === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </span>
            <span
              className={`text-xs sm:text-sm ${pasoEfectivo === "preview" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
            >
              Vista previa
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                pasoEfectivo === "processing"
                  ? "bg-primary text-primary-foreground animate-pulse"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </span>
            <span
              className={`text-xs sm:text-sm ${pasoEfectivo === "processing" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
            >
              Procesamiento seguro
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                pasoEfectivo === "result"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              4
            </span>
            <span
              className={`text-xs sm:text-sm ${pasoEfectivo === "result" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
            >
              Credenciales emitidas
            </span>
          </div>
        </div>

        {/* PASO 1: SUBIR ARCHIVO */}
        {pasoEfectivo === "upload" && (
          <div className="space-y-6">
            <div className="bg-muted/40 flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
              <div>
                <h4 className="text-foreground text-sm font-semibold">
                  Plantilla oficial recomendada
                </h4>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Incluye listas desplegables, las columnas obligatorias marcadas con * y una hoja
                  de instrucciones. Escriba los datos en la hoja «Datos» sin cambiar los
                  encabezados.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => descargarMutation.mutate(tipo)}
                disabled={descargarMutation.isPending}
                className="shrink-0 gap-1.5"
              >
                {descargarMutation.isPending ? (
                  <Spinner size="xs" />
                ) : (
                  <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
                )}
                Descargar Plantilla (.xlsx)
              </Button>
            </div>

            <div>
              <FileDropzone
                file={selectedFile}
                onFileSelect={handleFileSelect}
                accept=".xlsx"
                acceptedFormats={[".xlsx"]}
                title="Arrastre el archivo Excel aquí o haga clic para examinar"
                description="Soporta archivos .xlsx de hasta 500 filas de registros"
                disabled={isParsing || previsualizarMutation.isPending}
                error={parseError}
              />

              {(isParsing || previsualizarMutation.isPending) && (
                <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-sm">
                  <Spinner size="sm" />
                  <span>Analizando filas y validando contra el padrón...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASO 2: VISTA PREVIA Y SEMÁFORO */}
        {pasoEfectivo === "preview" && vistaPrevia && (
          <div className="space-y-4">
            {/* Tarjetas de Métricas de Semáforo */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                onClick={() => setFiltroEstado("todos")}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  filtroEstado === "todos"
                    ? "border-primary bg-primary/5"
                    : "bg-card hover:bg-muted/50"
                }`}
              >
                <div className="text-muted-foreground text-xs">Total Leídas</div>
                <div className="text-foreground mt-1 text-xl font-bold">
                  {vistaPrevia.totalFilas}
                </div>
              </div>

              <div
                onClick={() => setFiltroEstado("valida")}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  filtroEstado === "valida"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "bg-card hover:bg-emerald-500/5"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Válidas para importar
                </div>
                <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {vistaPrevia.validasCount}
                </div>
              </div>

              <div
                onClick={() => setFiltroEstado("ya_registrada")}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  filtroEstado === "ya_registrada"
                    ? "border-amber-500 bg-amber-500/10"
                    : "bg-card hover:bg-amber-500/5"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Ya registradas (omitir)
                </div>
                <div className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">
                  {vistaPrevia.omitidasCount}
                </div>
              </div>

              <div
                onClick={() => setFiltroEstado("error")}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  filtroEstado === "error"
                    ? "border-rose-500 bg-rose-500/10"
                    : "bg-card hover:bg-rose-500/5"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Con error
                </div>
                <div className="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">
                  {vistaPrevia.erroresCount}
                </div>
              </div>
            </div>

            {/* Aviso informativo */}
            {vistaPrevia.erroresCount > 0 && (
              <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
                <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Hay {vistaPrevia.erroresCount} filas con errores que no podrán procesarse. Las
                  filas válidas ({vistaPrevia.validasCount}) sí pueden ser importadas.
                </span>
              </div>
            )}

            {/* Tabla de filas previsualizadas */}
            <div className="bg-card rounded-lg border">
              <ScrollArea className="h-72">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">Fila</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Nombres y Apellidos</TableHead>
                      <TableHead>Identificador / Clave</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead>Observación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filasFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-muted-foreground py-8 text-center text-sm"
                        >
                          No hay filas en este estado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filasFiltradas.map((fila) => (
                        <TableRow key={fila.numeroFila}>
                          <TableCell className="text-muted-foreground text-center font-mono text-xs">
                            {fila.numeroFila}
                          </TableCell>
                          <TableCell className="text-xs font-medium">
                            {(
                              getDato(fila.datos, "tipoDocumento", "tipo_documento", "tipo") ||
                              "DNI"
                            ).toUpperCase()}
                            :{" "}
                            {getDato(
                              fila.datos,
                              "numeroDocumento",
                              "numero_documento",
                              "documento",
                              "dni",
                              "num_doc",
                            ) || "—"}
                          </TableCell>
                          <TableCell className="text-xs font-medium">
                            {[
                              getDato(fila.datos, "nombres", "nombre"),
                              getDato(fila.datos, "apellidoPaterno", "apellido_paterno", "paterno"),
                              getDato(fila.datos, "apellidoMaterno", "apellido_materno", "materno"),
                            ]
                              .filter(Boolean)
                              .join(" ") || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {getDato(
                              fila.datos,
                              "codigoSiagie",
                              "codigo_siagie",
                              "codigoDocente",
                              "codigo_docente",
                              "codigoSiagieEstudiante",
                              "codigo",
                              "siagie",
                            ) || "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            {fila.estado === "valida" && (
                              <Badge
                                variant="outline"
                                className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-[11px] text-emerald-600 dark:text-emerald-400"
                              >
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3 w-3" />
                                Válida
                              </Badge>
                            )}
                            {fila.estado === "ya_registrada" && (
                              <Badge
                                variant="outline"
                                className="gap-1 border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-600 dark:text-amber-400"
                              >
                                <HugeiconsIcon icon={AlertCircleIcon} className="h-3 w-3" />
                                Omitida
                              </Badge>
                            )}
                            {fila.estado === "error" && (
                              <Badge
                                variant="outline"
                                className="gap-1 border-rose-500/30 bg-rose-500/10 text-[11px] text-rose-600 dark:text-rose-400"
                              >
                                <HugeiconsIcon icon={CancelCircleIcon} className="h-3 w-3" />
                                Error
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-xs truncate text-xs">
                            {fila.mensaje ??
                              (fila.estado === "valida" ? "Listo para registrar" : "—")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Barra de acciones de vista previa */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaso("upload")}
                disabled={ejecutarMutation.isPending}
                className="gap-1.5"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
                Cargar otro archivo
              </Button>

              <Button
                size="sm"
                onClick={handleConfirmarImportacion}
                disabled={ejecutarMutation.isPending || vistaPrevia.validasCount === 0}
                className="gap-1.5"
              >
                {ejecutarMutation.isPending ? (
                  <Spinner size="xs" />
                ) : (
                  <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4" />
                )}
                Confirmar e Importar {vistaPrevia.validasCount} Registros
              </Button>
            </div>
          </div>
        )}

        {/* PASO 3: PROCESAMIENTO SEGURO EN LOTE */}
        {pasoEfectivo === "processing" && (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <div className="bg-primary/10 relative flex h-16 w-16 items-center justify-center rounded-full">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  className="text-primary h-8 w-8 animate-spin [animation-duration:3s]"
                />
              </div>
              <div>
                <h3 className="text-foreground text-base font-semibold">
                  Procesando e inscribiendo en el sistema institucional
                </h3>
                <p className="text-muted-foreground mx-auto mt-1 max-w-md text-xs">
                  El lote de {vistaPrevia?.validasCount ?? 0} registros está siendo validado y
                  registrado en la base de datos oficial, emitiendo legajos escolares y credenciales
                  seguras de acceso.
                </p>
              </div>

              {activeJobId && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    Lote de Operación: #{activeJobId}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary flex items-center gap-1.5 text-xs"
                  >
                    <Spinner size="xs" />
                    {estadoJobQuery.data?.estado === "procesando"
                      ? "Inscribiendo registros..."
                      : "En espera de turno..."}
                  </Badge>
                </div>
              )}
            </div>

            {/* Barra de Progreso */}
            <div className="mx-auto w-full max-w-lg space-y-2">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Progreso de inscripción</span>
                <span className="text-foreground font-mono font-medium">{progresoJob}%</span>
              </div>
              <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(progresoJob, 5)}%` }}
                />
              </div>
              <p className="text-muted-foreground pt-1 text-center text-[11px]">
                {estadoJobQuery.data?.mensaje || "Preparando procesamiento de registros..."}
              </p>
            </div>

            <div className="bg-muted/40 text-muted-foreground mx-auto max-w-lg rounded-lg border p-4 text-xs">
              <p>
                💡 <strong>Aviso institucional:</strong> Al culminar el procesamiento, podrá
                descargar el acta y reporte oficial en Excel con las cuentas de acceso, contraseñas
                temporales y PINs de marcación escolar para su entrega personal y resguardo
                confidencial.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
                Cerrar ventana (el proceso continuará en segundo plano)
              </Button>
            </div>
          </div>
        )}

        {/* PASO 4: RESULTADO Y CREDENCIALES */}
        {pasoEfectivo === "result" && resultadoEfectivo && (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2.5 font-semibold text-emerald-700 dark:text-emerald-300">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5 text-emerald-600" />
                <span>Inscripción completada exitosamente</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">{resultadoEfectivo.mensaje}</p>
            </div>

            {/* Reporte de credenciales emitidas */}
            {resultadoEfectivo.credenciales.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h4 className="text-foreground text-sm font-semibold">
                      Credenciales de Marcación y Cuentas de Acceso (
                      {resultadoEfectivo.credenciales.length})
                    </h4>
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Atención: Las contraseñas temporales y PINs de marcación se muestran por única
                      vez. Descargue el reporte oficial para su resguardo institucional.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      if (activeJobId) {
                        descargarReporteMutation.mutate({ jobId: activeJobId, tipo });
                      } else {
                        exportCredencialesReport(resultadoEfectivo.credenciales, tipo);
                      }
                    }}
                    disabled={descargarReporteMutation.isPending}
                    className="shrink-0 gap-1.5 text-xs font-semibold shadow-sm"
                  >
                    {descargarReporteMutation.isPending ? (
                      <Spinner size="xs" />
                    ) : (
                      <HugeiconsIcon icon={FileExportIcon} className="h-4 w-4" />
                    )}
                    Descargar Reporte Oficial (.xlsx)
                  </Button>
                </div>

                <div className="bg-card rounded-lg border">
                  <ScrollArea className="h-60">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre Completo</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Contraseña Temp.</TableHead>
                          <TableHead>Código Credencial</TableHead>
                          <TableHead className="text-center">PIN</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultadoEfectivo.credenciales.map((cred, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-xs font-medium">
                              {cred.nombreCompleto}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {cred.numeroDocumento}
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono text-xs">
                              {cred.nombreUsuario ?? "—"}
                            </TableCell>
                            <TableCell className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                              {cred.tempPassword ?? "—"}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {cred.codigoCredencial ?? "—"}
                            </TableCell>
                            <TableCell className="text-primary text-center font-mono text-xs font-bold">
                              {cred.pin ?? "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => handleOpenChange(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
