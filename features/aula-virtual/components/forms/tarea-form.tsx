"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  FloppyDiskIcon,
  InformationCircleIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { toast } from "@/lib/toast";
import { useActualizarTarea, useCrearTarea } from "../../hooks";
import type {
  CalculoNotaIntentos,
  Pregunta,
  RevelarRespuestas,
  Tarea,
  TipoPregunta,
  TipoTarea,
} from "../../types";

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

const OPCIONES_CALCULO_NOTA: SelectOptionItem<CalculoNotaIntentos>[] = [
  { value: "mas_alta", label: "La más alta" },
  { value: "ultima", label: "La última" },
  { value: "promedio", label: "Promedio" },
];

const OPCIONES_REVELAR_RESPUESTAS: SelectOptionItem<RevelarRespuestas>[] = [
  { value: "al_terminar_intentos", label: "Al agotar los intentos" },
  { value: "despues_fecha_limite", label: "Tras la fecha límite" },
  { value: "inmediato", label: "Inmediatamente" },
  { value: "nunca", label: "Nunca" },
];

export interface TareaFormProps {
  cursoSeccionId: string;
  tarea?: Tarea | null;
  unidades?: Array<{ id: string; titulo: string }>;
  unidadIdDefecto?: string;
  periodoIdDefecto?: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function TareaForm({
  cursoSeccionId,
  tarea,
  unidades = [],
  unidadIdDefecto,
  periodoIdDefecto,
  onCancel,
  onSuccess,
}: TareaFormProps) {
  const esEdicion = Boolean(tarea);
  const crear = useCrearTarea(cursoSeccionId);
  const actualizar = useActualizarTarea();

  const [titulo, setTitulo] = React.useState(tarea?.titulo ?? "");
  const [instrucciones, setInstrucciones] = React.useState(tarea?.instrucciones ?? "");
  const [tipo, setTipo] = React.useState<TipoTarea>(tarea?.tipo ?? "trabajo");
  const [unidadId, setUnidadId] = React.useState<string>(tarea?.unidadId ?? unidadIdDefecto ?? "");
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

  const opcionesUnidades = React.useMemo<SelectOptionItem<string>[]>(() => {
    return [
      { value: "sin_asignar", label: "Sin unidad asignada" },
      ...unidades.map((u) => ({
        value: u.id,
        label: u.titulo,
      })),
    ];
  }, [unidades]);

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
      unidadId: unidadId || undefined,
      periodoId: periodoIdDefecto,
      preguntas: esEvaluacionConPreguntas ? preguntas : undefined,
    };

    if (esEdicion && tarea) {
      await actualizar.mutateAsync({ id: tarea.id, ...payload });
    } else {
      await crear.mutateAsync(payload);
    }
    onSuccess?.();
  };

  const isPending = crear.isPending || actualizar.isPending;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5 py-2">
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

        {unidades.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Unidad de aprendizaje (opcional)</Label>
            <SelectOption
              value={unidadId || "sin_asignar"}
              onSelect={(val) => setUnidadId(val === "sin_asignar" ? "" : val)}
              options={opcionesUnidades}
              placeholder="Seleccionar unidad..."
              searchPlaceholder="Buscar unidad..."
              emptyMessage="No se encontraron unidades."
            />
          </div>
        )}
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
              <Label htmlFor="switch-entrega-tardia" className="cursor-pointer text-xs font-medium">
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

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Cálculo de nota</Label>
              <SelectOption
                value={calculoNotaIntentos}
                onSelect={(val) => setCalculoNotaIntentos(val as CalculoNotaIntentos)}
                options={OPCIONES_CALCULO_NOTA}
                placeholder="Seleccione método"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Mostrar respuestas correctas</Label>
              <SelectOption
                value={revelarRespuestas}
                onSelect={(val) => setRevelarRespuestas(val as RevelarRespuestas)}
                options={OPCIONES_REVELAR_RESPUESTAS}
                placeholder="Seleccione visibilidad"
              />
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
            reemplazar libremente hasta la fecha límite o hasta que sea calificada por el docente.
          </span>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={onCancel}
          disabled={isPending}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
          <span>Cancelar</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          id="btn-guardar-borrador-tarea"
          className="gap-2"
          onClick={() => void guardar(false)}
          disabled={isPending}
        >
          <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
          <span>Guardar borrador</span>
        </Button>
        <Button
          type="button"
          id="btn-publicar-tarea"
          className="gap-2"
          onClick={() => void guardar(true)}
          disabled={isPending}
        >
          <HugeiconsIcon icon={Upload01Icon} size={16} />
          <span>{isPending ? "Guardando..." : "Publicar ahora"}</span>
        </Button>
      </div>
    </form>
  );
}
