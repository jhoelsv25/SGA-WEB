"use client";

import * as React from "react";
import Image from "next/image";
import {
  AlertCircleIcon,
  Camera01Icon,
  CircleUnlock01Icon,
  Download01Icon,
  FileValidationIcon,
  LockKeyIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateTime } from "@/lib/formatters/date";
import { urlDeAdjunto } from "../../api";
import {
  DECISIONES_CONSOLIDADO,
  type DecisionConsolidado,
  type EvidenciaFotoConsolidadoDto,
} from "../../types";
import {
  useDescargarFichaPdf,
  useDetalleConsolidado,
  useRegistrarDecisionConsolidado,
} from "../../hooks";
import {
  formatearTiempoMinutos,
  obtenerEtiquetaDecision,
  obtenerEtiquetaEstadoSesion,
  VARIANTES_DECISION,
} from "../../utils";

export interface ModalDetalleDocenteProps {
  consolidadoId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puedeGestionar: boolean;
  onVerHistorial: (id: string, docenteNombre: string) => void;
  onReabrir: (consolidadoId: string, docenteNombre: string) => void;
  onCerrar: (consolidadoId: string, docenteNombre: string, version: number) => void;
}

interface FormularioDecisionDirectivaProps {
  consolidadoId: string;
  decisionInicial: DecisionConsolidado;
  observacionInicial?: string | null;
}

