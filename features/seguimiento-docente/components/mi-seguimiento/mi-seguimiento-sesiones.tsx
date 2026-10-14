"use client";

import * as React from "react";
import Image from "next/image";
import { AlertCircleIcon, Calendar01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/formatters/date";
import { urlDeAdjunto } from "../../api";
import type { DetalleSesionConsolidadoDto, EvidenciaFotoConsolidadoDto } from "../../types";
import { obtenerEtiquetaEstadoSesion } from "../../utils";

interface MiSeguimientoSesionesProps {
  sesiones: DetalleSesionConsolidadoDto[];
  onVerFoto: (foto: EvidenciaFotoConsolidadoDto) => void;
}

/**
 * Listado detallado de sesiones de clase con sus ausencias vigentes (HU1, HU3).
 * Muestra horario planificado vs. real de firma, minutos perdidos, justificaciones,
 * ausencias registradas, descargos y miniaturas de fotos de supervisión.
 */
export function MiSeguimientoSesiones({ sesiones, onVerFoto }: MiSeguimientoSesionesProps) {
  if (sesiones.length === 0) {
    return (
      <div className="border-border/70 bg-card flex flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-2xs">
        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
          <HugeiconsIcon icon={Calendar01Icon} className="size-6" />
        </div>
        <h3 className="text-foreground mt-3 text-sm font-bold">Sin sesiones registradas</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs">
          No se encontraron sesiones programadas ni dictadas para este bimestre.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xs font-bold tracking-wider uppercase">
          Detalle de sesiones dictadas ({sesiones.length})
        </h2>
        <span className="text-2xs text-muted-foreground">
          Sesiones y ausencias computadas en el consolidado
        </span>
      </div>

      <div className="space-y-3">
        {sesiones.map((sesion) => {
          const tieneAusencias = sesion.ausencias.length > 0;
          const estadoEtiqueta = obtenerEtiquetaEstadoSesion(sesion.estado);

          const badgeVariant =
            sesion.estado === "cumplida"
              ? "default"
              : sesion.estado === "parcial"
                ? "outline"
                : sesion.estado === "no_cumplida"
                  ? "destructive"
                  : "secondary";

          return (
            <div
              key={sesion.id}
              className="border-border/70 bg-card hover:border-primary/30 overflow-hidden rounded-2xl border shadow-2xs transition-all"
            >
              {/* Cabecera de la sesión */}
              <div className="border-border/60 bg-muted/15 flex flex-wrap items-center justify-between gap-2.5 border-b px-4 py-3 sm:px-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground text-xs font-bold sm:text-sm">
                    {sesion.cursoNombre}
                  </span>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="text-muted-foreground text-xs font-medium">
                    {sesion.seccionNombre}
                  </span>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="text-muted-foreground font-mono text-xs">
                    {formatDate(sesion.fecha)}
                  </span>
                </div>

                <Badge variant={badgeVariant} className="text-xs font-semibold">
                  {estadoEtiqueta}
                </Badge>
              </div>

              {/* Información de la sesión */}
              <div className="space-y-3 p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground text-2xs tracking-wider uppercase">
                      Horario programado
                    </span>
                    <p className="text-foreground text-xs font-medium">
                      {sesion.horaInicioPlan ?? "--:--"} a {sesion.horaFinPlan ?? "--:--"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-2xs tracking-wider uppercase">
                      Firma en kiosko
                    </span>
                    <p className="text-foreground text-xs font-medium">
                      {sesion.horaInicioReal ?? "--:--"} a {sesion.horaFinReal ?? "--:--"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-2xs tracking-wider uppercase">
                      Tiempo perdido por firma
                    </span>
                    <p className="text-xs font-semibold tabular-nums">
                      {sesion.minutosPerdidos > 0 ? (
                        <span className="text-destructive">
                          {sesion.minutosPerdidos} min
                          {sesion.minutosRetraso > 0 && ` (${sesion.minutosRetraso} min retraso)`}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0 min</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Tema desarrollado */}
                <div>
                  <span className="text-muted-foreground text-2xs tracking-wider uppercase">
                    Tema desarrollado
                  </span>
                  <p className="text-foreground mt-0.5 text-xs">
                    {sesion.tema || (
                      <span className="text-muted-foreground italic">Sin tema registrado</span>
                    )}
                  </p>
                </div>

                {/* Justificación de sesión si existe */}
                {sesion.justificacionComentario && (
                  <div className="border-border/50 bg-muted/20 rounded-xl border p-2.5 text-xs">
                    <span className="text-muted-foreground font-semibold">
                      Comentario de justificación:{" "}
                    </span>
                    <span className="text-foreground">{sesion.justificacionComentario}</span>
                  </div>
                )}

                {/* Bloque de ausencias registradas durante la sesión */}
                {tieneAusencias && (
                  <div className="border-warning/30 bg-warning/5 mt-3 space-y-3 rounded-xl border p-3.5">
                    <div className="text-warning-text flex items-center gap-1.5 text-xs font-bold">
                      <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
                      <span>
                        {sesion.ausencias.length}{" "}
                        {sesion.ausencias.length === 1
                          ? "ausencia vigente en esta sesión"
                          : "ausencias vigentes en esta sesión"}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {sesion.ausencias.map((ausencia, idx) => (
                        <div
                          key={ausencia.id || idx}
                          className="border-border/60 bg-card rounded-xl border p-3 text-xs shadow-2xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="text-foreground font-bold">
                              Tramo: {ausencia.horaDesde} a {ausencia.horaHasta}
                            </span>
                            <Badge variant="outline" className="text-2xs px-2 py-0 font-semibold">
                              {ausencia.minutos} min fuera del aula
                            </Badge>
                          </div>

                          <p className="text-foreground mt-1.5">
                            <span className="text-muted-foreground font-medium">Motivo: </span>
                            {ausencia.motivo}
                          </p>

                          {ausencia.observacion && (
                            <p className="text-muted-foreground mt-1">
                              <span className="font-medium">Observación de supervisión: </span>
                              {ausencia.observacion}
                            </p>
                          )}

                          {/* Descargo presentado por el docente */}
                          {ausencia.descargo && (
                            <div className="border-border/40 bg-muted/20 text-2xs mt-2 rounded-lg border p-2">
                              <span className="text-foreground font-semibold">Su descargo: </span>
                              <span className="text-muted-foreground">{ausencia.descargo}</span>
                              {ausencia.descargoEn && (
                                <span className="text-muted-foreground/70 mt-0.5 block">
                                  Presentado el {formatDateTime(ausencia.descargoEn)}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Fotos de evidencia */}
                          {ausencia.fotos && ausencia.fotos.length > 0 && (
                            <div className="mt-2.5 space-y-1.5">
                              <span className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">
                                Fotos de evidencia ({ausencia.fotos.length})
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {ausencia.fotos.map((foto) => (
                                  <button
                                    key={foto.id}
                                    type="button"
                                    onClick={() => onVerFoto(foto)}
                                    className="group border-border/70 hover:border-primary relative size-14 overflow-hidden rounded-lg border transition-all"
                                    title="Clic para ver foto en tamaño completo"
                                  >
                                    <Image
                                      src={urlDeAdjunto(foto.archivoUrl)}
                                      alt="Foto de supervisión"
                                      fill
                                      unoptimized
                                      className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                      <HugeiconsIcon
                                        icon={Image01Icon}
                                        className="size-4 text-white"
                                      />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
