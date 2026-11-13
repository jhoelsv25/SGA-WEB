"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/formatters/date";
import { Campo, MensajeError, PieFormulario } from "../components";
import { DescripcionNivel } from "../components/resumen-niveles";
import { NIVELES, TEXTO_NIVEL_PENDIENTE } from "../consts";
import {
  useActorObservacion,
  useCrearInstrumento,
  useInstrumentos,
  useMarcarInstrumentoVigente,
} from "../hooks";
import type { Instrumento, InstrumentoPayload } from "../types";

interface BorradorDesempeno {
  numero: number;
  nombre: string;
  aspectos: string;
  niveles: Record<number, string>;
}

/** Arma el borrador de 5 desempeños; con una base, copia su contenido (sin los marcadores pendientes). */
function borradorDe(base?: Instrumento): BorradorDesempeno[] {
  return [1, 2, 3, 4, 5].map((numero) => {
    const origen = base?.contenido.desempenos.find((d) => d.numero === numero);
    return {
      numero,
      nombre: origen?.nombre ?? "",
      aspectos: origen?.aspectos.join("\n") ?? "",
      niveles: Object.fromEntries(
        NIVELES.map((n) => {
          const texto = origen?.niveles.find((x) => x.nivel === n.nivel)?.descripcion ?? "";
          return [n.nivel, texto === TEXTO_NIVEL_PENDIENTE ? "" : texto];
        }),
      ),
    };
  });
}

function FormularioInstrumento({
  base,
  onOpenChange,
}: {
  base?: Instrumento;
  onOpenChange: (a: boolean) => void;
}) {
  const crear = useCrearInstrumento();
  const [codigo, setCodigo] = React.useState("");
  const [nombre, setNombre] = React.useState(base ? `${base.nombre} (copia)` : "");
  const [desempenos, setDesempenos] = React.useState(() => borradorDe(base));
  const [vigente, setVigente] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const cambiar = (numero: number, cambio: Partial<BorradorDesempeno>) =>
    setDesempenos((prev) => prev.map((d) => (d.numero === numero ? { ...d, ...cambio } : d)));

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!codigo.trim() || !nombre.trim()) {
      setError("Indique el código y el nombre de la versión.");
      return;
    }
    setError(undefined);
    const payload: InstrumentoPayload = {
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      vigente,
      desempenos: desempenos.map((d) => ({
        numero: d.numero,
        nombre: d.nombre.trim(),
        aspectos: d.aspectos
          .split("\n")
          .map((a) => a.trim())
          .filter(Boolean),
        niveles: NIVELES.map((n) => ({
          nivel: n.nivel,
          descripcion: d.niveles[n.nivel]?.trim() ?? "",
        })),
      })),
    };
    crear.mutate(payload, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo id="ins-codigo" etiqueta="Código *" error={error}>
          <Input
            id="ins-codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            maxLength={60}
            disabled={crear.isPending}
          />
        </Campo>
        <Campo id="ins-nombre" etiqueta="Nombre *">
          <Input
            id="ins-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={150}
            disabled={crear.isPending}
          />
        </Campo>
      </div>
      {desempenos.map((d) => (
        <fieldset key={d.numero} className="border-border/70 space-y-3 rounded-2xl border p-4">
          <legend className="px-1 text-sm font-semibold">Desempeño {d.numero}</legend>
          <Campo id={`ins-${d.numero}-nombre`} etiqueta="Nombre del desempeño">
            <Input
              id={`ins-${d.numero}-nombre`}
              value={d.nombre}
              onChange={(e) => cambiar(d.numero, { nombre: e.target.value })}
              maxLength={250}
              disabled={crear.isPending}
            />
          </Campo>
          <Campo id={`ins-${d.numero}-aspectos`} etiqueta="Aspectos (uno por línea)">
            <Textarea
              id={`ins-${d.numero}-aspectos`}
              value={d.aspectos}
              onChange={(e) => cambiar(d.numero, { aspectos: e.target.value })}
              rows={3}
              disabled={crear.isPending}
            />
          </Campo>
          {NIVELES.map((n) => (
            <Campo
              key={n.nivel}
              id={`ins-${d.numero}-nivel-${n.nivel}`}
              etiqueta={`Nivel ${n.romano} · ${n.nombre}`}
            >
              <Textarea
                id={`ins-${d.numero}-nivel-${n.nivel}`}
                value={d.niveles[n.nivel] ?? ""}
                onChange={(e) =>
                  cambiar(d.numero, { niveles: { ...d.niveles, [n.nivel]: e.target.value } })
                }
                maxLength={1500}
                rows={3}
                disabled={crear.isPending}
              />
            </Campo>
          ))}
        </fieldset>
      ))}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={vigente}
          onChange={(e) => setVigente(e.target.checked)}
          disabled={crear.isPending}
        />
        Marcar como vigente (exige los 5 desempeños con la descripción de los 4 niveles)
      </label>
      {crear.isError && <MensajeError>{crear.error.message}</MensajeError>}
      <PieFormulario
        onCancelar={() => onOpenChange(false)}
        textoEnviar="Guardar versión"
        cargando={crear.isPending}
      />
    </form>
  );
}

