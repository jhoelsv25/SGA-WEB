"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  PlayIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ApiClientError } from "@/lib/api-client";
import { useResumenPromocionQuery } from "@/features/matriculas/hooks";
import type { ResumenSeccionPromocionItem } from "@/features/matriculas/types";
import { clonarSecciones, getSecciones } from "@/features/secciones/api";
import type { ClonarSeccionesResultado, Seccion } from "@/features/secciones/types";
import { ESTADO_ANIO, TONO_ESTADO_ANIO } from "./components/anio/estados";
import { PasoCierreAnio } from "./components/cierre/paso-cierre-anio";
import { PasoEgresoQuinto } from "./components/cierre/paso-egreso-quinto";
import { PasoPrepararAnio } from "./components/cierre/paso-preparar-anio";
import { PasoPromocionSecciones } from "./components/cierre/paso-promocion-secciones";
import { AnioModal } from "./components/modals/anio-modal";
import {
  useAniosQuery,
  useCerrarAnioMutation,
  useCerrarBimestreMutation,
  useEsAdministrador,
  useIniciarAnioMutation,
  useIniciarBimestreMutation,
} from "./hooks";

const PASOS = [
  { id: 1, titulo: "Cerrar año" },
  { id: 2, titulo: "Año nuevo y secciones" },
  { id: 3, titulo: "Promoción 1.° a 4.°" },
  { id: 4, titulo: "Egreso de 5.°" },
  { id: 5, titulo: "Iniciar nuevo año" },
] as const;

