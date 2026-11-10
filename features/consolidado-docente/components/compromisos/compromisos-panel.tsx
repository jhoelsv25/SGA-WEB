"use client";

import * as React from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { DECISIONES_CON_COMPROMISO } from "../../consts";
import { useCompromisosQuery } from "../../hooks";
import type { CompromisoItem, ConsolidadoResumenItem } from "../../types";
import {
  ModalAnularCompromiso,
  ModalCerrarCompromiso,
  ModalDetalleCompromiso,
  ModalRegistrarCompromiso,
  ModalReprogramarCompromiso,
} from "../modals";
import { CompromisoTarjeta } from "./compromiso-tarjeta";

export interface CompromisosPanelProps {
  consolidado: ConsolidadoResumenItem;
  /** El Director y el Administrador registran y cierran; el resto solo consulta. */
  puedeGestionar: boolean;
  /** Abre el detalle de un compromiso al llegar desde un enlace de pendientes. */
  compromisoIdInicial?: string | null;
}

const decisionAdmiteCompromiso = (decision: string): boolean =>
  (DECISIONES_CON_COMPROMISO as readonly string[]).includes(decision);

export function CompromisosPanel({
  consolidado,
  puedeGestionar,
  compromisoIdInicial = null,
}: CompromisosPanelProps) {
  const { data: compromisos = [], isLoading } = useCompromisosQuery(consolidado.id);

  const [registrando, setRegistrando] = React.useState(false);
  const [detalleId, setDetalleId] = React.useState<string | null>(compromisoIdInicial);
  const [paraCerrar, setParaCerrar] = React.useState<CompromisoItem | null>(null);
  const [paraReprogramar, setParaReprogramar] = React.useState<CompromisoItem | null>(null);
  const [paraAnular, setParaAnular] = React.useState<CompromisoItem | null>(null);

  const admiteCompromiso = decisionAdmiteCompromiso(consolidado.decision);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs">
          Compromisos del docente en este bimestre. Solo se registran con la decisión «Compromiso de
          mejora» o «Llamada de atención».
        </p>
        {puedeGestionar && (
          <Button
            size="sm"
            onClick={() => setRegistrando(true)}
            disabled={!admiteCompromiso}
            title={
              admiteCompromiso
                ? undefined
                : "Registre primero la decisión «Compromiso de mejora» o «Llamada de atención»."
            }
            className="gap-1.5"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            <span>Registrar compromiso</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-xs">
          <Spinner className="size-4" />
          <span>Cargando compromisos...</span>
        </div>
      ) : compromisos.length === 0 ? (
        <p className="text-muted-foreground border-border/60 rounded-xl border border-dashed py-8 text-center text-xs">
          Este consolidado no tiene compromisos registrados.
        </p>
      ) : (
        <ul className="space-y-2">
          {compromisos.map((c) => {
            const abierto = c.estado === "pendiente" && !c.anulado;
            return (
              <CompromisoTarjeta
                key={c.id}
                compromiso={c}
                acciones={
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetalleId(c.compromisoId)}
                    >
                      Ver detalle
                    </Button>
                    {puedeGestionar && abierto && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setParaCerrar(c)}>
                          Cerrar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setParaReprogramar(c)}>
                          Reprogramar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setParaAnular(c)}>
                          Anular
                        </Button>
                      </>
                    )}
                  </>
                }
              />
            );
          })}
        </ul>
      )}

      <ModalRegistrarCompromiso
        consolidado={registrando ? consolidado : null}
        abierto={registrando}
        onOpenChange={setRegistrando}
      />
      <ModalDetalleCompromiso
        compromisoId={detalleId}
        abierto={Boolean(detalleId)}
        onOpenChange={(abierto) => !abierto && setDetalleId(null)}
      />
      <ModalCerrarCompromiso
        compromiso={paraCerrar}
        abierto={Boolean(paraCerrar)}
        onOpenChange={(abierto) => !abierto && setParaCerrar(null)}
      />
      <ModalReprogramarCompromiso
        compromiso={paraReprogramar}
        abierto={Boolean(paraReprogramar)}
        onOpenChange={(abierto) => !abierto && setParaReprogramar(null)}
      />
      <ModalAnularCompromiso
        compromiso={paraAnular}
        abierto={Boolean(paraAnular)}
        onOpenChange={(abierto) => !abierto && setParaAnular(null)}
      />
    </div>
  );
}
