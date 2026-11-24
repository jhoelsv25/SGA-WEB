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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import { descargarDocx, descargarPdf } from "../api";
import {
  SeccionCompetencias,
  SeccionMomentos,
  SeccionTransversales,
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
import { aPayload, guardarArchivo, minutosDeBloque, recortarHora } from "../utils";

interface Props {
  /** Planificación existente, o bien horarioId + fecha del bloque a planificar. */
  id?: string;
  horarioId?: string;
  fecha?: string;
}

export function EditorSesionPage({ id, horarioId, fecha }: Props) {
  const existente = usePlanificacion(id);
  const semana = useSemana(id ? undefined : fecha);
  const bloqueNuevo = semana.data?.bloques.find(
    (b) => b.bloque.horarioId === horarioId && b.fecha === fecha,
  )?.bloque;
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Planificar sesión"
        description="Complete los datos; el documento se arma solo con el formato estándar."
        icon={File02Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Planificación de sesiones", href: MENU_PLANIFICACION_SESIONES },
          { label: "Editor" },
        ]}
      />
      <PageState
        isLoading={id ? existente.isLoading : semana.isLoading}
        isError={id ? existente.isError : semana.isError}
        error={id ? existente.error : semana.error}
        onRetry={() => void (id ? existente.refetch() : semana.refetch())}
      >
        {id && existente.data ? (
          <Formulario inicial={existente.data} />
        ) : horarioId && fecha && bloqueNuevo ? (
          <Formulario nuevo={{ horarioId, fecha, bloque: bloqueNuevo }} />
        ) : null}
      </PageState>
    </div>
  );
}

