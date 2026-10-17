"use client";

import * as React from "react";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import {
  MENSAJES_INDICADORES,
  type DesgloseCspDto,
  type DesgloseIgmDto,
  type DesgloseIsaDto,
  type IndicadorCalculadoDto,
} from "@/features/indicadores";
import { TarjetaIndicador } from "./tarjeta-indicador";

interface TarjetasIndicadoresGridProps {
  csp: IndicadorCalculadoDto<DesgloseCspDto>;
  isa: IndicadorCalculadoDto<DesgloseIsaDto>;
  igm: IndicadorCalculadoDto<DesgloseIgmDto>;
  onLimpiarFiltros?: () => void;
}

/**
 * Cuadrícula adaptable para renderizar las 3 tarjetas de indicadores principales (CSP, ISA, IGM).
 * Gestiona el estado vacío global cuando ninguno de los indicadores posee registros.
 */
export function TarjetasIndicadoresGrid({
  csp,
  isa,
  igm,
  onLimpiarFiltros,
}: TarjetasIndicadoresGridProps) {
  const todosSinDatos = csp.sinDatos && isa.sinDatos && igm.sinDatos;

  if (todosSinDatos) {
    return (
      <EmptyState
        title="Sin registros en el período"
        description={MENSAJES_INDICADORES.SIN_DATOS}
        icon={Folder01Icon}
        action={
          onLimpiarFiltros ? (
            <Button type="button" variant="outline" onClick={onLimpiarFiltros}>
              Restablecer filtros
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <section
      aria-label="Tarjetas de indicadores de la tesis"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <TarjetaIndicador indicador={csp} />
      <TarjetaIndicador indicador={isa} />
      <TarjetaIndicador indicador={igm} />
    </section>
  );
}
