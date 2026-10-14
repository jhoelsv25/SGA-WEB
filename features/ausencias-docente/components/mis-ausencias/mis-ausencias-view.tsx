"use client";

import * as React from "react";
import { CheckmarkCircle02Icon, Clock01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { useMisAusencias, usePuedeVerMisAusencias } from "../../hooks";
import type { AusenciaFotoDto, AusenciaResponseDto } from "../../types";
import { DescargoModal } from "./descargo-modal";
import { DetalleAusenciaModal } from "./detalle-ausencia-modal";
import { MisAusenciasResumen } from "./mis-ausencias-resumen";
import { MisAusenciasTabla } from "./mis-ausencias-tabla";
import { MisAusenciasTarjetas } from "./mis-ausencias-tarjetas";
import { VisorFotoModal } from "./visor-foto-modal";

/**
 * Vista principal de «Mis ausencias» para el docente (HU3).
 * Muestra el historial de ausencias en sus sesiones y la gestión de descargos.
 */
export function MisAusenciasView() {
  const puedeVer = usePuedeVerMisAusencias();
  const { data: ausencias = [], isLoading, isError, error, refetch } = useMisAusencias();

  // Estados locales para los modales desacoplados
  const [ausenciaDetalle, setAusenciaDetalle] = React.useState<AusenciaResponseDto | null>(null);
  const [detalleAbierto, setDetalleAbierto] = React.useState(false);

  const [ausenciaDescargo, setAusenciaDescargo] = React.useState<AusenciaResponseDto | null>(null);
  const [descargoAbierto, setDescargoAbierto] = React.useState(false);

  const [fotoVisor, setFotoVisor] = React.useState<AusenciaFotoDto | null>(null);
  const [visorAbierto, setVisorAbierto] = React.useState(false);

  // Manejadores de interacción
  const handleVerDetalle = (ausencia: AusenciaResponseDto) => {
    setAusenciaDetalle(ausencia);
    setDetalleAbierto(true);
  };

  const handleAbrirDescargo = (ausencia: AusenciaResponseDto) => {
    setAusenciaDescargo(ausencia);
    setDescargoAbierto(true);
  };

  const handleVerFoto = (foto: AusenciaFotoDto) => {
    setFotoVisor(foto);
    setVisorAbierto(true);
  };

  // Verificación de control de acceso por Menú (Roles-Menú)
  if (!puedeVer) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Mis ausencias"
          description="Historial de ausencias registradas en sus sesiones de clase y presentación de descargos."
          icon={Clock01Icon}
          breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mis ausencias" }]}
        />
        <EmptyState
          title="Acceso no permitido"
          description="Su rol no tiene acceso a esta opción. Esta sección está reservada para docentes con sesiones asignadas."
          icon={LockIcon}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mis ausencias"
        description="Historial de ausencias registradas en sus sesiones de clase y presentación de descargos."
        icon={Clock01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mis ausencias" }]}
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar sus ausencias"
        isEmpty={ausencias.length === 0}
        empty={{
          title: "Sin ausencias registradas",
          description:
            "No registra ausencias en sus sesiones de clase durante el año académico seleccionado.",
          icon: CheckmarkCircle02Icon,
        }}
      >
        <div className="space-y-6">
          {/* Indicadores resumidos */}
          <MisAusenciasResumen ausencias={ausencias} />

          {/* Tabla para dispositivos medianos y grandes (escritorio / tablet) */}
          <div className="hidden md:block">
            <MisAusenciasTabla
              ausencias={ausencias}
              onVerDetalle={handleVerDetalle}
              onAbrirDescargo={handleAbrirDescargo}
            />
          </div>

          {/* Tarjetas responsivas para móviles (diseño adaptable a 360 px) */}
          <div className="block md:hidden">
            <MisAusenciasTarjetas
              ausencias={ausencias}
              onVerDetalle={handleVerDetalle}
              onAbrirDescargo={handleAbrirDescargo}
            />
          </div>
        </div>
      </PageState>

      {/* Modales desacoplados de detalle, descargo y visor de evidencias */}
      <DetalleAusenciaModal
        ausencia={ausenciaDetalle}
        abierto={detalleAbierto}
        onOpenChange={setDetalleAbierto}
        onAbrirDescargo={handleAbrirDescargo}
        onVerFoto={handleVerFoto}
      />

      <DescargoModal
        ausencia={ausenciaDescargo}
        abierto={descargoAbierto}
        onOpenChange={setDescargoAbierto}
        onDescargoExitoso={() => void refetch()}
      />

      <VisorFotoModal foto={fotoVisor} abierto={visorAbierto} onOpenChange={setVisorAbierto} />
    </div>
  );
}
