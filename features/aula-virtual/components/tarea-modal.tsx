"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  InformationCircleIcon,
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/lib/toast";
import { useActualizarTarea, useCrearTarea } from "../hooks";
import type {
  CalculoNotaIntentos,
  Pregunta,
  RevelarRespuestas,
  Tarea,
  TipoPregunta,
  TipoTarea,
} from "../types";

const TIPOS_TAREA_OPCIONES: Array<{ value: TipoTarea; label: string; desc: string }> = [
  {
    value: "trabajo",
    label: "Trabajo",
    desc: "Entrega de archivos, enlaces o texto (1 intento editable)",
  },
  {
    value: "proyecto",
    label: "Proyecto",
    desc: "Entrega integral a largo plazo (1 intento editable)",
  },
  {
    value: "cuestionario",
    label: "Cuestionario",
    desc: "Preguntas interactivas con autocalificación e intentos",
  },
  {
    value: "examen",
    label: "Examen",
    desc: "Evaluación formal con tiempo límite y control estricto",
  },
];

function FormularioTarea({
  cursoSeccionId,
  tarea,
  unidadIdDefecto,
  periodoIdDefecto,
  onCerrar,
}: {
  cursoSeccionId: string;
  tarea?: Tarea | null;
  unidadIdDefecto?: string;
  periodoIdDefecto?: string;
  onCerrar: () => void;
}) {
  const esEdicion = Boolean(tarea);
  const crear = useCrearTarea(cursoSeccionId);
  const actualizar = useActualizarTarea();

  const [titulo, setTitulo] = React.useState(tarea?.titulo ?? "");
  const [instrucciones, setInstrucciones] = React.useState(tarea?.instrucciones ?? "");
  const [tipo, setTipo] = React.useState<TipoTarea>(tarea?.tipo ?? "trabajo");
  const [fechaLimite, setFechaLimite] = React.useState(() => {
    if (tarea?.fechaLimite) return tarea.fechaLimite.slice(0, 16);
    const manana = new Date();
    manana.setDate(manana.getDate() + 7);
    manana.setHours(23, 59, 0, 0);
    return manana.toISOString().slice(0, 16);
  });
  const [permiteEntregaTardia, setPermiteEntregaTardia] = React.useState(
    tarea?.permiteEntregaTardia ?? false,
  );
  const [intentosMaximos, setIntentosMaximos] = React.useState(tarea?.intentosMaximos || 1);
  const [limiteTiempoMinutos, setLimiteTiempoMinutos] = React.useState<number | "">(
    tarea?.limiteTiempoMinutos ?? "",
  );
  const [calculoNotaIntentos, setCalculoNotaIntentos] = React.useState<CalculoNotaIntentos>(
    tarea?.calculoNotaIntentos || "mas_alta",
  );
  const [revelarRespuestas, setRevelarRespuestas] = React.useState<RevelarRespuestas>(
    tarea?.revelarRespuestas || "al_terminar_intentos",
  );
  const [tiposArchivo, setTiposArchivo] = React.useState(
    tarea?.tiposArchivo ?? "pdf, docx, imagen",
  );
  const [preguntas, setPreguntas] = React.useState<Pregunta[]>(tarea?.preguntas || []);

  const esEvaluacionConPreguntas = tipo === "cuestionario" || tipo === "examen";

  // Puntaje total acumulado de las preguntas
  const puntajeTotal = React.useMemo(() => {
    return preguntas.reduce((sum, p) => sum + (Number(p.puntaje) || 0), 0);
  }, [preguntas]);

  const agregarPregunta = (tipoPreg: TipoPregunta) => {
    const orden = preguntas.length + 1;
    let opcionesIniciales = undefined;
    if (tipoPreg === "opcion_unica" || tipoPreg === "opcion_multiple") {
      opcionesIniciales = [
        { id: `opt-${Date.now()}-1`, texto: "Opción A", esCorrecta: true, orden: 1 },
        { id: `opt-${Date.now()}-2`, texto: "Opción B", esCorrecta: false, orden: 2 },
      ];
    }

    setPreguntas((prev) => [
      ...prev,
      {
        id: `preg-${Date.now()}`,
        enunciado: `Pregunta ${orden}`,
        tipo: tipoPreg,
        puntaje: 2,
        orden,
        opciones: opcionesIniciales,
      },
    ]);
  };

  const eliminarPregunta = (idx: number) => {
    setPreguntas((prev) => prev.filter((_, i) => i !== idx));
  };

  const actualizarPregunta = (idx: number, patch: Partial<Pregunta>) => {
    setPreguntas((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const agregarOpcion = (pregIdx: number) => {
    const p = preguntas[pregIdx];
    const nuevaOpcion = {
      id: `opt-${Date.now()}`,
      texto: `Opción ${String.fromCharCode(65 + (p.opciones?.length || 0))}`,
      esCorrecta: false,
      orden: (p.opciones?.length || 0) + 1,
    };
    actualizarPregunta(pregIdx, {
      opciones: [...(p.opciones || []), nuevaOpcion],
    });
  };

  const toggleOpcionCorrecta = (pregIdx: number, optIdx: number) => {
    const p = preguntas[pregIdx];
    if (!p.opciones) return;
    if (p.tipo === "opcion_unica") {
      const nuevasOpciones = p.opciones.map((o, i) => ({
        ...o,
        esCorrecta: i === optIdx,
      }));
      actualizarPregunta(pregIdx, { opciones: nuevasOpciones });
    } else {
      const nuevasOpciones = p.opciones.map((o, i) =>
        i === optIdx ? { ...o, esCorrecta: !o.esCorrecta } : o,
      );
      actualizarPregunta(pregIdx, { opciones: nuevasOpciones });
    }
  };

  const guardar = async (publicar: boolean) => {
    if (!titulo.trim()) {
      toast.error("El título de la tarea es obligatorio.");
      return;
    }
    if (!fechaLimite) {
      toast.error("Indique la fecha y hora límite.");
      return;
    }

    const payload = {
      titulo: titulo.trim(),
      instrucciones: instrucciones.trim() || undefined,
      tipo,
      fechaLimite: new Date(fechaLimite).toISOString(),
      permiteEntregaTardia,
      intentosMaximos: esEvaluacionConPreguntas ? Number(intentosMaximos) || 1 : 1,
      limiteTiempoMinutos:
        tipo === "examen" && limiteTiempoMinutos ? Number(limiteTiempoMinutos) : undefined,
      calculoNotaIntentos,
      revelarRespuestas,
      tiposArchivo: !esEvaluacionConPreguntas ? tiposArchivo : undefined,
      publicar,
      unidadId: unidadIdDefecto,
      periodoId: periodoIdDefecto,
      preguntas: esEvaluacionConPreguntas ? preguntas : undefined,
    };

    if (esEdicion && tarea) {
      await actualizar.mutateAsync({ id: tarea.id, ...payload });
    } else {
      await crear.mutateAsync(payload);
    }
    onCerrar();
  };

  const isPending = crear.isPending || actualizar.isPending;

  return (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {esEdicion ? "Editar tarea o evaluación" : "Crear nueva tarea o evaluación"}
        </DialogTitle>
        <DialogDescription>
          Configure las instrucciones, fecha límite y reglas de evaluación.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-2">
        {/* Selector de Tipo */}
        <div>
          <Label className="text-sm font-medium">Tipo de actividad</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIPOS_TAREA_OPCIONES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                id={`btn-tipo-${opt.value}`}
                onClick={() => {
                  setTipo(opt.value);
                  if (opt.value === "trabajo" || opt.value === "proyecto") {
                    setIntentosMaximos(1);
                  }
                }}
                className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
                  tipo === opt.value
                    ? "border-primary bg-primary/5 ring-primary/20 ring-2"
                    : "hover:bg-muted/50 border-border"
                }`}
              >
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className="text-muted-foreground mt-1 line-clamp-2 text-xs">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Título e Instrucciones */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="input-titulo-tarea">Título de la actividad *</Label>
            <Input
              id="input-titulo-tarea"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Resolver 10 ecuaciones cuadráticas"
              maxLength={150}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="input-instrucciones-tarea">Instrucciones o consigna</Label>
            <Textarea
              id="input-instrucciones-tarea"
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              placeholder="Indique los criterios, pasos o recomendaciones para resolver la actividad..."
              rows={3}
              className="mt-1 resize-y"
            />
          </div>
        </div>

        {/* Parámetros de Entrega y Plazo */}
        <div className="bg-muted/40 grid grid-cols-1 gap-4 rounded-xl border p-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="input-fecha-limite">Fecha y hora límite *</Label>
            <Input
              id="input-fecha-limite"
              type="datetime-local"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="bg-background flex items-center justify-between rounded-lg border p-2.5">
              <div className="space-y-0.5">
                <Label
                  htmlFor="switch-entrega-tardia"
                  className="cursor-pointer text-xs font-medium"
                >
                  Permitir entregas tardías
                </Label>
                <p className="text-muted-foreground text-[11px]">
                  Se aceptarán entregas marcadas como fuera de plazo.
                </p>
              </div>
              <Switch
                id="switch-entrega-tardia"
                checked={permiteEntregaTardia}
                onCheckedChange={setPermiteEntregaTardia}
              />
            </div>
          </div>

          {!esEvaluacionConPreguntas && (
            <div className="sm:col-span-2">
              <Label htmlFor="input-tipos-archivo">Formatos de archivo permitidos</Label>
              <Input
                id="input-tipos-archivo"
                value={tiposArchivo}
                onChange={(e) => setTiposArchivo(e.target.value)}
                placeholder="pdf, docx, imagen"
                className="mt-1"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Separados por coma. Deje en blanco para permitir cualquier formato.
              </p>
            </div>
          )}
        </div>

        {/* Configuración especial de Cuestionario / Examen */}
        {esEvaluacionConPreguntas ? (
          <div className="space-y-4 rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h4 className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                  Configuración de Evaluación e Intentos
                </h4>
                <p className="text-muted-foreground text-xs">
                  Reglas de resolución, tiempo límite y cálculo de nota.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="input-intentos-max">Intentos máximos (1–10)</Label>
                <Input
                  id="input-intentos-max"
                  type="number"
                  min={1}
                  max={10}
                  value={intentosMaximos}
                  onChange={(e) => setIntentosMaximos(Number(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="select-calculo-nota">Cálculo de nota</Label>
                <select
                  id="select-calculo-nota"
                  value={calculoNotaIntentos}
                  onChange={(e) => setCalculoNotaIntentos(e.target.value as CalculoNotaIntentos)}
                  className="border-input bg-background mt-1 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm"
                >
                  <option value="mas_alta">La más alta</option>
                  <option value="ultima">La última</option>
                  <option value="promedio">Promedio</option>
                </select>
              </div>

              <div>
                <Label htmlFor="select-revelar-resp">Mostrar respuestas correctas</Label>
                <select
                  id="select-revelar-resp"
                  value={revelarRespuestas}
                  onChange={(e) => setRevelarRespuestas(e.target.value as RevelarRespuestas)}
                  className="border-input bg-background mt-1 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm"
                >
                  <option value="al_terminar_intentos">Al agotar los intentos</option>
                  <option value="despues_fecha_limite">Tras la fecha límite</option>
                  <option value="inmediato">Inmediatamente</option>
                  <option value="nunca">Nunca</option>
                </select>
              </div>

              {tipo === "examen" && (
                <div>
                  <Label htmlFor="input-limite-tiempo">Tiempo límite (minutos)</Label>
                  <Input
                    id="input-limite-tiempo"
                    type="number"
                    min={1}
                    max={300}
                    value={limiteTiempoMinutos}
                    onChange={(e) =>
                      setLimiteTiempoMinutos(e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="Ej. 40"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Editor de Preguntas */}
            <div className="space-y-3 pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Preguntas ({preguntas.length})</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      Math.abs(puntajeTotal - 20) < 0.01
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    Total: {puntajeTotal.toFixed(1)} / 20 pts
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs"
                    onClick={() => agregarPregunta("opcion_unica")}
                  >
                    <HugeiconsIcon icon={Add01Icon} size={14} /> Opción Única
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs"
                    onClick={() => agregarPregunta("opcion_multiple")}
                  >
                    <HugeiconsIcon icon={Add01Icon} size={14} /> Opción Múltiple
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs"
                    onClick={() => agregarPregunta("respuesta_corta")}
                  >
                    <HugeiconsIcon icon={Add01Icon} size={14} /> Pregunta Abierta
                  </Button>
                </div>
              </div>

              {preguntas.length === 0 ? (
                <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                  No ha agregado preguntas aún. Agregue preguntas de opción única, múltiple o
                  abiertas. Para publicar, la suma debe ser exactamente 20 puntos.
                </div>
              ) : (
                <div className="space-y-3">
                  {preguntas.map((preg, pIdx) => (
                    <div
                      key={preg.id || pIdx}
                      className="bg-background space-y-2 rounded-lg border p-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-xs font-bold">
                          #{pIdx + 1} · {preg.tipo.replace("_", " ").toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Puntos:</Label>
                          <Input
                            type="number"
                            min={0.1}
                            max={20}
                            step={0.5}
                            value={preg.puntaje}
                            onChange={(e) =>
                              actualizarPregunta(pIdx, { puntaje: Number(e.target.value) || 0 })
                            }
                            className="h-7 w-16 text-center text-xs"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-7 w-7"
                            onClick={() => eliminarPregunta(pIdx)}
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={14} />
                          </Button>
                        </div>
                      </div>

                      <Input
                        value={preg.enunciado}
                        onChange={(e) => actualizarPregunta(pIdx, { enunciado: e.target.value })}
                        placeholder="Enunciado de la pregunta..."
                        className="h-8 text-sm"
                      />

                      {/* Opciones si es cerrada */}
                      {preg.tipo !== "respuesta_corta" && (
                        <div className="space-y-1.5 border-l-2 border-indigo-200 pt-1 pl-3">
                          {preg.opciones?.map((opt, oIdx) => (
                            <div key={opt.id || oIdx} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleOpcionCorrecta(pIdx, oIdx)}
                                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                                  opt.esCorrecta
                                    ? "border-emerald-600 bg-emerald-600 text-white"
                                    : "border-muted-foreground/30 text-transparent hover:border-emerald-600"
                                }`}
                                title="Marcar como correcta"
                              >
                                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                              </button>
                              <Input
                                value={opt.texto}
                                onChange={(e) => {
                                  const nuevas = [...(preg.opciones || [])];
                                  nuevas[oIdx] = { ...opt, texto: e.target.value };
                                  actualizarPregunta(pIdx, { opciones: nuevas });
                                }}
                                className="h-7 flex-1 text-xs"
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 p-0 text-[11px] text-indigo-600 hover:bg-transparent dark:text-indigo-400"
                            onClick={() => agregarOpcion(pIdx)}
                          >
                            + Agregar otra opción
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-800 dark:border-amber-950 dark:bg-amber-950/30 dark:text-amber-200">
            <HugeiconsIcon icon={InformationCircleIcon} size={16} className="shrink-0" />
            <span>
              Los trabajos y proyectos permiten una única entrega que el estudiante puede editar o
              reemplazar libremente hasta la fecha límite o hasta que sea calificada por el docente
              (CP-RF016-04).
            </span>
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCerrar} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="secondary"
          id="btn-guardar-borrador-tarea"
          onClick={() => void guardar(false)}
          disabled={isPending}
        >
          Guardar borrador
        </Button>
        <Button
          type="button"
          id="btn-publicar-tarea"
          onClick={() => void guardar(true)}
          disabled={isPending}
        >
          {isPending ? "Guardando..." : "Publicar ahora"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function TareaModal({
  abierto,
  onOpenChange,
  cursoSeccionId,
  tarea,
  unidadIdDefecto,
  periodoIdDefecto,
}: {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  cursoSeccionId: string;
  tarea?: Tarea | null;
  unidadIdDefecto?: string;
  periodoIdDefecto?: string;
}) {
  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      {abierto && (
        <FormularioTarea
          key={tarea?.id ?? "nueva"}
          cursoSeccionId={cursoSeccionId}
          tarea={tarea}
          unidadIdDefecto={unidadIdDefecto}
          periodoIdDefecto={periodoIdDefecto}
          onCerrar={() => onOpenChange(false)}
        />
      )}
    </Dialog>
  );
}