function contarPendientes(instrumento: Instrumento): number {
  return instrumento.contenido.desempenos.reduce(
    (total, d) =>
      total +
      d.niveles.filter((n) => !n.descripcion || n.descripcion.trim() === TEXTO_NIVEL_PENDIENTE)
        .length,
    0,
  );
}

/** Versiones del instrumento de observación; el Administrador carga versiones y marca la vigente. */
export function TabInstrumento() {
  const { data = [], isLoading, isError, error, refetch } = useInstrumentos();
  const marcar = useMarcarInstrumentoVigente();
  const { esAdministrador } = useActorObservacion();
  const [nueva, setNueva] = React.useState<{ base?: Instrumento } | null>(null);
  const [abierto, setAbierto] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground max-w-prose text-sm">
          Cada observación usa la versión vigente al programarse. Los textos de los niveles se
          cargan desde el instructivo oficial.
        </p>
        {esAdministrador && (
          <Button
            type="button"
            className="min-h-10"
            onClick={() => setNueva({ base: data.find((i) => i.vigente) })}
          >
            Nueva versión
          </Button>
        )}
      </div>
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={data.length === 0}
        empty={{ title: "Sin versiones del instrumento" }}
      >
        <ul className="space-y-3">
          {data.map((i) => {
            const pendientes = contarPendientes(i);
            return (
              <li key={i.id} className="border-border/80 bg-card space-y-3 rounded-2xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{i.nombre}</p>
                    <p className="text-muted-foreground text-xs">
                      {i.codigo} · creada el {formatDate(i.creadoEn)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {i.vigente ? (
                      <StatusBadge tone="success">Vigente</StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">Anterior</StatusBadge>
                    )}
                    {pendientes > 0 && (
                      <StatusBadge tone="warning">
                        {pendientes} niveles sin texto oficial
                      </StatusBadge>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-10 text-xs"
                      aria-expanded={abierto === i.id}
                      onClick={() => setAbierto((a) => (a === i.id ? null : i.id))}
                    >
                      {abierto === i.id ? "Ocultar" : "Ver contenido"}
                    </Button>
                    {esAdministrador && !i.vigente && (
                      <Button
                        type="button"
                        variant="outline"
                        className="min-h-10 gap-2"
                        disabled={marcar.isPending}
                        onClick={() => marcar.mutate(i.id)}
                      >
                        {marcar.isPending && marcar.variables === i.id && (
                          <Spinner className="size-4" />
                        )}
                        Marcar vigente
                      </Button>
                    )}
                  </div>
                </div>
                {abierto === i.id && (
                  <div className="space-y-3">
                    {i.contenido.desempenos.map((d) => (
                      <div key={d.numero} className="bg-muted/40 space-y-2 rounded-xl p-3 text-sm">
                        <p className="font-medium">
                          Desempeño {d.numero}: {d.nombre}
                        </p>
                        {d.niveles.map((n) => (
                          <div key={n.nivel}>
                            <p className="text-xs font-medium">
                              Nivel {NIVELES.find((x) => x.nivel === n.nivel)?.romano} · {n.nombre}
                            </p>
                            <DescripcionNivel descripcion={n.descripcion} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </PageState>
      <Modal
        open={nueva !== null}
        onOpenChange={(a) => !a && setNueva(null)}
        title="Nueva versión del instrumento"
        description="Parte de la versión vigente. Puede guardarla incompleta; solo una completa puede marcarse vigente."
        size="3xl"
      >
        {nueva && (
          <FormularioInstrumento base={nueva.base} onOpenChange={(a) => !a && setNueva(null)} />
        )}
      </Modal>
    </div>
  );
}
