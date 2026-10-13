"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CloudUploadIcon,
  File01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/formatters/date";
import { toast } from "@/lib/toast";
import { useDetalleTarea, useEntregarTarea, useGuardarProgreso, useIniciarIntento } from "../hooks";
import { urlDeArchivo } from "../api";
import type { Tarea } from "../types";

function ContenidoResolverTarea({
  tarea,
  onCerrar,
  refetchDetalle,
}: {
  tarea: Tarea;
  onCerrar: () => void;
  refetchDetalle: () => void;
}) {
  const entregar = useEntregarTarea();
  const iniciar = useIniciarIntento();
  const guardarProgreso = useGuardarProgreso();

  const miEntrega = tarea.miEntrega;
  const esEvaluacion = tarea.tipo === "cuestionario" || tarea.tipo === "examen";

  // Estados para Trabajo / Proyecto
  const [texto, setTexto] = React.useState(miEntrega?.texto || "");
  const [enlaceUrl, setEnlaceUrl] = React.useState(miEntrega?.enlaceUrl || "");
  const [archivo, setArchivo] = React.useState<File | null>(null);

  // Estados para Cuestionario / Examen
  const [respuestas, setRespuestas] = React.useState<Record<string, string | string[]>>(() => {
    if (miEntrega && miEntrega.estado === "en_progreso" && miEntrega.respuestas) {
      return miEntrega.respuestas as Record<string, string | string[]>;
    }
    return {};
  });
  const [tiempoRestanteSegundos, setTiempoRestanteSegundos] = React.useState<number | null>(null);
  const [intentoActivoId] = React.useState<string | null>(
    miEntrega && miEntrega.estado === "en_progreso" ? miEntrega.id : null,
  );

  const handleEnviarEvaluacion = async (_tiempoAgotado: boolean = false) => {
    try {
      await entregar.mutateAsync({
        tareaId: tarea.id,
        respuestas: respuestas as Record<string, unknown>,
      });
      refetchDetalle();
    } catch {
      // Error manejado en hook
    }
  };

  const handleEnviarEvaluacionRef = React.useRef(handleEnviarEvaluacion);
  React.useEffect(() => {
    handleEnviarEvaluacionRef.current = handleEnviarEvaluacion;
  });

  // Temporizador para exámenes
  React.useEffect(() => {
    if (
      !esEvaluacion ||
      !tarea.limiteTiempoMinutos ||
      miEntrega?.estado !== "en_progreso" ||
      !miEntrega?.iniciadoEn
    ) {
      return;
    }

    const inicioMs = new Date(miEntrega.iniciadoEn).getTime();
    const limiteMs = tarea.limiteTiempoMinutos * 60 * 1000;
    const finMs = inicioMs + limiteMs;

    const actualizarReloj = () => {
      const restante = Math.max(0, Math.floor((finMs - Date.now()) / 1000));
      setTiempoRestanteSegundos(restante);
      if (restante <= 0) {
        // Tiempo agotado: autocompletar entrega (CP-RF016-20)
        void handleEnviarEvaluacionRef.current(true);
      }
    };

    actualizarReloj();
    const interval = setInterval(actualizarReloj, 1000);
    return () => {
      clearInterval(interval);
      setTiempoRestanteSegundos(null);
    };
  }, [esEvaluacion, tarea.limiteTiempoMinutos, miEntrega?.estado, miEntrega?.iniciadoEn]);

  // Autoguardado de respuestas cada 30 segundos (CP-RF016-21)
  React.useEffect(() => {
    if (intentoActivoId && Object.keys(respuestas).length > 0) {
      const timer = setTimeout(() => {
        guardarProgreso.mutate({
          tareaId: tarea.id,
          respuestas: respuestas as Record<string, unknown>,
        });
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [respuestas, intentoActivoId, tarea.id, guardarProgreso]);

  const ahora = new Date().toISOString();
  const pasoFechaLimite = ahora > tarea.fechaLimite;
  const noAceptaTardia = pasoFechaLimite && !tarea.permiteEntregaTardia;
  const entregaCalificada = miEntrega && miEntrega.estado === "calificada";
  const sinIntentos = esEvaluacion && (tarea.intentosRestantes ?? 0) <= 0 && !intentoActivoId;

  const handleIniciarIntento = async () => {
    try {
      await iniciar.mutateAsync(tarea.id);
      refetchDetalle();
    } catch {
      // Error manejado en hook
    }
  };

  const handleEnviarTrabajo = async () => {
    if (!archivo && !enlaceUrl.trim() && !texto.trim()) {
      toast.error("Adjunte un archivo, enlace o texto para enviar la entrega.");
      return;
    }

    try {
      await entregar.mutateAsync({
        tareaId: tarea.id,
        texto: texto.trim() || undefined,
        enlaceUrl: enlaceUrl.trim() || undefined,
        archivo,
      });
      refetchDetalle();
      onCerrar();
    } catch {
      // Error manejado en hook
    }
  };

  const formatearTiempo = (segundos: number) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
          <DialogTitle>{tarea.titulo}</DialogTitle>
          <div className="flex items-center gap-2">
            <StatusBadge tone="brand">{tarea.tipo.toUpperCase()}</StatusBadge>
            {miEntrega && (
              <StatusBadge
                tone={
                  miEntrega.estado === "calificada"
                    ? "success"
                    : miEntrega.estado === "devuelta"
                      ? "warning"
                      : "neutral"
                }
              >
                {miEntrega.estado.toUpperCase()}
              </StatusBadge>
            )}
          </div>
        </div>
        <DialogDescription>
          Fecha límite: {formatDate(tarea.fechaLimite)}
          {tarea.permiteEntregaTardia && " · Acepta entregas tardías"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Instrucciones de la tarea */}
        {tarea.instrucciones && (
          <div className="bg-muted/30 rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Consigna
            </p>
            <p className="mt-1 whitespace-pre-line">{tarea.instrucciones}</p>
          </div>
        )}

        {/* Bloque de Calificación y Retroalimentación ya recibida */}
        {entregaCalificada && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-emerald-950 dark:text-emerald-200">
                  Calificación de la Entrega
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Revisada por el docente
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {miEntrega.nota !== null ? miEntrega.nota.toFixed(2) : "—"}
                </span>
                <span className="text-muted-foreground text-xs font-semibold"> / 20</span>
              </div>
            </div>
            {miEntrega.retroalimentacion && (
              <div className="mt-2 border-t border-emerald-200/60 pt-2 text-xs text-emerald-900 dark:text-emerald-200">
                <span className="font-semibold">Comentarios: </span>
                {miEntrega.retroalimentacion}
              </div>
            )}
          </div>
        )}

        {/* Bloque de Entrega Devuelta (CP-RF016-24) */}
        {miEntrega?.estado === "devuelta" && (
          <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
              <HugeiconsIcon icon={AlertCircleIcon} size={18} />
              Entrega devuelta para corrección
            </div>
            <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
              {miEntrega.retroalimentacion}
            </p>
          </div>
        )}

        {/* Lógica para TRABAJO o PROYECTO */}
        {!esEvaluacion ? (
          <div className="space-y-4">
            {entregaCalificada ? (
              <div className="bg-muted/40 text-muted-foreground rounded-lg border p-4 text-center text-sm">
                La entrega ya fue calificada. Pide al docente que te la devuelva para corregir.
              </div>
            ) : noAceptaTardia ? (
              <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-center text-sm font-medium">
                La fecha límite ya pasó. Esta tarea no acepta entregas tardías.
              </div>
            ) : (
              <div className="space-y-4 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {miEntrega ? "Actualizar entrega (CP-RF016-10)" : "Enviar entrega"}
                  </span>
                  {pasoFechaLimite && tarea.permiteEntregaTardia && (
                    <StatusBadge tone="warning">Entrega tardía</StatusBadge>
                  )}
                </div>

                {miEntrega?.archivoUrl && (
                  <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={File01Icon} size={16} />
                      <span className="max-w-xs truncate font-medium">
                        {miEntrega.archivoNombre || "Archivo entregado"}
                      </span>
                    </div>
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                      <Link href={urlDeArchivo(miEntrega.archivoUrl)} target="_blank">
                        Ver archivo actual
                      </Link>
                    </Button>
                  </div>
                )}

                <div>
                  <Label htmlFor="input-archivo-entrega">
                    Subir archivo {tarea.tiposArchivo && `(${tarea.tiposArchivo})`}
                  </Label>
                  <Input
                    id="input-archivo-entrega"
                    type="file"
                    onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="input-enlace-entrega">Enlace web o recurso (opcional)</Label>
                  <div className="relative mt-1">
                    <HugeiconsIcon
                      icon={Link01Icon}
                      size={16}
                      className="text-muted-foreground absolute top-2.5 left-3"
                    />
                    <Input
                      id="input-enlace-entrega"
                      value={enlaceUrl}
                      onChange={(e) => setEnlaceUrl(e.target.value)}
                      placeholder="https://..."
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="input-texto-entrega">Comentarios o texto de entrega</Label>
                  <Textarea
                    id="input-texto-entrega"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escriba aquí sus respuestas o notas para el docente..."
                    rows={3}
                    className="mt-1 resize-y"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Lógica para CUESTIONARIO o EXAMEN */
          <div className="space-y-4">
            {/* Barra superior de estado de intentos */}
            <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-xs">
              <div>
                <span className="font-medium">Intentos configurados: </span>
                {tarea.intentosMaximos}
                <span className="text-muted-foreground ml-2">
                  · Te quedan {tarea.intentosRestantes ?? tarea.intentosMaximos} intentos
                </span>
              </div>

              {tiempoRestanteSegundos !== null && (
                <div
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-sm font-bold ${
                    tiempoRestanteSegundos < 120
                      ? "bg-destructive text-destructive-foreground animate-pulse"
                      : "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200"
                  }`}
                >
                  <HugeiconsIcon icon={Clock01Icon} size={16} />
                  <span>{formatearTiempo(tiempoRestanteSegundos)}</span>
                </div>
              )}
            </div>

            {/* Botón para iniciar intento si no está en progreso */}
            {!intentoActivoId && !sinIntentos && (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm font-semibold">¿Listo para resolver la evaluación?</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {tarea.limiteTiempoMinutos
                    ? `Dispondrás de ${tarea.limiteTiempoMinutos} minutos para resolverla una vez iniciado el intento.`
                    : "Podrás resolver las preguntas con calma y enviar tus respuestas."}
                </p>
                <Button
                  type="button"
                  id="btn-iniciar-intento"
                  onClick={handleIniciarIntento}
                  disabled={iniciar.isPending}
                  className="mt-4 gap-2"
                >
                  <HugeiconsIcon icon={Clock01Icon} size={16} />
                  {iniciar.isPending ? "Iniciando..." : "Iniciar intento ahora"}
                </Button>
              </div>
            )}

            {sinIntentos && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center text-sm font-medium text-amber-900 dark:border-amber-950 dark:bg-amber-950/20 dark:text-amber-200">
                Ya usaste todos tus intentos (CP-RF016-18).
              </div>
            )}

            {/* Formulario de Preguntas activo */}
            {intentoActivoId && tarea.preguntas && (
              <div className="space-y-4">
                {tarea.preguntas.map((preg, pIdx) => {
                  const pregId = preg.id || `preg_${pIdx}`;
                  const respActual = respuestas[pregId];
                  return (
                    <div
                      key={pregId}
                      className="bg-background space-y-2 rounded-xl border p-4 shadow-2xs"
                    >
                      <div className="text-muted-foreground flex items-center justify-between text-xs font-semibold">
                        <span>
                          Pregunta {pIdx + 1} de {tarea.preguntas?.length}
                        </span>
                        <span>{preg.puntaje} pts</span>
                      </div>
                      <p className="text-foreground text-sm font-medium">{preg.enunciado}</p>

                      {/* Opciones */}
                      {preg.tipo === "opcion_unica" && preg.opciones && (
                        <div className="space-y-2 pt-2">
                          {preg.opciones.map((opt) => (
                            <label
                              key={opt.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 text-xs transition-all ${
                                respActual === opt.id
                                  ? "border-primary bg-primary/5 text-primary font-semibold"
                                  : "border-border hover:bg-muted/40"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`preg-${pregId}`}
                                checked={respActual === opt.id}
                                onChange={() =>
                                  setRespuestas((prev) => ({
                                    ...prev,
                                    [pregId]: opt.id!,
                                  }))
                                }
                                className="accent-primary"
                              />
                              <span>{opt.texto}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {preg.tipo === "opcion_multiple" && preg.opciones && (
                        <div className="space-y-2 pt-2">
                          {preg.opciones.map((opt) => {
                            const marcadas = Array.isArray(respActual) ? respActual : [];
                            const estaMarcada = marcadas.includes(opt.id!);
                            return (
                              <label
                                key={opt.id}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 text-xs transition-all ${
                                  estaMarcada
                                    ? "border-primary bg-primary/5 text-primary font-semibold"
                                    : "border-border hover:bg-muted/40"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={estaMarcada}
                                  onChange={(e) => {
                                    const nuevas = e.target.checked
                                      ? [...marcadas, opt.id!]
                                      : marcadas.filter((id) => id !== opt.id);
                                    setRespuestas((prev) => ({
                                      ...prev,
                                      [pregId]: nuevas,
                                    }));
                                  }}
                                  className="accent-primary"
                                />
                                <span>{opt.texto}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {preg.tipo === "respuesta_corta" && (
                        <div className="pt-2">
                          <Textarea
                            value={(respActual as string) || ""}
                            onChange={(e) =>
                              setRespuestas((prev) => ({
                                ...prev,
                                [pregId]: e.target.value,
                              }))
                            }
                            placeholder="Escriba su respuesta..."
                            rows={2}
                            className="resize-y text-xs"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCerrar}>
          Cerrar
        </Button>

        {!esEvaluacion && !entregaCalificada && !noAceptaTardia && (
          <Button
            type="button"
            id="btn-enviar-trabajo"
            onClick={handleEnviarTrabajo}
            disabled={entregar.isPending}
            className="gap-2"
          >
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            {entregar.isPending ? "Enviando..." : miEntrega ? "Actualizar entrega" : "Entregar"}
          </Button>
        )}

        {esEvaluacion && intentoActivoId && (
          <Button
            type="button"
            id="btn-finalizar-intento"
            onClick={() => void handleEnviarEvaluacion(false)}
            disabled={entregar.isPending}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
            {entregar.isPending ? "Calificando..." : "Finalizar y entregar evaluación"}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

export function ResolverTareaModal({
  abierto,
  onOpenChange,
  tareaId,
}: {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  tareaId?: string | null;
}) {
  const { data: tarea, refetch } = useDetalleTarea(tareaId ?? "");

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      {abierto && tarea && (
        <ContenidoResolverTarea
          key={`${tarea.id}-${tarea.miEntrega?.id ?? "nueva"}`}
          tarea={tarea}
          onCerrar={() => onOpenChange(false)}
          refetchDetalle={() => void refetch()}
        />
      )}
    </Dialog>
  );
}
