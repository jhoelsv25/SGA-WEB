"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { File02Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import { descargarDocx, descargarPdf } from "../api";
import {
  SeccionCompetencias,
  SeccionMomentos,
  SeccionTransversales,
  TarjetaSeccion,
  VistaDocumento,
} from "../components";
import { ESTADOS_PLANIFICACION, MENU_PLANIFICACION_SESIONES } from "../consts";
import {
  useDocumento,
  useGuardarPlanificacion,
  useMarcarLista,
  useOpciones,
  usePlanificacion,
  useSemana,
} from "../hooks";
import type { Bloque, GuardarPlanificacionPayload, Planificacion } from "../types";
import { aPayload, estadoSecciones, guardarArchivo, minutosDeBloque, recortarHora } from "../utils";

interface Props {
  /** Planificación existente, o bien horarioId + fecha del bloque a planificar. */
  id?: string;
  horarioId?: string;
  fecha?: string;
}

const lineas = (t: string) => t.split("\n");
const AUTOGUARDADO_MS = 4000;

export function EditorSesionPage({ id, horarioId, fecha }: Props) {
  const existente = usePlanificacion(id);
  const semana = useSemana(id ? undefined : fecha);
  const opciones = useOpciones();
  const referencias = (opciones.data ?? [])
    .filter((o) => o.tipo === "referencia")
    .map((o) => o.nombre);
  const bloqueNuevo = semana.data?.bloques.find(
    (b) => b.bloque.horarioId === horarioId && b.fecha === fecha,
  )?.bloque;
  return (
    <div className="animate-in fade-in-50 mx-auto flex w-full max-w-4xl flex-col gap-2 duration-300">
      <PageHeader
        title="Planificar mi sesión"
        description="Vaya llenando cada parte. Se guarda sola y al final la descarga en Word."
        icon={File02Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Planificación de sesiones", href: MENU_PLANIFICACION_SESIONES },
          { label: "Sesión" },
        ]}
      />
      <PageState
        isLoading={(id ? existente.isLoading : semana.isLoading) || opciones.isLoading}
        isError={id ? existente.isError : semana.isError}
        error={id ? existente.error : semana.error}
        onRetry={() => void (id ? existente.refetch() : semana.refetch())}
      >
        {id && existente.data ? (
          <Formulario inicial={existente.data} referencias={referencias} />
        ) : horarioId && fecha && bloqueNuevo ? (
          <Formulario nuevo={{ horarioId, fecha, bloque: bloqueNuevo }} referencias={referencias} />
        ) : null}
      </PageState>
    </div>
  );
}

