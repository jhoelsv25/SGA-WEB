"use client";

import * as React from "react";
import { Clock01Icon, LockIcon, UserCheck01Icon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { ApiClientError } from "@/lib/api-client";
import { MENSAJES_CONSOLIDADO } from "../../consts";
import { useMiConsolidado, usePuedeVerMiSeguimiento } from "../../hooks";
import type { EvidenciaFotoConsolidadoDto } from "../../types";
import { MiDecisionDirectiva } from "./mi-decision-directiva";
import { MiSeguimientoHeader } from "./mi-seguimiento-header";
import { MiSeguimientoSesiones } from "./mi-seguimiento-sesiones";
import { MiSeguimientoTotales } from "./mi-seguimiento-totales";
import { SelectorBimestre } from "./selector-bimestre";
import { SolicitudRevisionCard } from "./solicitud-revision-card";
import { SolicitudRevisionModal } from "./solicitud-revision-modal";
import { VisorFotoSeguimientoModal } from "./visor-foto-seguimiento-modal";

/**
 * Vista principal «Mi seguimiento» para el docente (HU3).
 * Muestra el consolidado vigente, totales por estado y tiempo fuera de clase,
 * detalle de sesiones con ausencias, decisión directiva y gestión de solicitudes de revisión.
 */
export function MiSeguimientoView() {
  const puedeVer = usePuedeVerMiSeguimiento();
  const { anio, cargando: cargandoAnio } = useAnioLectivo();

  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio?.bimestres]);

  const [periodoSeleccionadoId, setPeriodoSeleccionadoId] = React.useState<string | undefined>(
    undefined,
  );

  // Deriva el período activo: el seleccionado manualmente, el que esté en curso o el primero
  const periodoActivoId = React.useMemo(() => {
    if (periodoSeleccionadoId) return periodoSeleccionadoId;
    const activo = bimestres.find((b) => b.estado === "en_curso") ?? bimestres[0];
    return activo?.id;
  }, [bimestres, periodoSeleccionadoId]);

  // Consulta del consolidado docente para el período activo
  const {
    data,
    isLoading: cargandoConsolidado,
    isError,
    error,
    refetch,
  } = useMiConsolidado(periodoActivoId, Boolean(periodoActivoId));

  // Estados locales para los modales
  const [solicitudModalAbierta, setSolicitudModalAbierta] = React.useState(false);
  const [fotoVisor, setFotoVisor] = React.useState<EvidenciaFotoConsolidadoDto | null>(null);
  const [visorAbierto, setVisorAbierto] = React.useState(false);

  const handleVerFoto = (foto: EvidenciaFotoConsolidadoDto) => {
    setFotoVisor(foto);
    setVisorAbierto(true);
  };

  const periodoActual = React.useMemo(
    () => bimestres.find((b) => b.id === periodoActivoId),
    [bimestres, periodoActivoId],
  );

  // 1. Verificación de permiso por Roles-Menú
  if (!puedeVer) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Mi seguimiento"
          description="Consolidado de seguimiento docente, métricas por bimestre y solicitudes de revisión."
          icon={UserCheck01Icon}
          breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mi seguimiento" }]}
        />
        <EmptyState
          title="Acceso no permitido"
          description="Su rol no tiene autorización para acceder a esta opción. Esta sección está reservada para docentes con seguimiento asignado."
          icon={LockIcon}
        />
      </div>
    );
  }

  // 2. Control de error 403 del servidor (CP-RF013-20)
  const esError403 = error instanceof ApiClientError && error.statusCode === 403;
  if (esError403) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Mi seguimiento"
          description="Consolidado de seguimiento docente, métricas por bimestre y solicitudes de revisión."
          icon={UserCheck01Icon}
          breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mi seguimiento" }]}
        />
        <EmptyState
          title="Acceso denegado"
          description={
            (error instanceof ApiClientError ? error.message : undefined) ||
            MENSAJES_CONSOLIDADO.DOCENTE_SIN_ACCESO_OTRO
          }
          icon={LockIcon}
        />
      </div>
    );
  }

  // 3. Control de error 404 del servidor (No hay consolidado generado aún)
  const esError404 = error instanceof ApiClientError && error.statusCode === 404;

  const cargando = cargandoAnio || (Boolean(periodoActivoId) && cargandoConsolidado);
  const tieneConsolidado = Boolean(data?.consolidado);
  const estaVacio = !cargando && (esError404 || !tieneConsolidado);

  return (
    <div className="flex flex-col gap-6">
      <MiSeguimientoHeader
        consolidado={data?.consolidado}
        solicitudPendiente={data?.solicitudPendiente}
        onAbrirSolicitud={() => setSolicitudModalAbierta(true)}
      />

      {/* Selector de bimestre activo */}
      <SelectorBimestre
        bimestres={bimestres}
        periodoSeleccionadoId={periodoActivoId}
        onSelectPeriodo={(id) => setPeriodoSeleccionadoId(id)}
        disabled={cargando}
      />

      {/* Estado general de la página */}
      <PageState
        isLoading={cargando}
        isError={isError && !esError404 && !esError403}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar su consolidado"
        isEmpty={estaVacio}
        empty={{
          title: "Sin consolidado disponible",
          description: periodoActual
            ? `El consolidado del ${periodoActual.nombre} aún no ha sido generado por la Dirección.`
            : "No se encontró un consolidado generado para el bimestre seleccionado.",
          icon: Clock01Icon,
        }}
      >
        {data && data.consolidado && (
          <div className="space-y-6">
            {/* Si existe solicitud de revisión abierta o reciente, se muestra en primer plano */}
            {data.solicitudPendiente && (
              <SolicitudRevisionCard solicitud={data.solicitudPendiente} />
            )}

            {/* Indicadores cuantitativos del consolidado */}
            <MiSeguimientoTotales consolidado={data.consolidado} />

            {/* Panel de decisión directiva y estado */}
            <MiDecisionDirectiva consolidado={data.consolidado} />

            {/* Detalle pormenorizado de sesiones y ausencias en clase */}
            <MiSeguimientoSesiones sesiones={data.sesiones} onVerFoto={handleVerFoto} />
          </div>
        )}
      </PageState>

      {/* Modal para solicitar revisión del consolidado (HU3) */}
      {data?.consolidado && (
        <SolicitudRevisionModal
          consolidadoId={data.consolidado.id}
          periodoNombre={data.consolidado.periodoNombre}
          abierto={solicitudModalAbierta}
          onOpenChange={setSolicitudModalAbierta}
          onSolicitudEnviada={() => void refetch()}
        />
      )}

      {/* Modal visor de fotografías de supervisión */}
      <VisorFotoSeguimientoModal
        foto={fotoVisor}
        abierto={visorAbierto}
        onOpenChange={setVisorAbierto}
      />
    </div>
  );
}
