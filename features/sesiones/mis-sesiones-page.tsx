"use client";

import * as React from "react";
import { BookOpen01Icon, FileEditIcon } from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectorBimestre, useRangoBimestre } from "@/features/asistencia/components";
import { ModalTexto, getMisSesionesColumns } from "./components";
import { useCorregirTema, useMisSesiones, useSolicitarJustificacion } from "./hooks";
import type { Sesion } from "./types";

type Accion = { tipo: "tema" | "justificar"; sesion: Sesion } | null;

function Total({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
      <p className="text-muted-foreground text-xs font-medium">{etiqueta}</p>
      <p className="text-2xl font-extrabold tabular-nums">{valor}</p>
    </div>
  );
}

export function MisSesionesPage() {
  const { bimestres, bimestreId, setElegido, rango } = useRangoBimestre();
  const { data, isLoading, isError, error, refetch } = useMisSesiones(rango);
  const [accion, setAccion] = React.useState<Accion>(null);
  const tema = useCorregirTema();
  const justificar = useSolicitarJustificacion();
  const cerrar = () => setAccion(null);

  const handleCorregirTema = React.useCallback((sesion: Sesion) => {
    setAccion({ tipo: "tema", sesion });
  }, []);

  const handleSolicitarJustificacion = React.useCallback((sesion: Sesion) => {
    setAccion({ tipo: "justificar", sesion });
  }, []);

  const columns = React.useMemo(
    () =>
      getMisSesionesColumns({
        onCorregirTema: handleCorregirTema,
        onSolicitarJustificacion: handleSolicitarJustificacion,
      }),
    [handleCorregirTema, handleSolicitarJustificacion],
  );

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Mis sesiones"
        description="Historial de sus sesiones con tema, horas firmadas, estado y minutos perdidos."
        icon={BookOpen01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mis sesiones" }]}
      />
      <SelectorBimestre bimestres={bimestres} valor={bimestreId} onCambiar={setElegido} />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar sus sesiones"
      >
        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Total etiqueta="Cumplidas" valor={data.totales.cumplidas} />
              <Total etiqueta="Parciales" valor={data.totales.parciales} />
              <Total etiqueta="No cumplidas" valor={data.totales.noCumplidas} />
              <Total etiqueta="Justificadas" valor={data.totales.justificadas} />
            </div>

            <DataTable
              columns={columns}
              data={data.sesiones}
              pagination={false}
              emptyState={{
                title: "Sin sesiones en este periodo",
                description: "Elija otro bimestre para ver su historial.",
              }}
            />
          </div>
        )}
      </PageState>

      <ModalTexto
        abierto={accion?.tipo === "tema"}
        clave={`tema-${accion?.sesion.id ?? ""}`}
        onOpenChange={(abierto) => !abierto && cerrar()}
        titulo="Corregir tema"
        descripcion={
          accion ? `${accion.sesion.cursoNombre} · ${accion.sesion.seccionNombre}` : undefined
        }
        icono={FileEditIcon}
        etiqueta="Tema"
        placeholder="Ej. Ecuaciones cuadráticas"
        mensajeRequerido="Ingrese el tema de la sesión para firmar el ingreso."
        textoInicial={accion?.sesion.tema ?? ""}
        textoBoton="Guardar tema"
        pendiente={tema.isPending}
        onEnviar={({ texto }) =>
          accion && tema.mutate({ id: accion.sesion.id, tema: texto }, { onSuccess: cerrar })
        }
      />
      <ModalTexto
        abierto={accion?.tipo === "justificar"}
        clave={`justificar-${accion?.sesion.id ?? ""}`}
        onOpenChange={(abierto) => !abierto && cerrar()}
        titulo="Solicitar justificación"
        descripcion="La revisa el subdirector."
        icono={FileEditIcon}
        etiqueta="Motivo"
        placeholder="Ej. Descanso médico"
        mensajeRequerido="Indique el motivo de la justificación."
        conEnlace
        textoBoton="Enviar justificación"
        pendiente={justificar.isPending}
        onEnviar={({ texto, enlace }) =>
          accion &&
          justificar.mutate(
            { id: accion.sesion.id, motivo: texto, documentoUrl: enlace },
            { onSuccess: cerrar },
          )
        }
      />
    </div>
  );
}