function Formulario({
  inicial,
  nuevo,
  referencias,
}: {
  referencias: string[];
  inicial?: Planificacion;
  nuevo?: { horarioId: string; fecha: string; bloque: Bloque };
}) {
  const router = useRouter();
  const [plan, setPlan] = React.useState<Planificacion | undefined>(inicial);
  const [f, setF] = React.useState<GuardarPlanificacionPayload>(() =>
    inicial
      ? aPayload(inicial)
      : {
          horarioId: nuevo?.horarioId ?? "",
          fecha: nuevo?.fecha ?? "",
          titulo: "",
          criterios: [],
          competencias: [{ competenciaId: "", capacidades: [], desempenos: [] }],
          referencias,
          momentos: [],
        },
  );
  const guardar = useGuardarPlanificacion();
  const autoguardar = useGuardarPlanificacion(true);
  const lista = useMarcarLista();
  const { data: opciones = [] } = useOpciones();
  const [vista, setVista] = React.useState(false);
  const documento = useDocumento(plan?.id, vista);
  const ultimoGuardado = React.useRef(JSON.stringify(f));
  const [guardadoEn, setGuardadoEn] = React.useState<Date | null>(null);

  const bloque = plan?.bloque ?? nuevo?.bloque;
  const solo = plan?.estado === "ejecutada";
  const minutos = bloque ? minutosDeBloque(bloque.horaInicio, bloque.horaFin) : 0;
  const poner = (p: Partial<GuardarPlanificacionPayload>) => setF((a) => ({ ...a, ...p }));

  const instrumentos = opciones.filter((o) => o.tipo === "instrumento_evaluacion");

  const secciones = estadoSecciones(f, minutos);
  const hechas = secciones.filter((s) => s.listo).length;
  const listoDe = (k: string) => secciones.find((s) => s.clave === k)?.listo ?? false;
  const faltan = secciones.filter((s) => !s.listo);

  // Autoguardado: solo cuando ya existe y sigue en borrador, para no pisar una sesión lista.
  React.useEffect(() => {
    if (!plan || plan.estado !== "borrador" || !f.titulo.trim()) return;
    const actual = JSON.stringify(f);
    if (actual === ultimoGuardado.current) return;
    const t = setTimeout(() => {
      autoguardar.mutate(
        { ...f, competencias: (f.competencias ?? []).filter((c) => c.competenciaId) },
        {
          onSuccess: (r) => {
            ultimoGuardado.current = actual;
            setPlan(r.planificacion);
            setGuardadoEn(new Date());
          },
        },
      );
    }, AUTOGUARDADO_MS);
    return () => clearTimeout(t);
  }, [f, plan]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onGuardar() {
    if (!f.titulo.trim()) {
      toast.error("Escriba el título de la sesión.");
      return undefined;
    }
    const r = await guardar.mutateAsync({
      ...f,
      competencias: (f.competencias ?? []).filter((c) => c.competenciaId),
    });
    ultimoGuardado.current = JSON.stringify(f);
    setGuardadoEn(new Date());
    setPlan(r.planificacion);
    if (!plan) router.replace(`${MENU_PLANIFICACION_SESIONES}/editor?id=${r.planificacion.id}`);
    return r.planificacion;
  }

  async function onLista() {
    const guardada = await onGuardar();
    if (guardada) {
      const r = await lista.mutateAsync(guardada.id);
      setPlan(r.planificacion);
    }
  }

  async function bajar(tipo: "pdf" | "docx") {
    if (!plan) return;
    const a = tipo === "pdf" ? await descargarPdf(plan.id) : await descargarDocx(plan.id);
    guardarArchivo(a.blob, a.nombre);
  }

  const estado = ESTADOS_PLANIFICACION[plan?.estado ?? "borrador"];
  const esLista = plan?.estado === "lista" || plan?.estado === "ejecutada";

  const usarDesempenosComoCriterios = () => {
    const textos = (f.competencias ?? []).flatMap((c) => c.desempenos.map((d) => d.texto));
    if (textos.length === 0) {
      toast.error("Primero elija los desempeños en la parte 2.");
      return;
    }
    poner({ criterios: textos });
  };

  const repartirTiempo = () => {
    const inicio = Math.round(minutos * 0.17);
    const cierre = Math.round(minutos * 0.11);
    const reparto = { inicio, desarrollo: minutos - inicio - cierre, cierre };
    poner({
      momentos: (["inicio", "desarrollo", "cierre"] as const).map((m) => ({
        momento: m,
        actividades: f.momentos?.find((x) => x.momento === m)?.actividades,
        minutos: reparto[m],
      })),
    });
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Cabecera como la plantilla: datos informativos, ya llenos por el sistema */}
      {bloque && (
        <section className="bg-muted/40 border-border/80 grid gap-x-6 gap-y-1 rounded-2xl border p-4 text-sm sm:grid-cols-2">
          <Dato t="Docente" v={plan?.docenteNombre ?? "Usted"} />
          <Dato t="Área" v={bloque.cursoNombre} />
          <Dato t="Grado y sección" v={`${bloque.gradoNombre} ${bloque.seccionNombre}`} />
          <Dato
            t="Fecha y hora"
            v={`${f.fecha} · ${recortarHora(bloque.horaInicio)}–${recortarHora(bloque.horaFin)} (${minutos} min)`}
          />
        </section>
      )}

      {plan && plan.comentarios.length > 0 && (
        <section className="border-warning/40 bg-warning/10 rounded-2xl border p-4 text-sm">
          <h2 className="font-semibold">Comentarios de la subdirección</h2>
          <ul className="mt-2 space-y-1">
            {plan.comentarios.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.autor}:</span> {c.texto}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex gap-2" role="group" aria-label="Modo de vista">
        <Button
          type="button"
          variant={vista ? "outline" : "default"}
          className="rounded-full"
          onClick={() => setVista(false)}
        >
          Escribir
        </Button>
        <Button
          type="button"
          variant={vista ? "default" : "outline"}
          className="rounded-full"
          disabled={!plan}
          onClick={() => setVista(true)}
        >
          Ver cómo queda el documento
        </Button>
      </div>

      {vista ? (
        <PageState
          isLoading={documento.isLoading}
          isError={documento.isError}
          error={documento.error}
          onRetry={() => void documento.refetch()}
        >
          {documento.data && <VistaDocumento doc={documento.data} />}
        </PageState>
      ) : (
        <>
          <TarjetaSeccion
            id="p1"
            numero="1"
            titulo="¿De qué trata la sesión?"
            ayuda="Póngale un título y cuente en una o dos frases qué van a lograr hoy los estudiantes."
            listo={listoDe("datos")}
          >
            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <Campo id="numero" etiqueta="N.° de sesión">
                <Input
                  id="numero"
                  type="number"
                  min={1}
                  className="h-11 text-base"
                  disabled={solo}
                  value={f.numero ?? ""}
                  onChange={(e) =>
                    poner({ numero: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </Campo>
              <Campo id="titulo" etiqueta="Título de la sesión *">
                <Input
                  id="titulo"
                  className="h-11 text-base"
                  disabled={solo}
                  placeholder="Ej.: Aprendemos a resolver ecuaciones con una incógnita"
                  value={f.titulo}
                  onChange={(e) => poner({ titulo: e.target.value })}
                />
              </Campo>
            </div>
            <Campo id="unidad" etiqueta="Unidad (opcional)">
              <Input
                id="unidad"
                className="h-11 text-base"
                disabled={solo}
                placeholder="Ej.: Unidad 7"
                value={f.unidad ?? ""}
                onChange={(e) => poner({ unidad: e.target.value })}
              />
            </Campo>
            <Campo id="proposito" etiqueta="Propósito: ¿qué van a aprender hoy?">
              <Textarea
                id="proposito"
                rows={3}
                className="text-base"
                disabled={solo}
                placeholder="Ej.: Hoy los estudiantes aprenderán a plantear y resolver ecuaciones sencillas."
                value={f.proposito ?? ""}
                onChange={(e) => poner({ proposito: e.target.value })}
              />
            </Campo>
          </TarjetaSeccion>

          <TarjetaSeccion
            id="p2"
            numero="2"
            titulo="Competencias, capacidades y desempeños"
            ayuda="Elija de la lista; no tiene que escribir nada. Marque los desempeños que va a trabajar."
            listo={listoDe("competencias")}
          >
            {bloque && (
              <SeccionCompetencias
                bloque={bloque}
                valor={f.competencias ?? []}
                disabled={solo}
                onChange={(competencias) => poner({ competencias })}
              />
            )}
          </TarjetaSeccion>

          <TarjetaSeccion
            id="p3"
            numero="3"
            titulo="¿Cómo voy a evaluar?"
            ayuda="Diga qué producto o evidencia entregarán, qué mirará y con qué instrumento."
            listo={listoDe("evaluacion")}
          >
            <Campo id="evidencia" etiqueta="Evidencia de aprendizaje">
              <Textarea
                id="evidencia"
                rows={2}
                className="text-base"
                disabled={solo}
                placeholder="Ej.: Resuelven 5 ecuaciones en su cuaderno y explican un procedimiento."
                value={f.evidencia ?? ""}
                onChange={(e) => poner({ evidencia: e.target.value })}
              />
            </Campo>
            <Campo id="criterios" etiqueta="Criterios de evaluación (uno por línea)">
              <Textarea
                id="criterios"
                rows={4}
                className="text-base"
                disabled={solo}
                value={(f.criterios ?? []).join("\n")}
                onChange={(e) => poner({ criterios: lineas(e.target.value) })}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={solo}
                onClick={usarDesempenosComoCriterios}
              >
                Usar mis desempeños como criterios
              </Button>
            </Campo>
            <Campo id="instrumento" etiqueta="Instrumento de evaluación">
              <SelectOption
                options={instrumentos.map((o) => ({ value: o.codigo, label: o.nombre }))}
                value={f.instrumentoCodigo}
                placeholder="Elija un instrumento"
                disabled={solo}
                clearable
                onSelect={(v) => poner({ instrumentoCodigo: v })}
              />
            </Campo>
          </TarjetaSeccion>

          <TarjetaSeccion
            id="p4"
            numero="4"
            titulo="Competencias y enfoques transversales"
            ayuda="Si su sesión también trabaja TIC, autonomía o algún enfoque (valores), márquelo aquí."
            opcional
          >
            <SeccionTransversales
              transversales={f.competenciasTransversales ?? []}
              enfoques={f.enfoques ?? []}
              disabled={solo}
              onTransversales={(competenciasTransversales) => poner({ competenciasTransversales })}
              onEnfoques={(enfoques) => poner({ enfoques })}
            />
          </TarjetaSeccion>

          <TarjetaSeccion
            id="p5"
            numero="5"
            titulo="Secuencia didáctica: inicio, desarrollo y cierre"
            ayuda="Cuente qué hará en cada momento de la clase y cuántos minutos le dedicará."
            listo={listoDe("secuencia")}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={solo}
              onClick={repartirTiempo}
            >
              Repartir el tiempo por mí
            </Button>
            <SeccionMomentos
              valor={f.momentos ?? []}
              minutosBloque={minutos}
              disabled={solo}
              onChange={(momentos) => poner({ momentos })}
            />
          </TarjetaSeccion>

          <TarjetaSeccion
            id="p6"
            numero="6"
            titulo="Materiales"
            ayuda="Lo que necesitará: fichas, plumones, calculadora, videos… uno por línea."
            opcional
          >
            <Campo id="impresos" etiqueta="Impresos">
              <Textarea
                id="impresos"
                rows={2}
                className="text-base"
                disabled={solo}
                value={(f.materiales?.impresos ?? []).join("\n")}
                onChange={(e) =>
                  poner({ materiales: { ...f.materiales, impresos: lineas(e.target.value) } })
                }
              />
            </Campo>
            <Campo id="manipulativos" etiqueta="Para manipular">
              <Textarea
                id="manipulativos"
                rows={2}
                className="text-base"
                disabled={solo}
                value={(f.materiales?.manipulativos ?? []).join("\n")}
                onChange={(e) =>
                  poner({ materiales: { ...f.materiales, manipulativos: lineas(e.target.value) } })
                }
              />
            </Campo>
            <Campo id="digitales" etiqueta="Digitales">
              <Textarea
                id="digitales"
                rows={2}
                className="text-base"
                disabled={solo}
                value={(f.materiales?.digitales ?? []).join("\n")}
                onChange={(e) =>
                  poner({ materiales: { ...f.materiales, digitales: lineas(e.target.value) } })
                }
              />
            </Campo>
          </TarjetaSeccion>

          <TarjetaSeccion
            id="p7"
            numero="7"
            titulo="Referencias bibliográficas"
            ayuda="Ya vienen las oficiales del Ministerio. Agregue más si las usó, una por línea."
            listo={listoDe("referencias")}
          >
            <Textarea
              id="referencias"
              aria-label="Referencias"
              rows={3}
              className="text-base"
              disabled={solo}
              value={(f.referencias ?? []).join("\n")}
              onChange={(e) => poner({ referencias: lineas(e.target.value) })}
            />
          </TarjetaSeccion>
        </>
      )}

      {/* Barra fija: progreso y acciones siempre a la mano */}
      <div className="bg-background/95 border-border fixed inset-x-0 bottom-0 z-30 border-t px-4 py-3 backdrop-blur md:left-[var(--sidebar-width,0px)]">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1.5 sm:w-64">
            <div className="flex items-center gap-2 text-sm">
              <StatusBadge tone={estado.tono}>{estado.etiqueta}</StatusBadge>
              <span className="font-medium">
                {hechas} de {secciones.length} partes listas
              </span>
            </div>
            <Progress value={hechas} max={secciones.length} aria-label="Avance de la sesión" />
            <p className="text-muted-foreground truncate text-xs" role="status">
              {guardadoEn
                ? `Guardado a las ${guardadoEn.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`
                : plan?.estado === "borrador"
                  ? "Se guarda sola mientras escribe"
                  : ""}
              {faltan.length > 0 && !esLista ? ` · Falta: ${faltan[0]?.etiqueta}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href={MENU_PLANIFICACION_SESIONES}>Volver</Link>
            </Button>
            {!solo && (
              <Button
                variant="outline"
                className="rounded-full"
                disabled={guardar.isPending}
                onClick={() => void onGuardar()}
              >
                Guardar
              </Button>
            )}
            {!solo && !esLista && (
              <Button
                className="rounded-full"
                disabled={guardar.isPending || lista.isPending}
                onClick={() => void onLista()}
              >
                Ya está lista
              </Button>
            )}
            {esLista && (
              <>
                <Button className="rounded-full" onClick={() => void bajar("docx")}>
                  Descargar en Word
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => void bajar("pdf")}
                >
                  PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dato({ t, v }: { t: string; v: string }) {
  return (
    <p>
      <span className="text-muted-foreground">{t}: </span>
      <span className="font-medium">{v}</span>
    </p>
  );
}

function Campo({
  id,
  etiqueta,
  children,
}: {
  id: string;
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-base font-medium">
        {etiqueta}
      </Label>
      {children}
    </div>
  );
}
