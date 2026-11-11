"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowTurnBackwardIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/common/status-badge";
import { toast } from "@/lib/toast";
import { useCalificarEntrega } from "../../hooks";
import { urlDeArchivo } from "../../api";
import type { Entrega, Tarea } from "../../types";

export interface CalificarEntregaFormProps {
  entrega: Entrega;
  tarea: Tarea;
  onCancel: () => void;
  onSuccess?: () => void;
  onSiguiente?: () => void;
}

export function CalificarEntregaForm({
  entrega,
  tarea,
  onCancel,
  onSuccess,
  onSiguiente,
}: CalificarEntregaFormProps) {
  const calificar = useCalificarEntrega();

  const [nota, setNota] = React.useState<number | "">(entrega.nota !== null ? entrega.nota : "");
  const [retroalimentacion, setRetroalimentacion] = React.useState(entrega.retroalimentacion || "");
  const [calificacionesPreguntas, setCalificacionesPreguntas] = React.useState<
    Record<string, { puntajeObtenido: number; comentario?: string }>
  >(() => {
    const abiertasInit: Record<string, { puntajeObtenido: number; comentario?: string }> = {};
    if (tarea.preguntas) {
      for (const p of tarea.preguntas) {
        if (p.tipo === "respuesta_corta" && p.id) {
          const resp = entrega.respuestas?.[p.id] as
            { puntajeObtenido?: number; comentario?: string } | undefined;
          abiertasInit[p.id] = {
            puntajeObtenido: resp?.puntajeObtenido ?? 0,
            comentario: resp?.comentario ?? "",
          };
        }
      }
    }
    return abiertasInit;
  });

  const tienePreguntasAbiertas =
    tarea.preguntas?.some((p) => p.tipo === "respuesta_corta") ?? false;

  const handleGuardarCalificacion = async () => {
    if (tienePreguntasAbiertas) {
      // Califica mediante puntajes de preguntas
      try {
        await calificar.mutateAsync({
          entregaId: entrega.id,
          calificacionesPreguntas,
          retroalimentacion: retroalimentacion.trim() || undefined,
        });
        onSuccess?.();
      } catch {
        // Error manejado en hook
      }
      return;
    }

    if (nota === "" || nota < 0 || nota > 20) {
      toast.error("La nota debe estar entre 0 y 20.");
      return;
    }

    try {
      await calificar.mutateAsync({
        entregaId: entrega.id,
        nota: Number(nota),
        retroalimentacion: retroalimentacion.trim() || undefined,
      });
      onSuccess?.();
    } catch {
      // Error manejado en hook
    }
  };

  const handleDevolverEntrega = async () => {
    if (!retroalimentacion.trim()) {
      toast.error("Indique la retroalimentación para devolver la entrega.");
      return;
    }

    try {
      await calificar.mutateAsync({
        entregaId: entrega.id,
        devolver: true,
        retroalimentacion: retroalimentacion.trim(),
      });
      onSuccess?.();
    } catch {
      // Error manejado en hook
    }
  };

  return (
    <div className="space-y-4 py-2">
      {/* Badges de Estado */}
      <div className="flex items-center gap-2">
        {entrega.esTardia && <StatusBadge tone="warning">Tardía</StatusBadge>}
        <StatusBadge tone={entrega.estado === "calificada" ? "success" : "neutral"}>
          {entrega.estado.toUpperCase()}
        </StatusBadge>
      </div>

      {/* Contenido entregado */}
      <div className="bg-muted/30 space-y-3 rounded-xl border p-4">
        <h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Contenido de la entrega
        </h4>

        {entrega.archivoUrl && (
          <div className="bg-background flex items-center justify-between rounded-lg border p-3 text-sm">
            <div className="flex items-center gap-2 truncate">
              <HugeiconsIcon icon={File01Icon} size={18} className="text-primary shrink-0" />
              <span className="truncate font-medium">
                {entrega.archivoNombre || "Archivo adjunto"}
              </span>
            </div>
            <Button asChild size="sm" variant="outline" className="h-8 gap-1 text-xs">
              <Link href={urlDeArchivo(entrega.archivoUrl)} target="_blank">
                Descargar / Ver
              </Link>
            </Button>
          </div>
        )}

        {entrega.enlaceUrl && (
          <div className="bg-background flex items-center justify-between rounded-lg border p-3 text-sm">
            <div className="flex items-center gap-2 truncate">
              <HugeiconsIcon icon={Link01Icon} size={18} className="text-primary shrink-0" />
              <span className="truncate text-xs font-medium">{entrega.enlaceUrl}</span>
            </div>
            <Button asChild size="sm" variant="outline" className="h-8 gap-1 text-xs">
              <Link href={entrega.enlaceUrl} target="_blank">
                Abrir enlace
              </Link>
            </Button>
          </div>
        )}

        {entrega.texto && (
          <div className="bg-background rounded-lg border p-3 text-xs whitespace-pre-line">
            <p className="text-muted-foreground mb-1 text-[11px] font-semibold">Texto ingresado:</p>
            {entrega.texto}
          </div>
        )}
      </div>

      {/* Preguntas abiertas por calificar */}
      {tienePreguntasAbiertas && tarea.preguntas && (
        <div className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
          <h4 className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
            Calificación de preguntas abiertas
          </h4>
          {tarea.preguntas
            .filter((p) => p.tipo === "respuesta_corta" && Boolean(p.id))
            .map((preg) => {
              const pregId = preg.id!;
              const resp = entrega.respuestas?.[pregId] as
                { respuesta?: string; puntajeObtenido?: number } | undefined;
              const califActual = calificacionesPreguntas[pregId] || { puntajeObtenido: 0 };
              return (
                <div key={pregId} className="bg-background space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{preg.enunciado}</span>
                    <span className="text-muted-foreground">Máx: {preg.puntaje} pts</span>
                  </div>
                  <div className="bg-muted/40 rounded-md p-2 text-xs italic">
                    &quot;{resp?.respuesta || "(Sin respuesta)"}&quot;
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <Label htmlFor={`input-pts-${pregId}`} className="text-xs">
                      Puntaje otorgado:
                    </Label>
                    <Input
                      id={`input-pts-${pregId}`}
                      type="number"
                      min={0}
                      max={preg.puntaje}
                      step={0.5}
                      value={califActual.puntajeObtenido}
                      onChange={(e) =>
                        setCalificacionesPreguntas((prev) => ({
                          ...prev,
                          [pregId]: {
                            ...prev[pregId],
                            puntajeObtenido: Number(e.target.value) || 0,
                          },
                        }))
                      }
                      className="h-7 w-20 text-center text-xs"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Calificación directa si no hay preguntas abiertas */}
      {!tienePreguntasAbiertas && (
        <div>
          <Label htmlFor="input-nota-calificacion">Calificación vigesimal (0 a 20) *</Label>
          <Input
            id="input-nota-calificacion"
            type="number"
            min={0}
            max={20}
            step={0.25}
            value={nota}
            onChange={(e) => setNota(e.target.value ? Number(e.target.value) : "")}
            placeholder="Ej. 15.5"
            className="mt-1 h-10 text-base font-bold"
          />
        </div>
      )}

      {/* Retroalimentación */}
      <div>
        <Label htmlFor="input-retroalimentacion">Retroalimentación o comentarios</Label>
        <Textarea
          id="input-retroalimentacion"
          value={retroalimentacion}
          onChange={(e) => setRetroalimentacion(e.target.value)}
          placeholder="Indique felicitaciones o puntos de mejora (ej. 'Corrige el ejercicio 7')..."
          rows={3}
          className="mt-1 resize-y"
        />
      </div>

      {/* Footer de Acciones */}
      <div className="flex flex-col-reverse justify-between gap-2 border-t pt-4 sm:flex-row">
        <Button
          type="button"
          variant="ghost"
          id="btn-devolver-entrega"
          onClick={handleDevolverEntrega}
          disabled={calificar.isPending}
          className="gap-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30"
        >
          <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={16} />
          Devolver para corrección
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="gap-2" onClick={onCancel}>
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
            <span>Cancelar</span>
          </Button>
          <Button
            type="button"
            id="btn-guardar-calificacion"
            onClick={handleGuardarCalificacion}
            disabled={calificar.isPending}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
            {calificar.isPending ? "Guardando..." : "Guardar calificación"}
          </Button>
          {onSiguiente && (
            <Button
              type="button"
              id="btn-guardar-siguiente"
              onClick={async () => {
                await handleGuardarCalificacion();
                onSiguiente();
              }}
              disabled={calificar.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              <span>Guardar y siguiente</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
