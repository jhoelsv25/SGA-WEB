"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { ListaFaltan, JustificarMarcacionModal, TablaMarcaron } from "./components";
import { usePanelMarcacionesHoy, usePuedeJustificarMarcaciones } from "./hooks";
import type { GrupoPanel, MarcacionApi } from "./types";

type Pestana = "estudiantes" | "personal";

const PESTANAS: { id: Pestana; label: string }[] = [
  { id: "estudiantes", label: "Estudiantes" },
  { id: "personal", label: "Personal" },
];

function Resumen({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
      <p className="text-muted-foreground text-xs font-medium">{etiqueta}</p>
      <p className="text-2xl font-extrabold tabular-nums">{valor}</p>
    </div>
  );
}

function ContenidoGrupo({
  grupo,
  puedeJustificar,
  onJustificar,
}: {
  grupo: GrupoPanel;
  puedeJustificar: boolean;
  onJustificar: (m: MarcacionApi) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Resumen etiqueta="Marcaciones de hoy" valor={grupo.marcaron.length} />
        <Resumen etiqueta="Tardanzas" valor={grupo.totalTardanzas} />
        <Resumen etiqueta="Aún no marcan" valor={grupo.faltan.length} />
      </div>

      <section aria-labelledby="titulo-marcaron" className="space-y-2">
        <h2 id="titulo-marcaron" className="text-base font-bold">
          Quién marcó
        </h2>
        {grupo.marcaron.length === 0 ? (
          <EmptyState
            title="Aún no hay marcaciones"
            description="Las marcaciones aparecerán aquí en cuanto se registren."
            icon={Clock01Icon}
          />
        ) : (
          <TablaMarcaron
            marcaciones={grupo.marcaron}
            puedeJustificar={puedeJustificar}
            onJustificar={onJustificar}
          />
        )}
      </section>

      <section aria-labelledby="titulo-faltan" className="space-y-2">
        <h2 id="titulo-faltan" className="text-base font-bold">
          Aún no han marcado
        </h2>
        {grupo.faltan.length === 0 ? (
          <p className="text-muted-foreground text-sm">Todos marcaron su entrada.</p>
        ) : (
          <ListaFaltan pendientes={grupo.faltan} />
        )}
      </section>
    </div>
  );
}

export function MarcacionesHoyPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePanelMarcacionesHoy();
  const puedeJustificar = usePuedeJustificarMarcaciones();
  const [pestana, setPestana] = React.useState<Pestana>("estudiantes");
  const [aJustificar, setAJustificar] = React.useState<MarcacionApi | null>(null);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Marcaciones de hoy"
        description="Quién marcó, a qué hora y con qué resultado. Se actualiza solo cada 30 segundos."
        icon={Clock01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Marcaciones de hoy" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Actualizar marcaciones"
            className="h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        }
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el panel"
      >
        {data && (
          <div className="space-y-5">
            {!data.diaConClases && (
              <p
                role="status"
                className="border-warning/30 bg-warning/10 rounded-xl border p-3 text-sm"
              >
                Hoy no es un día con clases: las marcaciones se registran como fuera de turno.
              </p>
            )}
            <div
              role="tablist"
              aria-label="Tipo de persona"
              className="bg-muted/60 inline-flex rounded-xl p-1 text-sm"
            >
              {PESTANAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={pestana === p.id}
                  onClick={() => setPestana(p.id)}
                  className={`min-h-10 rounded-lg px-4 font-semibold transition-all ${
                    pestana === p.id
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <ContenidoGrupo
              grupo={data[pestana]}
              puedeJustificar={puedeJustificar}
              onJustificar={setAJustificar}
            />
          </div>
        )}
      </PageState>

      <JustificarMarcacionModal
        marcacion={aJustificar}
        onOpenChange={(abierto) => !abierto && setAJustificar(null)}
      />
    </div>
  );
}
