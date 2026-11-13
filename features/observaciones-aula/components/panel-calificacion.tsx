"use client";

import * as React from "react";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { NIVELES } from "../consts";
import { useCalificarDesempeno, useCerrarCalificacion, useFichaCalificacion } from "../hooks";
import type { DesempenoFicha, Nivel, Observacion } from "../types";
import { Campo } from "./campo";
import { DescripcionNivel } from "./resumen-niveles";

function FilaDesempeno({
  observacionId,
  desempeno,
}: {
  observacionId: string;
  desempeno: DesempenoFicha;
}) {
  const calificar = useCalificarDesempeno();
  const [nivel, setNivel] = React.useState<Nivel | undefined>(desempeno.calificacion?.nivel);
  const [fundamento, setFundamento] = React.useState(desempeno.calificacion?.fundamento ?? "");
  const [error, setError] = React.useState<string>();
  const [advertencia, setAdvertencia] = React.useState<string | null>(null);
  const idBase = `calif-${desempeno.numero}`;
  const descripcion = desempeno.niveles.find((n) => n.nivel === nivel)?.descripcion;

  const guardar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nivel) {
      setError("Elija el nivel (I, II, III o IV).");
      return;
    }
    if (!fundamento.trim()) {
      setError("Explique el fundamento del nivel con base en las notas.");
      return;
    }
    setError(undefined);
    calificar.mutate(
      { id: observacionId, desempeno: desempeno.numero, nivel, fundamento: fundamento.trim() },
      {
        onSuccess: (resultado) => {
          const texto = (resultado as { advertencia?: string | null }).advertencia;
          setAdvertencia(texto ?? null);
        },
      },
    );
  };

  return (
    <li className="border-border/70 bg-card rounded-2xl border p-4">
      <form onSubmit={guardar} className="space-y-3" noValidate>
        <div>
          <h3 className="text-sm font-semibold">
            Desempeño {desempeno.numero}: {desempeno.nombre}
          </h3>
          {desempeno.calificacion && (
            <p className="text-success-text text-xs font-medium">
              Guardado: nivel {desempeno.calificacion.nivelRomano}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">Notas tomadas</p>
          {desempeno.notas.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No hay notas en este desempeño; igual debe escribir el fundamento.
            </p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {desempeno.notas.map((n) => (
                <li key={n.id}>{n.texto}</li>
              ))}
            </ul>
          )}
        </div>

        <div
          role="radiogroup"
          aria-label={`Nivel del desempeño ${desempeno.numero}`}
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {NIVELES.map((n) => (
            <button
              key={n.nivel}
              type="button"
              role="radio"
              aria-checked={nivel === n.nivel}
              onClick={() => setNivel(n.nivel)}
              disabled={calificar.isPending}
              className={cn(
                "min-h-11 rounded-xl border px-2 py-1.5 text-center text-sm transition-colors",
                nivel === n.nivel
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              <span className="block font-semibold">{n.romano}</span>
              <span className="block text-[11px] opacity-80">{n.nombre}</span>
            </button>
          ))}
        </div>
        {nivel && <DescripcionNivel descripcion={descripcion} />}

        <Campo id={`${idBase}-fundamento`} etiqueta="Fundamento *" error={error}>
          <Textarea
            id={`${idBase}-fundamento`}
            value={fundamento}
            onChange={(e) => setFundamento(e.target.value)}
            maxLength={1000}
            rows={3}
            disabled={calificar.isPending}
            aria-invalid={Boolean(error)}
          />
        </Campo>
        {advertencia && (
          <p
            role="note"
            className="border-warning/30 bg-warning/10 rounded-xl border p-2.5 text-xs"
          >
            {advertencia}
          </p>
        )}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="outline"
            className="min-h-10 gap-2"
            disabled={calificar.isPending}
          >
            {calificar.isPending && <Spinner className="size-4" />}
            Guardar desempeño
          </Button>
        </div>
      </form>
    </li>
  );
}

/** Calificación por desempeño (niveles I a IV) con fundamento; se cierra cuando están los cinco. */
export function PanelCalificacion({ observacion }: { observacion: Observacion }) {
  const { data, isLoading, isError, error, refetch } = useFichaCalificacion(observacion.id, true);
  const cerrar = useCerrarCalificacion();
  const guardados = data?.desempenos.filter((d) => d.calificacion).length ?? 0;
  const total = data?.desempenos.length ?? 5;

  return (
    <section aria-labelledby="titulo-calificacion" className="space-y-4">
      <div>
        <h2 id="titulo-calificacion" className="text-base font-semibold">
          Calificación
        </h2>
        <p className="text-muted-foreground text-sm">
          Elija el nivel de cada desempeño y explique el fundamento con base en las notas. No hay
          nota global.
        </p>
      </div>
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
      >
        <ul className="space-y-3">
          {data?.desempenos.map((d) => (
            <FilaDesempeno key={d.numero} observacionId={observacion.id} desempeno={d} />
          ))}
        </ul>
        <div className="border-border/70 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
          <p className="text-sm">
            {guardados} de {total} desempeños calificados
          </p>
          <Button
            type="button"
            className="min-h-11 gap-2"
            disabled={cerrar.isPending || guardados < total}
            onClick={() => cerrar.mutate(observacion.id)}
          >
            {cerrar.isPending && <Spinner className="size-4" />}
            Cerrar calificación
          </Button>
        </div>
      </PageState>
    </section>
  );
}
