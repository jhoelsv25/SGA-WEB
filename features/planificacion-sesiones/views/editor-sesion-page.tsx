"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { File02Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/lib/toast";
import { descargarDocx, descargarPdf } from "../api";
import { ANCLAS_HOJA, HojaSesionEditable } from "../components";
import { ESTADOS_PLANIFICACION, MENU_PLANIFICACION_SESIONES } from "../consts";
import {
  useDocumento,
  useGuardarPlanificacion,
  useMarcarLista,
  useOpciones,
  usePlanificacion,
  usePredeterminados,
  useSemana,
} from "../hooks";
import type { Bloque, GuardarPlanificacionPayload, Planificacion, Predeterminados } from "../types";
import {
  aPayload,
  estadoSecciones,
  guardarArchivo,
  limpiarPayload,
  minutosDeBloque,
  recortarHora,
} from "../utils";

interface Props {
  /** Planificación existente, o bien horarioId + fecha del bloque a planificar. */
  id?: string;
  horarioId?: string;
  fecha?: string;
}

const AUTOGUARDADO_MS = 4000;

export function EditorSesionPage({ id, horarioId, fecha }: Props) {
  const existente = usePlanificacion(id);
  const semana = useSemana(id ? undefined : fecha);
  const opciones = useOpciones();
  const predeterminados = usePredeterminados(!id);
  const bloqueNuevo = semana.data?.bloques.find(
    (b) => b.bloque.horarioId === horarioId && b.fecha === fecha,
  )?.bloque;
  return (
    <div className="animate-in fade-in-50 mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-2 duration-300">
      <PageHeader
        title="Planificar mi sesión"
        description="Llene la hoja tal como saldrá en Word. Se guarda sola y, cuando esté lista, la descarga."
        icon={File02Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Planificación de sesiones", href: MENU_PLANIFICACION_SESIONES },
          { label: "Sesión" },
        ]}
      />
      <PageState
        isLoading={
          (id ? existente.isLoading : semana.isLoading || predeterminados.isLoading) ||
          opciones.isLoading
        }
        isError={id ? existente.isError : semana.isError}
        error={id ? existente.error : semana.error}
        onRetry={() => void (id ? existente.refetch() : semana.refetch())}
      >
        {id && existente.data ? (
          <Formulario inicial={existente.data} />
        ) : horarioId && fecha && bloqueNuevo ? (
          <Formulario
            nuevo={{ horarioId, fecha, bloque: bloqueNuevo }}
            predeterminados={predeterminados.data}
          />
        ) : null}
      </PageState>
    </div>
  );
}

function Formulario({
  inicial,
  nuevo,
  predeterminados,
}: {
  predeterminados?: Predeterminados;
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
          coordinador: predeterminados?.coordinador ?? undefined,
          acuerdos: predeterminados?.acuerdos ?? [],
          momentos: [],
        },
  );
  const guardar = useGuardarPlanificacion();
  const autoguardar = useGuardarPlanificacion(true);
  const lista = useMarcarLista();
  const { data: opciones = [] } = useOpciones();
  // Datos que llena el sistema (lema, institución, bimestre, fechas).
  const documento = useDocumento(plan?.id);
  const ultimoGuardado = React.useRef(JSON.stringify(f));
  const [guardadoEn, setGuardadoEn] = React.useState<Date | null>(null);

  const bloque = plan?.bloque ?? nuevo?.bloque;
  const solo = plan?.estado === "ejecutada";
  const minutos = bloque ? minutosDeBloque(bloque.horaInicio, bloque.horaFin) : 0;
  const poner = (p: Partial<GuardarPlanificacionPayload>) => setF((a) => ({ ...a, ...p }));

  // Otras secciones del docente en el mismo curso y grado, según su horario
  const semana = useSemana(f.fecha || undefined);
  const otrasSecciones = [
    ...new Map(
      (semana.data?.bloques ?? [])
        .map((b) => b.bloque)
        .filter(
          (b) =>
            b.cursoNombre === bloque?.cursoNombre &&
            b.gradoNumero === bloque?.gradoNumero &&
            b.cursoSeccionId !== bloque?.cursoSeccionId,
        )
        .map((b) => [b.cursoSeccionId, b.seccionNombre]),
    ),
  ].map(([cursoSeccionId, nombre]) => ({ cursoSeccionId, nombre }));

  const instrumentos = opciones.filter((o) => o.tipo === "instrumento_evaluacion");

  const secciones = estadoSecciones(f, minutos);
  const hechas = secciones.filter((s) => s.listo).length;
  const faltan = secciones.filter((s) => !s.listo);

  // Autoguardado: solo cuando ya existe y sigue en borrador, para no pisar una sesión lista.
  React.useEffect(() => {
    if (!plan || plan.estado !== "borrador" || !f.titulo.trim()) return;
    const actual = JSON.stringify(f);
    if (actual === ultimoGuardado.current) return;
    const t = setTimeout(() => {
      autoguardar.mutate(limpiarPayload(f), {
        onSuccess: (r) => {
          ultimoGuardado.current = actual;
          setPlan(r.planificacion);
          setGuardadoEn(new Date());
        },
      });
    }, AUTOGUARDADO_MS);
    return () => clearTimeout(t);
  }, [f, plan]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onGuardar() {
    if (!f.titulo.trim()) {
      toast.error("Escriba el título de la sesión.");
      return undefined;
    }
    const r = await guardar.mutateAsync(limpiarPayload(f));
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
      toast.error("Primero elija los desempeños en la sección III.");
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
    <div className="space-y-4 pb-36 sm:pb-28">
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

      <p className="text-muted-foreground text-sm">
        {solo
          ? "La sesión ya se firmó: la hoja queda de solo lectura."
          : "Escriba directamente en la hoja: así quedará el Word. Haga clic en una celda para elegir del catálogo; lo que está en azul no sale en el documento."}
        {bloque && (
          <span className="block sm:inline">
            {" "}
            Bloque de {recortarHora(bloque.horaInicio)} a {recortarHora(bloque.horaFin)} ({minutos}{" "}
            min).
          </span>
        )}
      </p>

      {bloque && (
        <HojaSesionEditable
          f={f}
          poner={poner}
          bloque={bloque}
          documento={documento.data}
          otrasSecciones={otrasSecciones}
          docente={documento.data?.docente ?? plan?.docenteNombre ?? null}
          borrador={!plan || plan.estado === "borrador"}
          solo={solo}
          minutosBloque={minutos}
          instrumentos={instrumentos}
          onUsarDesempenos={usarDesempenosComoCriterios}
          onRepartirTiempo={repartirTiempo}
        />
      )}

      {/* Barra fija: progreso y acciones siempre a la mano */}
      <div className="bg-background border-border fixed inset-x-0 bottom-0 z-30 border-t px-4 py-3 md:left-[var(--sidebar-width,0px)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              {faltan[0] && !esLista && (
                <>
                  {" · Falta: "}
                  <a
                    href={`#${ANCLAS_HOJA[faltan[0].clave]}`}
                    className="text-foreground underline underline-offset-2"
                  >
                    {faltan[0].etiqueta}
                  </a>
                </>
              )}
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
