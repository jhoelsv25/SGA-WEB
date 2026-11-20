"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Upload01Icon,
  Delete02Icon,
  Folder01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "@/lib/toast";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { importacionApi } from "../../api/importacion.api";
import type { ResultadoFotos, TipoFotosImportacion } from "../../types/importacion.types";

interface CargarFotosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: TipoFotosImportacion;
  onSuccess?: () => void;
}

type Paso = "seleccion" | "procesando" | "resultado";

export function CargarFotosModal({ open, onOpenChange, tipo, onSuccess }: CargarFotosModalProps) {
  const [paso, setPaso] = React.useState<Paso>("seleccion");
  const [archivos, setArchivos] = React.useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [jobId, setJobId] = React.useState<string | null>(null);
  const [progreso, setProgreso] = React.useState(0);
  const [resultado, setResultado] = React.useState<ResultadoFotos | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const pollingRef = React.useRef<NodeJS.Timeout | null>(null);

  const etiquetaTipo = tipo === "estudiantes" ? "Estudiantes" : "Docentes";
  const etiquetaSingular = tipo === "estudiantes" ? "estudiante" : "docente";

  const limpiarEstado = React.useCallback(() => {
    setPaso("seleccion");
    setArchivos([]);
    setIsSubmitting(false);
    setJobId(null);
    setProgreso(0);
    setResultado(null);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const handleOpenChange = (nuevoOpen: boolean) => {
    if (!nuevoOpen && paso === "procesando") {
      toast.info("El procesamiento continuará ejecutándose en segundo plano.");
    }
    if (!nuevoOpen) {
      limpiarEstado();
    }
    onOpenChange(nuevoOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const nuevosArchivos = Array.from(files);
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setArchivos((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const eliminarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const iniciarSubida = async () => {
    if (archivos.length === 0) {
      toast.error("Selecciona al menos una imagen o un archivo comprimido .zip");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("tipo", tipo);

      for (const file of archivos) {
        formData.append("archivos", file);
      }

      const res = await importacionApi.subirFotosMasivas(formData);
      setJobId(res.jobId);
      setPaso("procesando");
      toast.info(res.mensaje);

      // Iniciar sondeo del job en BullMQ
      iniciarPolling(res.jobId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar la subida de fotos.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const iniciarPolling = (id: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const estadoJob = await importacionApi.getEstadoFotosJob(id);
        setProgreso(estadoJob.progreso || 0);

        if (estadoJob.estado === "completado" && estadoJob.resultado) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setResultado(estadoJob.resultado);
          setPaso("resultado");
          toast.success(`¡Fotos procesadas! ${estadoJob.resultado.exitosos} asignadas con éxito.`);
        } else if (estadoJob.estado === "fallido") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPaso("seleccion");
          toast.error(estadoJob.error || "El trabajo de fotos en BullMQ falló.");
        }
      } catch {
        // Fallo transitorio de red al consultar el estado
      }
    }, 1500);
  };

  React.useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const totalPesoBytes = React.useMemo(() => {
    return archivos.reduce((acc, f) => acc + f.size, 0);
  }, [archivos]);

  const formatoPeso = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={`Carga Masiva de Fotos — ${etiquetaTipo}`}
      description="Asigna fotos de perfil y carné a través del DNI o Código institucional en segundo plano."
      size="lg"
    >
      <div className="space-y-4 pt-1">
        {/* PASO 1: SELECCIÓN DE ARCHIVOS */}
        {paso === "seleccion" && (
          <div className="space-y-4">
            {/* Tarjeta de instrucciones */}
            <div className="border-border/60 bg-muted/40 rounded-xl border p-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  className="text-primary mt-0.5 size-4 shrink-0"
                />
                <div className="space-y-1">
                  <p className="text-foreground font-semibold">
                    ¿Cómo deben llamarse las fotos para emparejarse automáticamente?
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Cada archivo debe llevar el <strong>DNI</strong> (ej:{" "}
                    <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">
                      70123456.jpg
                    </code>
                    ) o el <strong>Código</strong> del {etiquetaSingular} (ej:{" "}
                    <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">
                      {tipo === "estudiantes" ? "EST-2024-001.png" : "DOC-005.jpg"}
                    </code>
                    ). Puedes seleccionar múltiples fotos de golpe o un archivo{" "}
                    <strong>.ZIP</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Zona de Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-muted-foreground/25 hover:border-primary/60 hover:bg-muted/20 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.zip"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                <HugeiconsIcon icon={Upload01Icon} className="size-6" />
              </div>
              <p className="text-foreground text-sm font-semibold">
                Haz clic para seleccionar o arrastra fotos / archivo .ZIP aquí
              </p>
              <p className="text-muted-foreground text-xs">
                Formatos permitidos: JPG, PNG, WEBP o ZIP (hasta 500 fotos por paquete)
              </p>
            </div>

            {/* Lista de archivos seleccionados */}
            {archivos.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-semibold">
                    {archivos.length} {archivos.length === 1 ? "archivo" : "archivos"} seleccionados
                    ({formatoPeso(totalPesoBytes)})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setArchivos([])}
                    className="text-destructive hover:bg-destructive/10 h-7 text-xs"
                  >
                    Vaciar lista
                  </Button>
                </div>

                <ScrollArea className="border-border/60 bg-muted/20 max-h-48 rounded-lg border p-2">
                  <div className="space-y-1">
                    {archivos.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="bg-background/80 flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-xs shadow-2xs"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <HugeiconsIcon
                            icon={file.name.endsWith(".zip") ? Folder01Icon : Camera01Icon}
                            className="text-muted-foreground size-4 shrink-0"
                          />
                          <span className="text-foreground truncate font-mono text-xs">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-muted-foreground font-mono text-[11px]">
                            {formatoPeso(file.size)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              eliminarArchivo(idx);
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            title="Quitar archivo"
                          >
                            <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Acciones */}
            <div className="border-border/50 flex justify-end gap-2 border-t pt-2">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onClick={iniciarSubida}
                disabled={archivos.length === 0 || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Spinner className="size-4" />
                ) : (
                  <HugeiconsIcon icon={Upload01Icon} className="size-4" />
                )}
                <span>Procesar fotos ({archivos.length})</span>
              </Button>
            </div>
          </div>
        )}

        {/* PASO 2: PROCESANDO EN BULLMQ */}
        {paso === "procesando" && (
          <div className="space-y-6 py-6 text-center">
            <div className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-full">
              <Spinner className="size-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-foreground text-base font-semibold">
                Procesando fotos en segundo plano...
              </h3>
              <p className="text-muted-foreground mx-auto max-w-md text-xs">
                BullMQ está validando los archivos, optimizando los formatos y emparejando cada foto
                con el {etiquetaSingular} correspondiente.
              </p>
            </div>

            {/* Barra de progreso */}
            <div className="mx-auto max-w-sm space-y-2">
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <p className="text-muted-foreground font-mono text-xs">{progreso}% completado</p>
            </div>

            <p className="text-muted-foreground text-[11px]">
              ID del trabajo en cola: <code className="font-mono">{jobId}</code>
            </p>
          </div>
        )}

        {/* PASO 3: RESULTADO FINAL */}
        {paso === "resultado" && resultado && (
          <div className="space-y-4">
            {/* Tarjetas de métricas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border-border/60 bg-muted/30 rounded-xl border p-3 text-center">
                <p className="text-muted-foreground text-xs">Total fotos</p>
                <p className="text-foreground font-mono text-xl font-bold">{resultado.total}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Asignadas
                </p>
                <p className="font-mono text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {resultado.exitosos}
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  No encontradas
                </p>
                <p className="font-mono text-xl font-bold text-amber-700 dark:text-amber-400">
                  {resultado.omitidos}
                </p>
              </div>
            </div>

            {/* Detalle de fotos asignadas */}
            {resultado.asignados.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                  <span>Fotos asignadas exitosamente ({resultado.asignados.length}):</span>
                </div>
                <ScrollArea className="border-border/60 bg-muted/20 max-h-36 rounded-lg border p-2">
                  <div className="space-y-1">
                    {resultado.asignados.map((a, i) => (
                      <div
                        key={`${a.personaId}-${i}`}
                        className="bg-background/80 flex items-center justify-between rounded px-2 py-1 text-xs"
                      >
                        <span className="text-foreground max-w-xs truncate font-semibold">
                          {a.nombreCompleto}
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {a.archivo}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Detalle de fotos no encontradas / omitidas */}
            {resultado.detallesOmitidos.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
                  <span>Fotos no emparejadas ({resultado.detallesOmitidos.length}):</span>
                </div>
                <ScrollArea className="border-border/60 bg-muted/20 max-h-36 rounded-lg border p-2">
                  <div className="space-y-1">
                    {resultado.detallesOmitidos.map((o, i) => (
                      <div
                        key={`${o.archivo}-${i}`}
                        className="bg-background/80 flex items-center justify-between rounded px-2 py-1 text-xs"
                      >
                        <span className="text-foreground font-mono font-medium">{o.archivo}</span>
                        <span className="text-muted-foreground max-w-xs truncate text-[11px]">
                          {o.motivo}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Botón de cierre */}
            <div className="border-border/50 flex justify-end border-t pt-2">
              <Button
                onClick={() => {
                  handleOpenChange(false);
                  onSuccess?.();
                }}
                className="gap-2"
              >
                <span>Finalizar y actualizar lista</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