function Formulario({
  inicial,
  nuevo,
}: {
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
          referencias: [],
          momentos: [],
        },
  );
  const guardar = useGuardarPlanificacion();
  const lista = useMarcarLista();
  const { data: opciones = [] } = useOpciones();
  const [pestana, setPestana] = React.useState("editar");
  const documento = useDocumento(plan?.id, pestana === "vista");

  const bloque = plan?.bloque ?? nuevo?.bloque;
  const solo = plan?.estado === "ejecutada";
  const minutos = bloque ? minutosDeBloque(bloque.horaInicio, bloque.horaFin) : 0;
  const poner = (p: Partial<GuardarPlanificacionPayload>) => setF((a) => ({ ...a, ...p }));

  const instrumentos = opciones.filter((o) => o.tipo === "instrumento_evaluacion");
  const referenciasCatalogo = opciones.filter((o) => o.tipo === "referencia");

  async function onGuardar() {
    if (!f.titulo.trim()) {
      toast.error("Escriba el título de la sesión.");
      return undefined;
    }
    const r = await guardar.mutateAsync({
      ...f,
      competencias: (f.competencias ?? []).filter((c) => c.competenciaId),
    });
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

  return (
    <div className="space-y-4">
      {bloque && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium">
            {bloque.cursoNombre} · {bloque.gradoNombre} {bloque.seccionNombre}
          </span>
          <span className="text-muted-foreground">
            {f.fecha} · {recortarHora(bloque.horaInicio)}–{recortarHora(bloque.horaFin)} ({minutos}{" "}
            min)
          </span>
          <StatusBadge tone={estado.tono}>{estado.etiqueta}</StatusBadge>
        </div>
      )}
      {plan && plan.comentarios.length > 0 && (
        <section className="border-border/80 rounded-2xl border p-4 text-sm">
          <h2 className="font-semibold">Comentarios de supervisión</h2>
          <ul className="mt-2 space-y-1">
            {plan.comentarios.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.autor}:</span> {c.texto}
              </li>
            ))}
          </ul>
        </section>
      )}
      <Tabs value={pestana} onValueChange={setPestana}>
        <TabsList>
          <TabsTrigger value="editar">Editar</TabsTrigger>
          <TabsTrigger value="vista" disabled={!plan}>
            Vista del documento
          </TabsTrigger>
        </TabsList>
        <TabsContent value="editar" className="space-y-6 pt-4">
          <Seccion titulo="Datos generales">
            <div className="grid gap-3 sm:grid-cols-3">
              <Campo id="numero" etiqueta="N.° de sesión">
                <Input
                  id="numero"
                  type="number"
                  min={1}
                  disabled={solo}
                  value={f.numero ?? ""}
                  onChange={(e) =>
                    poner({ numero: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </Campo>
              <Campo id="unidad" etiqueta="Unidad">
                <Input
                  id="unidad"
                  disabled={solo}
                  value={f.unidad ?? ""}
                  onChange={(e) => poner({ unidad: e.target.value })}
                />
              </Campo>
              <Campo id="titulo" etiqueta="Título de la sesión *">
                <Input
                  id="titulo"
                  disabled={solo}
                  value={f.titulo}
                  onChange={(e) => poner({ titulo: e.target.value })}
                />
              </Campo>
            </div>
            <Campo id="proposito" etiqueta="Propósito de aprendizaje">
              <Textarea
                id="proposito"
                rows={3}
                disabled={solo}
                value={f.proposito ?? ""}
                onChange={(e) => poner({ proposito: e.target.value })}
              />
            </Campo>
          </Seccion>

          <Seccion titulo="Competencias, capacidades y desempeños">
            {bloque && (
              <SeccionCompetencias
                bloque={bloque}
                valor={f.competencias ?? []}
                disabled={solo}
                onChange={(competencias) => poner({ competencias })}
              />
            )}
          </Seccion>

          <Seccion titulo="Competencias y enfoques transversales">
            <SeccionTransversales
              transversales={f.competenciasTransversales ?? []}
              enfoques={f.enfoques ?? []}
              disabled={solo}
              onTransversales={(competenciasTransversales) => poner({ competenciasTransversales })}
              onEnfoques={(enfoques) => poner({ enfoques })}
            />
          </Seccion>

          <Seccion titulo="Evaluación">
            <Campo id="evidencia" etiqueta="Evidencia de aprendizaje">
              <Textarea
                id="evidencia"
                rows={2}
                disabled={solo}
                value={f.evidencia ?? ""}
                onChange={(e) => poner({ evidencia: e.target.value })}
              />
            </Campo>
            <Campo id="criterios" etiqueta="Criterios de evaluación (uno por línea)">
              <Textarea
                id="criterios"
                rows={3}
                disabled={solo}
                value={(f.criterios ?? []).join("\n")}
                onChange={(e) => poner({ criterios: e.target.value.split("\n") })}
              />
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
          </Seccion>

          <Seccion titulo="Secuencia didáctica">
            <SeccionMomentos
              valor={f.momentos ?? []}
              minutosBloque={minutos}
              disabled={solo}
              onChange={(momentos) => poner({ momentos })}
            />
          </Seccion>

          <Seccion titulo="Materiales y referencias">
            <Campo id="impresos" etiqueta="Materiales impresos y recursos (uno por línea)">
              <Textarea
                id="impresos"
                rows={2}
                disabled={solo}
                value={(f.materiales?.impresos ?? []).join("\n")}
                onChange={(e) =>
                  poner({ materiales: { ...f.materiales, impresos: e.target.value.split("\n") } })
                }
              />
            </Campo>
            <Campo id="manipulativos" etiqueta="Materiales manipulativos (uno por línea)">
              <Textarea
                id="manipulativos"
                rows={2}
                disabled={solo}
                value={(f.materiales?.manipulativos ?? []).join("\n")}
                onChange={(e) =>
                  poner({
                    materiales: { ...f.materiales, manipulativos: e.target.value.split("\n") },
                  })
                }
              />
            </Campo>
            <Campo id="digitales" etiqueta="Recursos digitales (uno por línea)">
              <Textarea
                id="digitales"
                rows={2}
                disabled={solo}
                value={(f.materiales?.digitales ?? []).join("\n")}
                onChange={(e) =>
                  poner({ materiales: { ...f.materiales, digitales: e.target.value.split("\n") } })
                }
              />
            </Campo>
            <Campo id="referencias" etiqueta="Referencias (una por línea)">
              <Textarea
                id="referencias"
                rows={2}
                disabled={solo}
                placeholder={referenciasCatalogo[0]?.nombre}
                value={(f.referencias ?? []).join("\n")}
                onChange={(e) => poner({ referencias: e.target.value.split("\n") })}
              />
            </Campo>
          </Seccion>
        </TabsContent>
        <TabsContent value="vista" className="pt-4">
          <PageState
            isLoading={documento.isLoading}
            isError={documento.isError}
            error={documento.error}
            onRetry={() => void documento.refetch()}
          >
            {documento.data && <VistaDocumento doc={documento.data} />}
          </PageState>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap justify-end gap-2.5 pt-2">
        <Button asChild variant="outline" className="rounded-full">
          <Link href={MENU_PLANIFICACION_SESIONES}>Volver</Link>
        </Button>
        {plan && (
          <>
            <Button variant="outline" className="rounded-full" onClick={() => void bajar("pdf")}>
              Descargar PDF
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => void bajar("docx")}>
              Descargar Word
            </Button>
          </>
        )}
        {!solo && (
          <>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={guardar.isPending}
              onClick={() => void onGuardar()}
            >
              Guardar borrador
            </Button>
            <Button
              className="rounded-full"
              disabled={guardar.isPending || lista.isPending}
              onClick={() => void onLista()}
            >
              Marcar como lista
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">{titulo}</h2>
      {children}
    </section>
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
      <Label htmlFor={id} className="text-sm font-medium">
        {etiqueta}
      </Label>
      {children}
    </div>
  );
}