function FormularioDecisionDirectiva({
  consolidadoId,
  decisionInicial,
  observacionInicial,
}: FormularioDecisionDirectivaProps) {
  const [decision, setDecision] = React.useState<DecisionConsolidado>(decisionInicial);
  const [observacion, setObservacion] = React.useState(observacionInicial || "");

  const registrarDecisionMutation = useRegistrarDecisionConsolidado();

  const handleGuardarDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    await registrarDecisionMutation.mutateAsync({
      id: consolidadoId,
      dto: {
        decision,
        observacion: observacion.trim() || undefined,
      },
    });
  };

  return (
    <form
      onSubmit={handleGuardarDecision}
      className="border-border/60 bg-card space-y-4 rounded-xl border p-4"
    >
      <div className="space-y-1">
        <Label htmlFor="selector-decision" className="text-xs font-semibold">
          Decisión directiva autónoma
        </Label>
        <p className="text-muted-foreground text-2xs">
          Adopte una decisión directiva según el consolidado del bimestre. No genera descuentos
          económicos.
        </p>
        <Select value={decision} onValueChange={(val) => setDecision(val as DecisionConsolidado)}>
          <SelectTrigger id="selector-decision" size="sm" className="w-full text-xs">
            <SelectValue placeholder="Seleccione una decisión..." />
          </SelectTrigger>
          <SelectContent>
            {DECISIONES_CONSOLIDADO.map((d) => (
              <SelectItem key={d} value={d} className="text-xs">
                {obtenerEtiquetaDecision(d)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="observacion-decision" className="text-xs font-semibold">
          Observación o fundamentación (opcional)
        </Label>
        <Textarea
          id="observacion-decision"
          placeholder="Ej: Reunión de compromiso de mejora agendada el 20/07 con acta institucional..."
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          rows={3}
          maxLength={1000}
          className="resize-none text-xs"
        />
        <div className="text-3xs text-muted-foreground flex justify-end font-mono">
          {observacion.length}/1000
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          size="sm"
          disabled={registrarDecisionMutation.isPending}
          aria-busy={registrarDecisionMutation.isPending}
        >
          {registrarDecisionMutation.isPending && <Spinner className="mr-1.5 size-3.5" />}
          <span>Guardar decisión directiva</span>
        </Button>
      </div>
    </form>
  );
}

/**
 * Modal detallado del consolidado de un docente (RF-013 HU1, HU2, HU4).
 * Muestra totales, sesiones con firmas y ausencias con fotos, decisión directiva autónoma
 * y acciones de reapertura, cierre y descarga de ficha PDF oficial.
 */
export function ModalDetalleDocente({
  consolidadoId,
  open,
  onOpenChange,
  puedeGestionar,
  onVerHistorial,
  onReabrir,
  onCerrar,
}: ModalDetalleDocenteProps) {
  const { data, isLoading, isError, refetch } = useDetalleConsolidado(
    consolidadoId ?? undefined,
    open,
  );

  const [fotoAmpliada, setFotoAmpliada] = React.useState<EvidenciaFotoConsolidadoDto | null>(null);

  const descargarFichaMutation = useDescargarFichaPdf();

  if (!consolidadoId) return null;

  const handleDescargarFicha = async () => {
    if (!data) return;
    const nombre = `ficha-seguimiento-${data.docenteNombre.replace(/\s+/g, "_")}-${data.periodoNombre.replace(/\s+/g, "_")}.pdf`;
    await descargarFichaMutation.mutateAsync({
      id: data.id,
      nombreArchivo: nombre,
    });
  };

  const esCerrado = data?.estado === "cerrado";
  const decisionInfo = data ? VARIANTES_DECISION[data.decision] : undefined;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Detalle del consolidado docente"
        description="Seguimiento bimestral consolidado: sesiones, ausencias y decisión directiva (RF-013)."
        icon={FileValidationIcon}
        size="3xl"
      >
        <div className="space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Spinner className="text-primary size-8" />
              <p className="text-muted-foreground mt-2 text-xs">
                Cargando información detallada del consolidado...
              </p>
            </div>
          )}

          {isError && (
            <div className="border-destructive/30 bg-destructive/10 rounded-xl border p-5 text-center">
              <HugeiconsIcon icon={AlertCircleIcon} className="text-destructive mx-auto size-7" />
              <p className="text-destructive mt-2 text-xs font-semibold">
                No se pudo cargar el detalle del consolidado docente.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                className="mt-3 text-xs"
              >
                Reintentar
              </Button>
            </div>
          )}

          {!isLoading && !isError && data && (
            <>
              {/* Cabecera del docente y estado */}
              <div className="border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
                <div>
                  <h3 className="text-foreground text-sm font-bold tracking-tight">
                    {data.docenteNombre}
                  </h3>
                  <p className="text-muted-foreground text-2xs font-mono">
                    DNI/Doc: {data.docenteDocumento} · {data.periodoNombre}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={esCerrado ? "neutral" : "warning"} dot size="sm">
                    {esCerrado ? "Consolidado Cerrado" : "Consolidado Reabierto"}
                  </StatusBadge>
                  <Badge variant="outline" className="text-2xs font-mono">
                    Versión {data.version} {data.vigente ? "(Vigente)" : ""}
                  </Badge>
                  {decisionInfo && (
                    <StatusBadge tone={decisionInfo.tone} size="sm">
                      {obtenerEtiquetaDecision(data.decision)}
                    </StatusBadge>
                  )}
                </div>
              </div>

              {/* Tarjetas de Totales Clave */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div className="border-primary/20 bg-primary/5 rounded-xl border p-3">
                  <span className="text-muted-foreground text-2xs block font-medium">
                    Total fuera de clase
                  </span>
                  <span className="text-primary font-heading text-base font-bold">
                    {data.tiempoFueraClaseTexto}
                  </span>
                  <span className="text-muted-foreground/80 text-3xs block">
                    {data.totalMinutosFueraClase} min calculados
                  </span>
                </div>

                <div className="border-border/50 bg-background rounded-xl border p-3">
                  <span className="text-muted-foreground text-2xs block font-medium">
                    Cumplimiento sesiones
                  </span>
                  <span className="text-foreground font-heading text-base font-bold">
                    {data.sesionesCumplidas} / {data.sesionesProgramadas}
                  </span>
                  <span className="text-muted-foreground text-3xs block">
                    {data.sesionesParciales} parc · {data.sesionesNoCumplidas} no cump
                  </span>
                </div>

                <div className="border-border/50 bg-background rounded-xl border p-3">
                  <span className="text-muted-foreground text-2xs block font-medium">
                    Retrasos de firma
                  </span>
                  <span className="text-foreground font-heading text-base font-bold">
                    {formatearTiempoMinutos(data.minutosPerdidosFirma)}
                  </span>
                  <span className="text-muted-foreground text-3xs block">En ingreso y salida</span>
                </div>

                <div className="border-border/50 bg-background rounded-xl border p-3">
                  <span className="text-muted-foreground text-2xs block font-medium">
                    Ausencias del aula
                  </span>
                  <span className="text-foreground font-heading text-base font-bold">
                    {data.totalAusencias} ({formatearTiempoMinutos(data.minutosFueraAula)})
                  </span>
                  <span className="text-muted-foreground text-3xs block">Vigentes no anuladas</span>
                </div>
              </div>

              {/* Pestañas de detalle: Sesiones y ausencias / Decisión directiva */}
              <Tabs defaultValue="sesiones" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sesiones" className="text-xs">
                    Sesiones y ausencias ({data.sesiones?.length ?? 0})
                  </TabsTrigger>
                  <TabsTrigger value="decision" className="text-xs">
                    Decisión y observación directiva
                  </TabsTrigger>
                </TabsList>

                {/* Contenido Pestaña 1: Sesiones con sus ausencias */}
                <TabsContent value="sesiones" className="mt-3 space-y-3">
                  {!data.sesiones || data.sesiones.length === 0 ? (
                    <div className="border-border/60 bg-muted/20 text-muted-foreground rounded-xl border p-6 text-center text-xs">
                      No hay sesiones registradas para este docente en el bimestre.
                    </div>
                  ) : (
                    <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
                      {data.sesiones.map((sesion) => (
                        <div
                          key={sesion.id}
                          className="border-border/60 bg-card space-y-2.5 rounded-xl border p-3.5 shadow-2xs"
                        >
                          {/* Cabecera de la sesión */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                            <div>
                              <span className="text-foreground text-xs font-bold">
                                {formatDate(sesion.fecha)} · {sesion.cursoNombre} (
                                {sesion.seccionNombre})
                              </span>
                              {sesion.tema && (
                                <p className="text-muted-foreground text-2xs max-w-md truncate">
                                  Tema: {sesion.tema}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Badge variant="outline" className="text-2xs font-medium">
                                {obtenerEtiquetaEstadoSesion(sesion.estado)}
                              </Badge>
                              {sesion.minutosPerdidos > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-2xs text-warning-text font-mono"
                                >
                                  +{sesion.minutosPerdidos} min firma
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Horarios plan vs real */}
                          <div className="text-2xs grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <div>
                              <span className="text-muted-foreground block">Planificado:</span>
                              <span className="text-foreground font-mono font-medium">
                                {sesion.horaInicioPlan || "--:--"} – {sesion.horaFinPlan || "--:--"}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Firma real:</span>
                              <span className="text-foreground font-mono font-medium">
                                {sesion.horaInicioReal || "--:--"} – {sesion.horaFinReal || "--:--"}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Retraso ingreso:</span>
                              <span className="text-foreground font-mono">
                                {sesion.minutosRetraso} min
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Minutos perdidos:</span>
                              <span className="text-foreground font-mono font-semibold">
                                {sesion.minutosPerdidos} min
                              </span>
                            </div>
                          </div>

                          {/* Justificación de sesión si existe */}
                          {sesion.justificacionComentario && (
                            <div className="bg-muted/40 text-2xs text-muted-foreground rounded p-2 italic">
                              Justificación: «{sesion.justificacionComentario}»
                            </div>
                          )}

                          {/* Ausencias ocurridas dentro de la sesión */}
                          {sesion.ausencias && sesion.ausencias.length > 0 && (
                            <div className="border-border/40 bg-muted/20 space-y-2 rounded-lg border p-2.5">
                              <span className="text-foreground text-2xs block font-semibold">
                                Ausencias del aula en esta sesión ({sesion.ausencias.length}):
                              </span>

                              {sesion.ausencias.map((ausencia) => (
                                <div
                                  key={ausencia.id}
                                  className="border-border/50 bg-background/90 space-y-1.5 rounded-md border p-2 text-xs"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-1">
                                    <span className="text-foreground text-2xs font-mono font-bold">
                                      {ausencia.horaDesde} a {ausencia.horaHasta} (
                                      {formatearTiempoMinutos(ausencia.minutos)})
                                    </span>
                                    <Badge variant="outline" className="text-3xs">
                                      {ausencia.motivo}
                                    </Badge>
                                  </div>

                                  {ausencia.observacion && (
                                    <p className="text-muted-foreground text-2xs">
                                      Observación: {ausencia.observacion}
                                    </p>
                                  )}

                                  {ausencia.descargo && (
                                    <p className="text-primary text-2xs font-medium">
                                      Descargo del docente: «{ausencia.descargo}»
                                    </p>
                                  )}

                                  {/* Evidencias fotográficas de la ausencia */}
                                  {ausencia.fotos && ausencia.fotos.length > 0 && (
                                    <div className="pt-1">
                                      <span className="text-muted-foreground text-3xs mb-1 block font-medium">
                                        Fotos adjuntas ({ausencia.fotos.length}):
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {ausencia.fotos.map((foto) => (
                                          <button
                                            key={foto.id}
                                            type="button"
                                            onClick={() => setFotoAmpliada(foto)}
                                            className="group border-border/70 hover:border-primary relative size-12 cursor-zoom-in overflow-hidden rounded-md border"
                                            aria-label="Ver foto de evidencia ampliada"
                                          >
                                            <Image
                                              src={urlDeAdjunto(foto.archivoUrl)}
                                              alt="Evidencia fotográfica"
                                              fill
                                              sizes="48px"
                                              className="object-cover transition-transform group-hover:scale-105"
                                              unoptimized
                                            />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Contenido Pestaña 2: Decisión directiva (HU1 CP-RF013-05) */}
                <TabsContent value="decision" className="mt-3">
                  {puedeGestionar ? (
                    <FormularioDecisionDirectiva
                      key={`${data.id}-${data.version}`}
                      consolidadoId={data.id}
                      decisionInicial={data.decision}
                      observacionInicial={data.observacion}
                    />
                  ) : (
                    <div className="border-border/60 bg-muted/20 space-y-2 rounded-xl border p-4 text-xs">
                      <p className="text-muted-foreground text-2xs font-bold tracking-wider uppercase">
                        Decisión registrada por Dirección:
                      </p>
                      <div className="flex items-center gap-2">
                        {decisionInfo && (
                          <StatusBadge tone={decisionInfo.tone} size="md">
                            {obtenerEtiquetaDecision(data.decision)}
                          </StatusBadge>
                        )}
                      </div>
                      {data.observacion ? (
                        <p className="text-foreground mt-2 text-xs italic">«{data.observacion}»</p>
                      ) : (
                        <p className="text-muted-foreground text-xs">Sin observación registrada.</p>
                      )}
                      <p className="text-muted-foreground/70 text-3xs border-t pt-2">
                        Su rol tiene permisos de solo consulta sobre la decisión directiva.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Botonera de acciones en el pie */}
              <div className="border-border/50 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDescargarFicha}
                    disabled={descargarFichaMutation.isPending}
                    aria-busy={descargarFichaMutation.isPending}
                    className="gap-1.5 text-xs"
                  >
                    {descargarFichaMutation.isPending ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
                    )}
                    <span>Ficha de seguimiento (PDF)</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      onVerHistorial(data.id, data.docenteNombre);
                    }}
                    className="gap-1.5 text-xs"
                  >
                    <HugeiconsIcon icon={Time02Icon} className="size-3.5" />
                    <span>Historial</span>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {puedeGestionar && esCerrado && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onOpenChange(false);
                        onReabrir(data.id, data.docenteNombre);
                      }}
                      className="text-warning-text gap-1.5 text-xs"
                    >
                      <HugeiconsIcon icon={CircleUnlock01Icon} className="size-3.5" />
                      <span>Reabrir</span>
                    </Button>
                  )}

                  {puedeGestionar && !esCerrado && (
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => {
                        onOpenChange(false);
                        onCerrar(data.id, data.docenteNombre, data.version);
                      }}
                      className="gap-1.5 text-xs"
                    >
                      <HugeiconsIcon icon={LockKeyIcon} className="size-3.5" />
                      <span>Cerrar consolidado</span>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="text-xs"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Lightbox / Dialog para foto de evidencia ampliada */}
      <Dialog
        open={Boolean(fotoAmpliada)}
        onOpenChange={(abierto) => !abierto && setFotoAmpliada(null)}
      >
        <DialogContent
          className="border-border/60 max-w-xl gap-3 p-4 sm:p-5"
          aria-describedby="descripcion-foto-ampliada"
        >
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <HugeiconsIcon icon={Camera01Icon} className="text-primary size-4" />
            <span>Evidencia fotográfica de la ausencia</span>
          </DialogTitle>
          <p id="descripcion-foto-ampliada" className="sr-only">
            Foto capturada durante la ausencia del docente
          </p>

          {fotoAmpliada && (
            <div className="space-y-2">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border bg-black/90">
                <Image
                  src={urlDeAdjunto(fotoAmpliada.archivoUrl)}
                  alt="Evidencia fotográfica ampliada"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain"
                  unoptimized
                />
              </div>

              {fotoAmpliada.tomadaEn && (
                <p className="text-2xs text-muted-foreground text-center">
                  Capturada el {formatDateTime(fotoAmpliada.tomadaEn)}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
