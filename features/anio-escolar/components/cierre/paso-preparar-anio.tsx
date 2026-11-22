"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  PlusSignIcon,
  School01Icon,
} from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Seccion } from "@/features/secciones/types";
import type { AnioAcademico } from "../../types";
import { ESTADO_ANIO, TONO_ESTADO_ANIO } from "../anio/estados";

interface PasoPrepararAnioProps {
  anioOrigen: AnioAcademico;
  aniosCandidatosDestino: AnioAcademico[];
  anioDestinoId: string;
  onSelectAnioDestino: (id: string) => void;
  onAbrirCrearAnio: () => void;
  seccionesOrigen: Seccion[];
  seccionesDestino: Seccion[];
  cargandoSeccionesDestino: boolean;
  clonando: boolean;
  onClonarSecciones: (opciones: { copiarTutores: boolean; copiarAulas: boolean }) => void;
  onContinuar: () => void;
}

export function PasoPrepararAnio({
  anioOrigen,
  aniosCandidatosDestino,
  anioDestinoId,
  onSelectAnioDestino,
  onAbrirCrearAnio,
  seccionesOrigen,
  seccionesDestino,
  cargandoSeccionesDestino,
  clonando,
  onClonarSecciones,
  onContinuar,
}: PasoPrepararAnioProps) {
  const [copiarAulas, setCopiarAulas] = React.useState(true);
  const [copiarTutores, setCopiarTutores] = React.useState(false);

  const anioDestino = aniosCandidatosDestino.find((a) => a.id === anioDestinoId) ?? null;

  const opcionesDestino: SelectOptionItem<string>[] = React.useMemo(
    () =>
      aniosCandidatosDestino.map((a) => ({
        value: a.id,
        label: `Año ${a.anio}${a.nombre ? ` — ${a.nombre}` : ""}`,
        description: `Estado: ${ESTADO_ANIO[a.estado]}`,
      })),
    [aniosCandidatosDestino],
  );

  const tieneSeccionesDestino = seccionesDestino.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle>Paso 2: Preparar año destino y secciones</CardTitle>
          <CardDescription>
            Seleccione o cree el nuevo año académico y clone las secciones desde el año{" "}
            <strong>{anioOrigen.anio}</strong> (se crea también la carga académica del plan de
            estudios).
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onAbrirCrearAnio} className="gap-1.5">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Crear año {anioOrigen.anio + 1}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold">Año académico destino</Label>
            <SelectOption
              options={opcionesDestino}
              value={anioDestinoId}
              onSelect={onSelectAnioDestino}
              placeholder="Seleccione un año planificado o en curso..."
              searchPlaceholder="Buscar año..."
              className="h-10 text-xs"
            />
          </div>

          {anioDestino ? (
            <div className="bg-muted/30 flex items-center justify-between rounded-xl border px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">Año {anioDestino.anio}</span>
                <span className="text-muted-foreground text-xs">
                  {cargandoSeccionesDestino
                    ? "Consultando secciones..."
                    : `${seccionesDestino.length} secciones activas creadas`}
                </span>
              </div>
              <StatusBadge tone={TONO_ESTADO_ANIO[anioDestino.estado]}>
                {ESTADO_ANIO[anioDestino.estado]}
              </StatusBadge>
            </div>
          ) : null}
        </div>

        {anioDestino ? (
          <div className="flex flex-col gap-4 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={School01Icon}
                  className="text-primary mt-0.5 size-5 shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">
                    Estructura de secciones ({seccionesOrigen.length} en {anioOrigen.anio} →{" "}
                    {seccionesDestino.length} en {anioDestino.anio})
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Clonar copia todas las secciones activas que aún no existan en{" "}
                    {anioDestino.anio} y omite las duplicadas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant={tieneSeccionesDestino ? "outline" : "default"}
                  disabled={clonando || seccionesOrigen.length === 0}
                  onClick={() => onClonarSecciones({ copiarAulas, copiarTutores })}
                  className="gap-1.5"
                >
                  <HugeiconsIcon icon={Copy01Icon} className="size-4" />
                  {clonando
                    ? "Clonando..."
                    : tieneSeccionesDestino
                      ? "Clonar faltantes"
                      : `Clonar ${seccionesOrigen.length} secciones`}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/secciones">Administrar secciones</Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 border-t pt-3 text-xs">
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={copiarAulas}
                  onCheckedChange={(checked) => setCopiarAulas(Boolean(checked))}
                />
                <span>Copiar aulas asignadas</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={copiarTutores}
                  onCheckedChange={(checked) => setCopiarTutores(Boolean(checked))}
                />
                <span>Copiar tutores activos</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-400">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
            <span>
              Cree o seleccione un año destino en estado planificado o en curso para continuar con
              la promoción de 1.° a 4.° grado.
            </span>
          </div>
        )}

        {anioDestino && tieneSeccionesDestino ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5 shrink-0" />
              <span>
                El año <strong>{anioDestino.anio}</strong> cuenta con{" "}
                <strong>{seccionesDestino.length}</strong> secciones listas para recibir
                estudiantes.
              </span>
            </div>
            <Button size="sm" onClick={onContinuar}>
              Continuar a Promoción (Paso 3)
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
