"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCerrarNotas, useEditarNota, useRegistrarNota } from "../hooks";
import type { DesempenoInstrumento, Nota, Observacion } from "../types";
import { esConfirmacion, horaActual } from "../utils";
import { Campo, MensajeError } from "./campo";

interface PanelNotasProps {
  observacion: Observacion;
  desempenos: DesempenoInstrumento[];
  notas: Nota[];
}

function NotaItem({ observacionId, nota }: { observacionId: string; nota: Nota }) {
  const editar = useEditarNota();
  const [editando, setEditando] = React.useState(false);
  const [texto, setTexto] = React.useState(nota.texto);

  if (!editando) {
    return (
      <li className="border-border/70 bg-card flex items-start justify-between gap-3 rounded-xl border p-3 text-sm">
        <div className="min-w-0">
          <p className="break-words">{nota.texto}</p>
          {nota.horaAproximada && (
            <p className="text-muted-foreground mt-1 text-xs">
              Hacia las {nota.horaAproximada.slice(0, 5)}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="min-h-10 shrink-0 text-xs"
          onClick={() => setEditando(true)}
        >
          Editar
        </Button>
      </li>
    );
  }
  return (
    <li className="border-border/70 bg-card space-y-2 rounded-xl border p-3">
      <Textarea
        aria-label="Texto de la nota"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        maxLength={1000}
        disabled={editar.isPending}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          onClick={() => setEditando(false)}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          className="min-h-10 gap-2"
          disabled={editar.isPending || !texto.trim()}
          onClick={() =>
            editar.mutate(
              { id: observacionId, notaId: nota.id, texto: texto.trim() },
              { onSuccess: () => setEditando(false) },
            )
          }
        >
          {editar.isPending && <Spinner className="size-4" />}
          Guardar
        </Button>
      </div>
    </li>
  );
}

/** Ficha de toma de notas: conductas observables por desempeño, pensada para el celular. */
export function PanelNotas({ observacion, desempenos, notas }: PanelNotasProps) {
  const registrar = useRegistrarNota();
  const cerrar = useCerrarNotas();
  const [desempeno, setDesempeno] = React.useState<number>(desempenos[0]?.numero ?? 1);
  const [texto, setTexto] = React.useState("");
  const [hora, setHora] = React.useState("");
  const [horaFin, setHoraFin] = React.useState(horaActual);
  const [errorNota, setErrorNota] = React.useState<string>();
  const [aviso, setAviso] = React.useState<string | null>(null);

  const actual = desempenos.find((d) => d.numero === desempeno);
  const notasDelDesempeno = notas.filter((n) => n.desempeno === desempeno);

  const guardarNota = (event: React.FormEvent) => {
    event.preventDefault();
    if (!texto.trim()) {
      setErrorNota("Escriba la conducta observada. No se aceptan calificaciones en las notas.");
      return;
    }
    setErrorNota(undefined);
    registrar.mutate(
      { id: observacion.id, desempeno, texto: texto.trim(), horaAproximada: hora || undefined },
      {
        onSuccess: () => {
          setTexto("");
          setHora("");
        },
      },
    );
  };

  const cerrarNotas = (confirmarDuracion?: boolean) =>
    cerrar.mutate(
      { id: observacion.id, horaFin, confirmarDuracion },
      {
        onSuccess: () => setAviso(null),
        onError: (error) => {
          if (esConfirmacion(error)) setAviso(error.message);
        },
      },
    );

  return (
    <section aria-labelledby="titulo-notas" className="space-y-4">
      <div>
        <h2 id="titulo-notas" className="text-base font-semibold">
          Toma de notas
        </h2>
        <p className="text-muted-foreground text-sm">
          Anote conductas observables, sin calificar. La calificación se hace al cerrar la toma de
          notas.
        </p>
      </div>

      <div role="tablist" aria-label="Desempeño" className="flex flex-wrap gap-2">
        {desempenos.map((d) => {
          const cantidad = notas.filter((n) => n.desempeno === d.numero).length;
          return (
            <button
              key={d.numero}
              type="button"
              role="tab"
              aria-selected={d.numero === desempeno}
              onClick={() => setDesempeno(d.numero)}
              className={cn(
                "min-h-11 rounded-xl border px-3 text-sm font-medium transition-colors",
                d.numero === desempeno
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-muted",
              )}
            >
              D{d.numero}
              <span className="ml-1.5 text-xs opacity-80">({cantidad})</span>
            </button>
          );
        })}
      </div>

      {actual && (
        <div className="border-border/70 bg-muted/40 rounded-xl border p-3 text-sm">
          <p className="font-medium">
            Desempeño {actual.numero}: {actual.nombre}
          </p>
          {actual.aspectos.length > 0 && (
            <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-xs">
              {actual.aspectos.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={guardarNota} className="space-y-3" noValidate>
        <Campo id="nota-texto" etiqueta="Conducta observada" error={errorNota}>
          <Textarea
            id="nota-texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={1000}
            rows={4}
            disabled={registrar.isPending}
            aria-invalid={Boolean(errorNota)}
          />
        </Campo>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-36">
            <Campo id="nota-hora" etiqueta="Hora aprox. (opcional)">
              <Input
                id="nota-hora"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                disabled={registrar.isPending}
              />
            </Campo>
          </div>
          <Button type="submit" className="min-h-11 gap-2" disabled={registrar.isPending}>
            {registrar.isPending && <Spinner className="size-4" />}
            Agregar nota
          </Button>
        </div>
      </form>

      <ul className="space-y-2" aria-label={`Notas del desempeño ${desempeno}`}>
        {notasDelDesempeno.length === 0 && (
          <li className="text-muted-foreground text-sm">Aún no hay notas en este desempeño.</li>
        )}
        {notasDelDesempeno.map((nota) => (
          <NotaItem key={nota.id} observacionId={observacion.id} nota={nota} />
        ))}
      </ul>

      <div className="border-border/70 space-y-3 rounded-2xl border p-4">
        <h3 className="text-sm font-semibold">Cerrar la toma de notas</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-36">
            <Campo id="nota-hora-fin" etiqueta="Hora de fin">
              <Input
                id="nota-hora-fin"
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                disabled={cerrar.isPending}
              />
            </Campo>
          </div>
          <Button
            type="button"
            className="min-h-11 gap-2"
            disabled={cerrar.isPending || !horaFin}
            onClick={() => cerrarNotas()}
          >
            {cerrar.isPending && <Spinner className="size-4" />}
            Cerrar toma de notas
          </Button>
        </div>
        {cerrar.isError && !esConfirmacion(cerrar.error) && (
          <MensajeError>{cerrar.error.message}</MensajeError>
        )}
      </div>

      <ConfirmDialog
        open={aviso !== null}
        onOpenChange={(abierto) => !abierto && setAviso(null)}
        variant="warning"
        title="Duración fuera de lo habitual"
        description={aviso ?? ""}
        confirmText="Guardar de todos modos"
        cancelText="Corregir la hora"
        isLoading={cerrar.isPending}
        onConfirm={() => cerrarNotas(true)}
      />
    </section>
  );
}
