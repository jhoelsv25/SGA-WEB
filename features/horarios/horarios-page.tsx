"use client";

import { useMemo, useState } from "react";
import { Calendar03Icon, Clock01Icon, School01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { useGradosQuery } from "@/features/grados";
import {
  AvisoSeccionCerrada,
  AvisosYAdvertencias,
  HorariosDialogsContainer,
  HorariosHeaderActions,
  ModalResumenHoras,
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
import { GrillaSemanal } from "./views";
import { ajustarHoraFinAlHueco } from "./utils";
import { descargarHorarioSeccionPdf } from "./api";
import { toast } from "@/lib/toast";

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

  const dialogs = useHorariosDialogs();
  const crearBloqueMutation = useCreateBloqueMutation();
  const deleteBloqueMutation = useDeleteBloqueMutation();

  const [modalHorasOpen, setModalHorasOpen] = useState(false);
  const [docenteFiltroId, setDocenteFiltroId] = useState<string | null>(null);

  const cargaItems = useMemo(() => cargaData?.items ?? [], [cargaData]);
  const bloquesHorario = useMemo(() => horarioData?.bloques ?? [], [horarioData]);
  const advertenciasPlan = useMemo(() => horarioData?.advertencias ?? [], [horarioData]);
  const resumenHoras = useMemo(() => horarioData?.resumenHoras ?? [], [horarioData]);
  const bloquesPropuestos = useMemo(
    () => (grillaPropuestaActiva ? (grillaPropuestaData?.bloques ?? []) : []),
    [grillaPropuestaActiva, grillaPropuestaData],
  );

  const docentesDeLaSeccion = useMemo(() => {
    const map = new Map<string, string>();
    cargaItems.forEach((item) => {
      if (item.docente) {
        map.set(item.docente.id, item.docente.nombreCompleto);
      }
    });
    return Array.from(map.entries())
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [cargaItems]);

  const totalesHoras = useMemo(() => {
    return resumenHoras.reduce(
      (acc, item) => {
        acc.horario += item.horasHorario;
        acc.plan += item.horasPlan;
        return acc;
      },
      { horario: 0, plan: 0 },
    );
  }, [resumenHoras]);

  const estaCuadrado = totalesHoras.horario === totalesHoras.plan && totalesHoras.plan > 0;

  const handleAsignarCursoASlot = async (
    diaSemana: number,
    horaInicio: string,
    horaFin: string,
    tipoBloque: "clase" | "receso",
    cursoSeccionId?: string | null,
  ) => {
    if (!seccionId) return;
    const horaFinAjustada = ajustarHoraFinAlHueco(diaSemana, horaInicio, horaFin, bloquesHorario);
    try {
      const res = await crearBloqueMutation.mutateAsync({
        seccionId,
        payload: {
          diaSemana,
          horaInicio,
          horaFin: horaFinAjustada,
          tipoBloque,
          cursoSeccionId: tipoBloque === "receso" ? null : (cursoSeccionId ?? null),
        },
      });
      if (res.mensaje) setMensajeVigencia(res.mensaje);
    } catch {
      // Notificado en toast
    }
  };

  const [exportandoPdf, setExportandoPdf] = useState(false);

  const handleExportarPdf = async () => {
    if (!seccionId) return;
    setExportandoPdf(true);
    try {
      const blob = await descargarHorarioSeccionPdf(seccionId, docenteFiltroId ?? undefined);
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `horario-seccion.pdf`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("No se pudo generar el PDF del horario.");
    } finally {
      setExportandoPdf(false);
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
            isExportandoPdf={exportandoPdf}
            grillaPropuestaActiva={grillaPropuestaActiva}
            onProponerGrilla={() => dialogs.setProponerModalOpen(true)}
            onDescartarPropuesta={() => setGrillaPropuestaActiva(false)}
            onCopiarHorario={() => dialogs.setCopiarModalOpen(true)}
            onExportarPdf={() => void handleExportarPdf()}
            onNuevoBloque={() => dialogs.abrirNuevoBloque(1, "", "", "clase", null)}
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
            setDocenteFiltroId(null);
          }}
          secciones={seccionesDelGrado}
          seccionSeleccionadaId={seccionId}
          onSelectSeccion={(sId) => {
            seleccionarSeccion(sId);
            setGrillaPropuestaActiva(false);
            setMensajeVigencia(null);
            setDocenteFiltroId(null);
          }}
          isLoadingSecciones={isLoadingSeccionesGrado}
          docentes={docentesDeLaSeccion}
          docenteSeleccionadoId={docenteFiltroId}
          onSelectDocente={(dId) => setDocenteFiltroId(dId)}
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
          <div className="space-y-4">
            {seccionCerrada && <AvisoSeccionCerrada />}

            {/* Mensaje de vigencia oficial sólo si existe */}
            {mensajeVigencia && (
              <AvisosYAdvertencias
                mensajeVigencia={mensajeVigencia}
                onDismissMensaje={() => setMensajeVigencia(null)}
              />
            )}

            {/* Barra compacta y limpia de Horas vs Plan */}
            {resumenHoras.length > 0 && (
              <div className="border-border/70 bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-2.5 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Clock01Icon} className="text-primary size-4" />
                    <span className="text-foreground text-xs font-semibold">Horas vs. Plan:</span>
                    <span className="text-muted-foreground text-xs font-medium">
                      {totalesHoras.horario} de {totalesHoras.plan} h planificadas
                    </span>
                  </div>
                  <StatusBadge tone={estaCuadrado ? "success" : "warning"} size="sm">
                    {estaCuadrado
                      ? "Cuadrado 100%"
                      : `${totalesHoras.plan - totalesHoras.horario} h pendientes`}
                  </StatusBadge>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalHorasOpen(true)}
                  className="h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold"
                >
                  <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                  <span>Ver Horas vs. Plan ({resumenHoras.length} asignaturas)</span>
                </Button>
              </div>
            )}

            {/* Modal de Detalle de Horas vs Plan de Estudios */}
            <ModalResumenHoras
              open={modalHorasOpen}
              onOpenChange={setModalHorasOpen}
              resumenHoras={resumenHoras}
              advertencias={advertenciasPlan}
              mensajeVigencia={mensajeVigencia}
            />

            {/* Grilla semanal de clases ocupando el 100% del ancho */}
            <section className="w-full min-w-0">
              <GrillaSemanal
                bloques={bloquesHorario}
                bloquesPropuestos={bloquesPropuestos}
                puedeGestionar={puedeGestionar}
                docenteFiltroNombre={
                  docentesDeLaSeccion.find((d) => d.id === docenteFiltroId)?.nombre
                }
                onAsignarCursoASlot={handleAsignarCursoASlot}
                onAbrirNuevoBloque={(d, ini, fin, tipo) => {
                  const horaFinAjustada =
                    ini && fin ? ajustarHoraFinAlHueco(d, ini, fin, bloquesHorario) : fin;
                  dialogs.abrirNuevoBloque(d, ini, horaFinAjustada, tipo, null);
                }}
                onEditarBloque={(b) => dialogs.abrirEditarBloque(b)}
                onEliminarBloque={(b) => dialogs.abrirEliminarBloque(b)}
                onProponerGrilla={() => dialogs.setProponerModalOpen(true)}
              />
            </section>
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
