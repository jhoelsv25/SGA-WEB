"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Download01Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { formatDate } from "@/lib/formatters/date";
import { toast } from "@/lib/toast";
import { descargarFichaPdf } from "../api";
import {
  DECISIONES_CONSOLIDADO_CONFIG,
  ESTADOS_CONSOLIDADO_CONFIG,
  ESTADOS_SOLICITUD_CONFIG,
} from "../consts";
import { useMiSeguimientoQuery } from "../hooks";
import { getDetalleSesionesColumns } from "../views/columns";
import { HorasPedagogicasCards } from "./metricas/horas-pedagogicas-cards";
import { ModalSolicitarRevision } from "./modals";

export function MiSeguimientoVista() {
  const searchParams = useSearchParams();
  const periodoUrl = searchParams.get("periodoId") ?? "";
  const { anio } = useAnioLectivo();
  const bimestres = anio?.bimestres ?? [];
  const primerBimestreId = bimestres[0]?.id ?? "";
  const [periodoSeleccionado, setPeriodoSeleccionado] = React.useState<string>("");
  const [descargandoPdf, setDescargandoPdf] = React.useState(false);
  const [abrirSolicitud, setAbrirSolicitud] = React.useState(false);

  const periodoActivo = periodoSeleccionado || periodoUrl || primerBimestreId;

  const { data, isLoading } = useMiSeguimientoQuery(periodoActivo, Boolean(periodoActivo));

  const consolidado = data?.consolidado;
  const sesiones = data?.sesiones ?? [];
  const solicitudPendiente = data?.solicitudPendiente;
  const periodoActual = bimestres.find((b) => b.id === periodoActivo);

  const sesionesColumns = React.useMemo(() => getDetalleSesionesColumns(), []);

  const handleDescargarPdf = async () => {
    if (!consolidado) return;
    try {
      setDescargandoPdf(true);
      await descargarFichaPdf(consolidado.id);
      toast.success("Ficha descargada en PDF.");
    } catch {
      toast.error("Error al descargar la ficha.");
    } finally {
      setDescargandoPdf(false);
    }
  };

  const tasa =
    consolidado && consolidado.sesionesProgramadas > 0
      ? Math.round(
          ((consolidado.sesionesCumplidas + consolidado.sesionesJustificadas) /
            consolidado.sesionesProgramadas) *
            100,
        )
      : 0;

  const bimestresOptions = bimestres.map((b) => ({
    value: b.id,
    label: `Bimestre ${b.nombre}`,
  }));

  const headerActions = consolidado ? (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDescargarPdf}
        disabled={descargandoPdf}
        className="gap-1.5"
      >
        {descargandoPdf ? (
          <Spinner className="size-3.5" />
        ) : (
          <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
        )}
        <span>Descargar Ficha PDF</span>
      </Button>

      <Button
        variant={solicitudPendiente ? "secondary" : "default"}
        size="sm"
        onClick={() => setAbrirSolicitud(true)}
        disabled={Boolean(solicitudPendiente)}
        className="gap-1.5"
      >
        <HugeiconsIcon icon={HelpCircleIcon} className="size-3.5" />
        <span>{solicitudPendiente ? "Revisión en trámite" : "Solicitar revisión"}</span>
      </Button>
    </div>
  ) : null;

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Mi Seguimiento y Cumplimiento de Clases"
        description="Consulta tu consolidado bimestral de sesiones de clase, cumplimiento de horario, ausencias registradas y evaluación directiva."
        icon={CheckmarkCircle02Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mi seguimiento" }]}
        actions={headerActions}
      />

      {/* Selector de periodo institucional con SelectOption */}
      <div className="border-border/60 bg-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs">
        <div className="space-y-0.5">
          <span className="text-foreground text-sm font-semibold">Periodo Académico</span>
          <p className="text-muted-foreground text-xs">
            Selecciona el bimestre a consultar para visualizar tu avance de horas y sesiones.
          </p>
        </div>
        <div className="w-64">
          <SelectOption
            options={bimestresOptions}
            value={periodoActivo}
            onSelect={(val) => setPeriodoSeleccionado(val)}
            placeholder="Seleccionar bimestre..."
            searchPlaceholder="Buscar bimestre..."
          />
        </div>
      </div>

      {/* Alerta de solicitud de revisión pendiente */}
      {solicitudPendiente && (
        <div className="text-foreground flex items-start gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs shadow-xs">
          <HugeiconsIcon icon={HelpCircleIcon} className="mt-0.5 size-5 shrink-0 text-blue-500" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                Solicitud de revisión enviada
              </span>
              <Badge
                variant={
                  ESTADOS_SOLICITUD_CONFIG[solicitudPendiente.estado]?.variant ?? "secondary"
                }
                className={ESTADOS_SOLICITUD_CONFIG[solicitudPendiente.estado]?.className}
              >
                {ESTADOS_SOLICITUD_CONFIG[solicitudPendiente.estado]?.label ??
                  solicitudPendiente.estado}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Motivo: &ldquo;{solicitudPendiente.motivo}&rdquo;
            </p>
            <p className="text-muted-foreground font-mono text-[11px]">
              Registrada el {formatDate(solicitudPendiente.solicitadoEn)} · En evaluación directiva.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="border-border/60 bg-card text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-2xl border py-16">
          <Spinner className="size-6" />
          <p className="text-xs">Cargando información de tu consolidado bimestral...</p>
        </div>
      ) : !consolidado ? (
        <EmptyState
          title="Consolidado aún no disponible"
          description="Aún no se ha emitido el consolidado docente para este bimestre. La Dirección lo publicará al culminar el periodo académico."
          icon={AlertCircleIcon}
        />
      ) : (
        <div className="space-y-6">
          {/* Métricas clave */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
              <span className="text-muted-foreground text-xs font-medium">
                Cumplimiento Bimestral
              </span>
              <p className="text-foreground mt-2 font-mono text-2xl font-bold">{tasa}%</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {consolidado.sesionesCumplidas + consolidado.sesionesJustificadas} de{" "}
                {consolidado.sesionesProgramadas} sesiones
              </p>
            </div>

            <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
              <span className="text-muted-foreground text-xs font-medium">
                Tiempo Fuera de Aula
              </span>
              <p className="text-foreground mt-2 font-mono text-2xl font-bold">
                {consolidado.tiempoTotalFueraTexto}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {consolidado.totalAusencias} ausencias o tardanzas
              </p>
            </div>

            <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
              <span className="text-muted-foreground text-xs font-medium">
                Estado del Consolidado
              </span>
              <div className="mt-2.5">
                <Badge
                  variant={ESTADOS_CONSOLIDADO_CONFIG[consolidado.estado]?.variant ?? "default"}
                  className={ESTADOS_CONSOLIDADO_CONFIG[consolidado.estado]?.className}
                >
                  {ESTADOS_CONSOLIDADO_CONFIG[consolidado.estado]?.label ?? consolidado.estado} (v
                  {consolidado.version})
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1.5 text-xs">
                {consolidado.vigente ? "Versión vigente" : "Versión preliminar"}
              </p>
            </div>

            <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
              <span className="text-muted-foreground text-xs font-medium">Decisión Directiva</span>
              <div className="mt-2.5">
                <Badge
                  variant={
                    DECISIONES_CONSOLIDADO_CONFIG[consolidado.decision]?.variant ?? "outline"
                  }
                  className={DECISIONES_CONSOLIDADO_CONFIG[consolidado.decision]?.className}
                >
                  {DECISIONES_CONSOLIDADO_CONFIG[consolidado.decision]?.label ??
                    consolidado.decision}
                </Badge>
              </div>
              <p
                className="text-muted-foreground mt-1.5 truncate text-xs"
                title={consolidado.observacion ?? ""}
              >
                {consolidado.observacion || "Sin observaciones adicionales"}
              </p>
            </div>
          </div>

          <HorasPedagogicasCards consolidado={consolidado} variante="docente" />

          {/* Tabla de sesiones del docente */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-foreground text-sm font-semibold">
                Registro de Sesiones Dictadas
              </h3>
              <p className="text-muted-foreground text-xs">
                Listado detallado de clases programadas, horarios de firma biométrica/manual y
                minutos computados.
              </p>
            </div>
            <DataTable
              columns={sesionesColumns}
              data={sesiones}
              pagination={false}
              caption="Listado detallado de clases programadas y minutos computados"
              emptyMessage="No hay sesiones asignadas o registradas en este periodo."
            />
          </div>
        </div>
      )}

      {/* Modal desacoplado para solicitar revisión */}
      {consolidado && (
        <ModalSolicitarRevision
          consolidadoId={consolidado.id}
          bimestreNombre={periodoActual?.nombre ?? "Bimestre"}
          abierto={abrirSolicitud}
          onOpenChange={setAbrirSolicitud}
        />
      )}
    </div>
  );
}