export function CierrePromocionPage() {
  const esAdmin = useEsAdministrador();
  const queryClient = useQueryClient();
  const { data: anios = [], isLoading, isError, error, refetch } = useAniosQuery(esAdmin);

  const iniciarBimestre = useIniciarBimestreMutation();
  const cerrarBimestre = useCerrarBimestreMutation();
  const cerrarAnio = useCerrarAnioMutation();
  const iniciarAnio = useIniciarAnioMutation();

  const [pasoActual, setPasoActual] = React.useState<number>(1);
  const [anioOrigenSeleccionadoId, setAnioOrigenSeleccionadoId] = React.useState<string>("");
  const [anioDestinoSeleccionadoId, setAnioDestinoSeleccionadoId] = React.useState<string>("");
  const [crearAnioAbierto, setCrearAnioAbierto] = React.useState(false);
  const [confirmarInicioAbierto, setConfirmarInicioAbierto] = React.useState(false);

  const anioOrigen = React.useMemo(() => {
    if (anios.length === 0) return null;
    if (anioOrigenSeleccionadoId) {
      const encontrado = anios.find((a) => a.id === anioOrigenSeleccionadoId);
      if (encontrado) return encontrado;
    }
    const enCurso = anios.find((a) => a.estado === "en_curso" || a.estado === "reabierto");
    const cerrado = anios.find((a) => a.estado === "cerrado");
    return enCurso ?? cerrado ?? anios[0] ?? null;
  }, [anios, anioOrigenSeleccionadoId]);

  const anioOrigenId = anioOrigen?.id ?? "";

  const aniosCandidatosDestino = React.useMemo(() => {
    if (!anioOrigen) return [];
    return anios.filter(
      (a) =>
        a.id !== anioOrigen.id &&
        a.anio > anioOrigen.anio &&
        (a.estado === "planificado" || a.estado === "en_curso"),
    );
  }, [anios, anioOrigen]);

  const anioDestino = React.useMemo(() => {
    if (aniosCandidatosDestino.length === 0) return null;
    if (anioDestinoSeleccionadoId) {
      const encontrado = aniosCandidatosDestino.find((a) => a.id === anioDestinoSeleccionadoId);
      if (encontrado) return encontrado;
    }
    return aniosCandidatosDestino[0] ?? null;
  }, [aniosCandidatosDestino, anioDestinoSeleccionadoId]);

  const anioDestinoId = anioDestino?.id ?? "";

  const seccionesOrigenQuery = useQuery<Seccion[], ApiClientError>({
    queryKey: ["secciones", "cierre-origen", anioOrigenId],
    queryFn: () => getSecciones({ estado: "activa" }, anioOrigenId),
    enabled: Boolean(esAdmin && anioOrigenId),
  });

  const seccionesDestinoQuery = useQuery<Seccion[], ApiClientError>({
    queryKey: ["secciones", "cierre-destino", anioDestinoId],
    queryFn: () => getSecciones({ estado: "activa" }, anioDestinoId),
    enabled: Boolean(esAdmin && anioDestinoId),
  });

  const resumenQuery = useResumenPromocionQuery(
    anioOrigen?.estado === "cerrado" ? anioOrigenId : "",
    anioDestinoId || undefined,
  );

  const resumenPorSeccion = React.useMemo(() => {
    const mapa = new Map<string, ResumenSeccionPromocionItem>();
    for (const item of resumenQuery.data?.secciones ?? []) {
      mapa.set(item.seccionId, item);
    }
    return mapa;
  }, [resumenQuery.data]);

  const clonarMutation = useMutation<
    ClonarSeccionesResultado,
    ApiClientError,
    { copiarTutores: boolean; copiarAulas: boolean }
  >({
    mutationFn: (opciones) =>
      clonarSecciones(
        {
          anioOrigenId,
          copiarAulas: opciones.copiarAulas,
          copiarTutores: opciones.copiarTutores,
        },
        anioDestinoId,
      ),
    onSuccess: (res) => {
      toast.success(res.mensaje);
      queryClient.invalidateQueries({ queryKey: ["secciones"] });
    },
    onError: (err) => {
      toast.error(err.message || "No se pudieron clonar las secciones.");
    },
  });

  const opcionesOrigen: SelectOptionItem<string>[] = React.useMemo(
    () =>
      anios.map((a) => ({
        value: a.id,
        label: `Año ${a.anio}${a.nombre ? ` — ${a.nombre}` : ""}`,
        description: `Estado: ${ESTADO_ANIO[a.estado]}`,
      })),
    [anios],
  );

  if (!esAdmin) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Cierre y promoción anual"
          description="Esta operación está reservada al administrador del colegio."
          icon={Calendar03Icon}
        />
        <Card>
          <CardContent className="text-muted-foreground py-8 text-sm">
            Solicite al administrador realizar el cierre del año y la promoción de estudiantes.
          </CardContent>
        </Card>
      </div>
    );
  }

  const origenCerrado = anioOrigen?.estado === "cerrado";
  const seccionesOrigen = seccionesOrigenQuery.data ?? [];
  const seccionesDestino = seccionesDestinoQuery.data ?? [];
  const puedePromover = Boolean(origenCerrado && anioDestino && seccionesDestino.length > 0);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Cierre de año y promoción"
        description="Asistente guiado para cerrar bimestres y año académico, clonar secciones, promover estudiantes de 1.° a 4.° y egresar 5.° grado."
        icon={RefreshIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Año académico", href: "/admin/academic-years" },
          { label: "Cierre y promoción" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/academic-years">Volver a Año académico</Link>
          </Button>
        }
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar los años académicos"
        isEmpty={anios.length === 0}
        empty={{
          icon: Calendar03Icon,
          title: "No hay años académicos registrados",
          description: "Cree primero un año académico para poder gestionarlo.",
          action: (
            <Button asChild>
              <Link href="/admin/academic-years">Ir a Año académico</Link>
            </Button>
          ),
        }}
      >
        <div className="flex flex-col gap-5">
          {/* Selector de año de origen + barra de pasos */}
          <Card>
            <CardContent className="flex flex-col gap-4 pt-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="w-full sm:w-72">
                  <Label className="mb-1.5 block text-xs font-semibold">
                    Año académico que se cierra (origen)
                  </Label>
                  <SelectOption
                    options={opcionesOrigen}
                    value={anioOrigenId}
                    onSelect={(val) => {
                      setAnioOrigenSeleccionadoId(val);
                      setAnioDestinoSeleccionadoId("");
                      setPasoActual(1);
                    }}
                    placeholder="Seleccione el año a cerrar..."
                    searchPlaceholder="Buscar año..."
                    className="h-10 text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {anioOrigen ? (
                    <StatusBadge tone={TONO_ESTADO_ANIO[anioOrigen.estado]}>
                      Origen: {anioOrigen.anio} ({ESTADO_ANIO[anioOrigen.estado]})
                    </StatusBadge>
                  ) : null}
                  {anioDestino ? (
                    <StatusBadge tone={TONO_ESTADO_ANIO[anioDestino.estado]}>
                      Destino: {anioDestino.anio} ({ESTADO_ANIO[anioDestino.estado]})
                    </StatusBadge>
                  ) : null}
                </div>
              </div>

              <ol className="grid gap-2 sm:grid-cols-5">
                {PASOS.map((paso) => {
                  const activo = pasoActual === paso.id;
                  const bloqueado =
                    (paso.id === 3 && !puedePromover) || (paso.id === 4 && !origenCerrado);
                  const completado =
                    (paso.id === 1 && Boolean(origenCerrado)) ||
                    (paso.id === 2 && Boolean(anioDestino && seccionesDestino.length > 0)) ||
                    (paso.id === 5 && anioDestino?.estado === "en_curso");

                  return (
                    <li key={paso.id}>
                      <button
                        type="button"
                        disabled={bloqueado}
                        onClick={() => setPasoActual(paso.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-colors",
                          activo && "border-primary bg-primary/10 text-primary font-semibold",
                          !activo && !bloqueado && "hover:bg-muted/50",
                          bloqueado && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                            completado
                              ? "bg-emerald-600 text-white"
                              : activo
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {completado ? "✓" : paso.id}
                        </span>
                        <span className="truncate">{paso.titulo}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {origenCerrado && resumenQuery.data ? (
                <div className="grid grid-cols-2 gap-2 border-t pt-3 text-xs sm:grid-cols-4">
                  <div className="bg-muted/30 rounded-lg border px-3 py-2">
                    <p className="text-muted-foreground">Culminados ({anioOrigen?.anio})</p>
                    <p className="text-base font-bold">{resumenQuery.data.totalCulminados}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg border px-3 py-2">
                    <p className="text-muted-foreground">
                      Matriculados ({anioDestino?.anio ?? "—"})
                    </p>
                    <p className="text-base font-bold text-emerald-600">
                      {resumenQuery.data.totalMatriculadosDestino}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg border px-3 py-2">
                    <p className="text-muted-foreground">Egresados (5.°)</p>
                    <p className="text-primary text-base font-bold">
                      {resumenQuery.data.totalEgresados}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg border px-3 py-2">
                    <p className="text-muted-foreground">Pendientes</p>
                    <p
                      className={
                        resumenQuery.data.totalPendientes > 0
                          ? "text-base font-bold text-amber-600"
                          : "text-base font-bold text-emerald-600"
                      }
                    >
                      {resumenQuery.data.totalPendientes}
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Contenido del paso activo */}
          {pasoActual === 1 ? (
            <PasoCierreAnio
              anioOrigen={anioOrigen}
              iniciandoBimestre={iniciarBimestre.isPending}
              cerrandoBimestre={cerrarBimestre.isPending}
              cerrandoAnio={cerrarAnio.isPending}
              onIniciarBimestre={(anioId, bimestreId) =>
                iniciarBimestre.mutate({ anioId, bimestreId })
              }
              onCerrarBimestre={(anioId, bimestreId) =>
                cerrarBimestre.mutate({ anioId, bimestreId })
              }
              onCerrarAnio={(anioId) => cerrarAnio.mutate(anioId)}
              onContinuar={() => setPasoActual(2)}
            />
          ) : null}

          {pasoActual === 2 && anioOrigen ? (
            <PasoPrepararAnio
              anioOrigen={anioOrigen}
              aniosCandidatosDestino={aniosCandidatosDestino}
              anioDestinoId={anioDestinoId}
              onSelectAnioDestino={setAnioDestinoSeleccionadoId}
              onAbrirCrearAnio={() => setCrearAnioAbierto(true)}
              seccionesOrigen={seccionesOrigen}
              seccionesDestino={seccionesDestino}
              cargandoSeccionesDestino={seccionesDestinoQuery.isLoading}
              clonando={clonarMutation.isPending}
              onClonarSecciones={(opts) => clonarMutation.mutate(opts)}
              onContinuar={() => setPasoActual(3)}
            />
          ) : null}

          {pasoActual === 3 && anioOrigen && anioDestino ? (
            <PasoPromocionSecciones
              anioOrigenNumero={anioOrigen.anio}
              anioDestinoNumero={anioDestino.anio}
              seccionesOrigen={seccionesOrigen}
              seccionesDestino={seccionesDestino}
              resumenPorSeccion={resumenPorSeccion}
              onRefreshSecciones={() => {
                void seccionesDestinoQuery.refetch();
                void resumenQuery.refetch();
              }}
              onContinuar={() => setPasoActual(4)}
            />
          ) : null}

          {pasoActual === 4 && anioOrigen ? (
            <PasoEgresoQuinto
              anioOrigenNumero={anioOrigen.anio}
              anioDestinoNumero={anioDestino?.anio}
              seccionesOrigen={seccionesOrigen}
              seccionesDestino={seccionesDestino}
              resumenPorSeccion={resumenPorSeccion}
              onRefreshSecciones={() => {
                void seccionesDestinoQuery.refetch();
                void resumenQuery.refetch();
              }}
              onContinuar={() => setPasoActual(5)}
            />
          ) : null}

          {pasoActual === 5 ? (
            <Card>
              <CardHeader>
                <CardTitle>Paso 5: Iniciar el nuevo año académico</CardTitle>
                <CardDescription>
                  Una vez promovidos los estudiantes de 1.° a 4.° y egresados los de 5.°, active el
                  nuevo año escolar para que sea el año operativo por defecto.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {anioDestino ? (
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold">Año {anioDestino.anio}</span>
                        <StatusBadge tone={TONO_ESTADO_ANIO[anioDestino.estado]}>
                          {ESTADO_ANIO[anioDestino.estado]}
                        </StatusBadge>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {seccionesDestino.length} secciones configuradas ·{" "}
                        {seccionesDestino.reduce((acc, s) => acc + s.matriculados, 0)} estudiantes
                        matriculados
                      </span>
                    </div>

                    {anioDestino.estado === "planificado" ? (
                      <Button
                        disabled={iniciarAnio.isPending}
                        onClick={() => setConfirmarInicioAbierto(true)}
                        className="gap-1.5"
                      >
                        <HugeiconsIcon icon={PlayIcon} className="size-4" />
                        {iniciarAnio.isPending ? "Iniciando..." : `Iniciar Año ${anioDestino.anio}`}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
                        <span>El año {anioDestino.anio} ya está en curso</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Seleccione un año destino en el Paso 2 para poder iniciarlo aquí.
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/enrollment">Ir a Matrículas (ingresantes y repitentes)</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/secciones">Ir a Secciones</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </PageState>

      <AnioModal open={crearAnioAbierto} onOpenChange={setCrearAnioAbierto} />

      <ConfirmDialog
        open={confirmarInicioAbierto}
        onOpenChange={setConfirmarInicioAbierto}
        title={anioDestino ? `Iniciar Año Académico ${anioDestino.anio}` : "Iniciar Año Académico"}
        description="El año pasará a estado en curso y será el año lectivo predeterminado en todas las pantallas del sistema."
        variant="info"
        confirmText="Iniciar año"
        onConfirm={() => {
          if (anioDestino) iniciarAnio.mutate(anioDestino.id);
        }}
      />
    </div>
  );
}
