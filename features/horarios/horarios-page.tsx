"use client";

import { useMemo, useState } from "react";
import { Calendar03Icon, School01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { useGradosQuery } from "@/features/grados";
import {
  AvisoSeccionCerrada,
  AvisosYAdvertencias,
  HorariosDialogsContainer,
  HorariosHeaderActions,
  ListaCursosCarga,
  ResumenHorasPanel,
  SelectorGradoSeccion,
} from "./components";
import {
  useCargaSeccionQuery,
  useCreateBloqueMutation,
  useDeleteBloqueMutation,
  useGrillaPropuestaQuery,
  useHorarioSeccionQuery,
  useHorariosDialogs,
  useHorariosSeleccion,
  usePuedeGestionarHorarios,
} from "./hooks";
import type { CargaItemHorario } from "./types";
import { GrillaSemanal } from "./views";

export function HorariosPage() {
  const permisoGestionar = usePuedeGestionarHorarios();

  // 1. Cargar grados escolares
  const {
    data: grados = [],
    isLoading: isLoadingGrados,
    isError: isErrorGrados,
    refetch: refetchGrados,
  } = useGradosQuery();

  // Hook de selección sincronizada de grado y sección
  const {
    gradoId,
    seccionesDelGrado,
    isLoadingSeccionesGrado,
    isErrorSecciones,
    seccionId,
    seccionActual,
    seccionesMismoGrado,
    seleccionarGrado,
    seleccionarSeccion,
  } = useHorariosSeleccion(grados);

  const seccionCerrada = seccionActual?.estado === "cerrada";
  const puedeGestionar = permisoGestionar && !seccionCerrada;
  // 3. Cargar horario de la sección seleccionada
  const {
    data: horarioData,
    isLoading: isLoadingHorario,
    isError: isErrorHorario,
    error: errorHorario,
    refetch: refetchHorario,
  } = useHorarioSeccionQuery(seccionId);

  // 4. Cargar carga académica de la sección
  const { data: cargaData, isLoading: isLoadingCarga } = useCargaSeccionQuery(seccionId);

  const [horaEntradaGrilla, setHoraEntradaGrilla] = useState<string | undefined>(undefined);
  const [grillaPropuestaActiva, setGrillaPropuestaActiva] = useState(false);

  const { data: grillaPropuestaData, isLoading: isLoadingPropuesta } = useGrillaPropuestaQuery(
    seccionId,
    horaEntradaGrilla,
    grillaPropuestaActiva,
  );

  const [mensajeVigencia, setMensajeVigencia] = useState<string | null>(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CargaItemHorario | null>(null);

  const dialogs = useHorariosDialogs();
  const crearBloqueMutation = useCreateBloqueMutation();
  const deleteBloqueMutation = useDeleteBloqueMutation();

  const cargaItems = useMemo(() => cargaData?.items ?? [], [cargaData]);
  const bloquesHorario = useMemo(() => horarioData?.bloques ?? [], [horarioData]);
  const advertenciasPlan = useMemo(() => horarioData?.advertencias ?? [], [horarioData]);
  const resumenHoras = useMemo(() => horarioData?.resumenHoras ?? [], [horarioData]);
  const bloquesPropuestos = useMemo(
    () => (grillaPropuestaActiva ? (grillaPropuestaData?.bloques ?? []) : []),
    [grillaPropuestaActiva, grillaPropuestaData],
  );

  const handleAsignarCursoASlot = async (
    diaSemana: number,
    horaInicio: string,
    horaFin: string,
    tipoBloque: "clase" | "receso",
    cursoSeccionId?: string | null,
  ) => {
    if (!seccionId) return;
    try {
      const res = await crearBloqueMutation.mutateAsync({
        seccionId,
        payload: {
          diaSemana,
          horaInicio,
          horaFin,
          tipoBloque,
          cursoSeccionId: tipoBloque === "receso" ? null : (cursoSeccionId ?? null),
        },
      });
      if (res.mensaje) setMensajeVigencia(res.mensaje);
      setCursoSeleccionado(null);
    } catch {
      // Notificado en toast
    }
  };

  const handleConfirmarEliminacion = async () => {
    if (!dialogs.bloqueAEliminar || !seccionId) return;
    try {
      await deleteBloqueMutation.mutateAsync({
        id: dialogs.bloqueAEliminar.id,
        seccionId,
      });
      dialogs.setEliminarDialogOpen(false);
      dialogs.setBloqueAEliminar(null);
    } catch {
      // Notificado en toast
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Horarios"
        description="Planificación de bloques y grilla semanal por sección escolar"
        icon={Calendar03Icon}
        actions={
          <HorariosHeaderActions
            puedeGestionar={puedeGestionar}
            seccionId={seccionId}
            seccionesMismoGradoCount={seccionesMismoGrado.length}
            isLoadingPropuesta={isLoadingPropuesta}
            onProponerGrilla={() => dialogs.setProponerModalOpen(true)}
            onCopiarHorario={() => dialogs.setCopiarModalOpen(true)}
            onNuevoBloque={() =>
              dialogs.abrirNuevoBloque(1, "", "", "clase", cursoSeleccionado?.id)
            }
          />
        }
      />

      <div className="border-border/80 bg-card rounded-xl border p-4 shadow-sm">
        <SelectorGradoSeccion
          grados={grados}
          gradoSeleccionadoId={gradoId}
          onSelectGrado={(gId) => {
            seleccionarGrado(gId);
            setGrillaPropuestaActiva(false);
            setMensajeVigencia(null);
          }}
          secciones={seccionesDelGrado}
          seccionSeleccionadaId={seccionId}
          onSelectSeccion={(sId) => {
            seleccionarSeccion(sId);
            setGrillaPropuestaActiva(false);
            setMensajeVigencia(null);
          }}
          isLoadingSecciones={isLoadingSeccionesGrado}
        />
      </div>

      <PageState
        isLoading={isLoadingGrados || (Boolean(seccionId) && (isLoadingHorario || isLoadingCarga))}
        isError={isErrorGrados || isErrorSecciones || isErrorHorario}
        error={errorHorario}
        onRetry={() => {
          refetchGrados();
          refetchHorario();
        }}
        errorTitle="Error al cargar la información del horario"
        isEmpty={!seccionId}
        empty={{
          title: "Selecciona una sección escolar",
          description:
            "Elige un grado y una sección en los selectores superiores para visualizar y gestionar el horario de clases.",
          icon: School01Icon,
        }}
      >
        {seccionId && (
          <div className="space-y-6">
            {seccionCerrada && <AvisoSeccionCerrada />}
            <AvisosYAdvertencias
              mensajeVigencia={mensajeVigencia}
              advertencias={advertenciasPlan}
              onDismissMensaje={() => setMensajeVigencia(null)}
            />

            <ResumenHorasPanel resumenHoras={resumenHoras} />

            <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
              <aside className="space-y-4">
                <ListaCursosCarga
                  cargaItems={cargaItems}
                  cursoSeleccionado={cursoSeleccionado}
                  onSelectCurso={(c) => setCursoSeleccionado(c)}
                  puedeGestionar={puedeGestionar}
                />
              </aside>

              <section className="min-w-0">
                <GrillaSemanal
                  bloques={bloquesHorario}
                  bloquesPropuestos={bloquesPropuestos}
                  puedeGestionar={puedeGestionar}
                  cursoSeleccionado={cursoSeleccionado}
                  onAsignarCursoASlot={handleAsignarCursoASlot}
                  onAbrirNuevoBloque={(d, ini, fin, tipo) =>
                    dialogs.abrirNuevoBloque(d, ini, fin, tipo, cursoSeleccionado?.id)
                  }
                  onEditarBloque={(b) => dialogs.abrirEditarBloque(b)}
                  onEliminarBloque={(b) => dialogs.abrirEliminarBloque(b)}
                  onProponerGrilla={() => dialogs.setProponerModalOpen(true)}
                />
              </section>
            </div>
          </div>
        )}
      </PageState>

      <HorariosDialogsContainer
        seccionId={seccionId}
        seccionActual={seccionActual}
        seccionesMismoGrado={seccionesMismoGrado}
        cargaItems={cargaItems}
        dialogs={dialogs}
        isLoadingPropuesta={isLoadingPropuesta}
        onEjecutarPropuestaGrilla={(hora) => {
          setHoraEntradaGrilla(hora);
          setGrillaPropuestaActiva(true);
        }}
        onConfirmarEliminacion={handleConfirmarEliminacion}
        isDeleting={deleteBloqueMutation.isPending}
        onMensajeVigencia={(msj) => setMensajeVigencia(msj)}
      />
    </div>
  );
}
