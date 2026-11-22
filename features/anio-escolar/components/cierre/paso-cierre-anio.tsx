"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  PlayIcon,
  SquareLock01Icon,
} from "@hugeicons/core-free-icons";
import { ConfirmDialog, type ConfirmVariant } from "@/components/common/confirm-dialog";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AnioAcademico } from "../../types";
import { formatoFecha } from "../../utils";
import {
  ESTADO_ANIO,
  ESTADO_BIMESTRE,
  TONO_ESTADO_ANIO,
  TONO_ESTADO_BIMESTRE,
} from "../anio/estados";

interface PasoCierreAnioProps {
  anioOrigen: AnioAcademico | null;
  cerrandoBimestre: boolean;
  iniciandoBimestre: boolean;
  cerrandoAnio: boolean;
  onIniciarBimestre: (anioId: string, bimestreId: string) => void;
  onCerrarBimestre: (anioId: string, bimestreId: string) => void;
  onCerrarAnio: (anioId: string) => void;
  onContinuar: () => void;
}

interface Confirmacion {
  titulo: string;
  detalle: string;
  variant: ConfirmVariant;
  accion: () => void;
}

export function PasoCierreAnio({
  anioOrigen,
  cerrandoBimestre,
  iniciandoBimestre,
  cerrandoAnio,
  onIniciarBimestre,
  onCerrarBimestre,
  onCerrarAnio,
  onContinuar,
}: PasoCierreAnioProps) {
  const [confirmacion, setConfirmacion] = React.useState<Confirmacion | null>(null);

  if (!anioOrigen) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-8 text-center text-sm">
          Seleccione un año académico de origen para iniciar el proceso de cierre.
        </CardContent>
      </Card>
    );
  }

  const bimestres = [...anioOrigen.bimestres].sort((a, b) => a.numero - b.numero);
  const cerrados = bimestres.filter((b) => b.estado === "cerrado").length;
  const todosBimestresCerrados = bimestres.length === 4 && cerrados === 4;
  const yaCerrado = anioOrigen.estado === "cerrado";
  const abierto = anioOrigen.estado === "en_curso" || anioOrigen.estado === "reabierto";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CardTitle>Paso 1: Cerrar bimestres y Año {anioOrigen.anio}</CardTitle>
              <StatusBadge
                tone={TONO_ESTADO_ANIO[anioOrigen.estado]}
                dot={anioOrigen.estado === "en_curso"}
              >
                {ESTADO_ANIO[anioOrigen.estado]}
              </StatusBadge>
            </div>
            <CardDescription>
              Cierre los 4 bimestres en orden y luego cierre el año académico. Al cerrar el año,
              todas las matrículas activas pasan automáticamente a estado <strong>culminado</strong>{" "}
              para habilitar la promoción y el egreso.
            </CardDescription>
          </div>
          <span className="text-muted-foreground text-xs font-medium">
            {cerrados} de 4 bimestres cerrados
          </span>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {yaCerrado ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5 shrink-0" />
                <span>
                  El año <strong>{anioOrigen.anio}</strong> ya está cerrado y sus matrículas activas
                  están listas para promoción y egreso.
                </span>
              </div>
              <Button size="sm" onClick={onContinuar}>
                Continuar al Paso 2
              </Button>
            </div>
          ) : (
            <>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {bimestres.map((bimestre) => {
                  const actual = bimestre.estado === "en_curso";
                  const previo = bimestres.find((b) => b.numero === bimestre.numero - 1);
                  const puedeIniciar =
                    abierto &&
                    bimestre.estado === "planificado" &&
                    (!previo || previo.estado === "cerrado") &&
                    !bimestres.some((b) => b.estado === "en_curso");

                  return (
                    <li
                      key={bimestre.id}
                      className={cn(
                        "flex flex-col gap-3 rounded-xl border p-4",
                        actual ? "border-primary/40 bg-primary/5" : "bg-card",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">Bimestre {bimestre.nombre}</span>
                        <StatusBadge tone={TONO_ESTADO_BIMESTRE[bimestre.estado]} dot={actual}>
                          {ESTADO_BIMESTRE[bimestre.estado]}
                        </StatusBadge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {formatoFecha(bimestre.fechaInicio)} – {formatoFecha(bimestre.fechaFin)}
                      </p>

                      {puedeIniciar ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={iniciandoBimestre}
                          onClick={() =>
                            setConfirmacion({
                              titulo: `Iniciar Bimestre ${bimestre.nombre}`,
                              detalle:
                                "El bimestre quedará en curso para que pueda registrarse y cerrarse.",
                              variant: "info",
                              accion: () => onIniciarBimestre(anioOrigen.id, bimestre.id),
                            })
                          }
                          className="mt-auto gap-1.5 rounded-full"
                        >
                          <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
                          Iniciar
                        </Button>
                      ) : null}

                      {actual ? (
                        <Button
                          size="sm"
                          disabled={cerrandoBimestre}
                          onClick={() =>
                            setConfirmacion({
                              titulo: `Cerrar Bimestre ${bimestre.nombre}`,
                              detalle:
                                "Después de cerrarlo no se podrán registrar ni modificar sesiones ni ausencias en esas fechas.",
                              variant: "warning",
                              accion: () => onCerrarBimestre(anioOrigen.id, bimestre.id),
                            })
                          }
                          className="mt-auto gap-1.5 rounded-full"
                        >
                          <HugeiconsIcon icon={SquareLock01Icon} className="size-3.5" />
                          Cerrar bimestre
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
                <div className="flex items-start gap-2 text-xs">
                  <HugeiconsIcon
                    icon={todosBimestresCerrados ? CheckmarkCircle02Icon : AlertCircleIcon}
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      todosBimestresCerrados ? "text-emerald-600" : "text-amber-600",
                    )}
                  />
                  <span className="text-muted-foreground">
                    {todosBimestresCerrados
                      ? `Los 4 bimestres están cerrados. Ya puede cerrar el año ${anioOrigen.anio} y culminar las matrículas activas.`
                      : "Debe cerrar los 4 bimestres antes de poder cerrar el año académico."}
                  </span>
                </div>
                <Button
                  disabled={!abierto || !todosBimestresCerrados || cerrandoAnio}
                  onClick={() =>
                    setConfirmacion({
                      titulo: `Cerrar Año Académico ${anioOrigen.anio}`,
                      detalle:
                        "El año pasará a estado cerrado y todas las matrículas activas quedarán en estado culminado para promover o egresar a los estudiantes.",
                      variant: "warning",
                      accion: () => onCerrarAnio(anioOrigen.id),
                    })
                  }
                  className="gap-1.5"
                >
                  <HugeiconsIcon icon={SquareLock01Icon} className="size-4" />
                  {cerrandoAnio ? "Cerrando..." : `Cerrar año ${anioOrigen.anio}`}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmacion !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmacion(null);
        }}
        title={confirmacion?.titulo}
        description={confirmacion?.detalle}
        variant={confirmacion?.variant ?? "default"}
        confirmText="Confirmar"
        onConfirm={() => confirmacion?.accion()}
      />
    </div>
  );
}
