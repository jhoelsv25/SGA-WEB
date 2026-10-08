"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  PlayIcon,
  RefreshIcon,
  SquareLock01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BimestresFormValues, FechasAnioFormValues } from "../../schemas";
import type { AnioAcademico } from "../../types";
import { formatoFecha } from "../../utils";
import { BimestresForm } from "../forms/bimestres-form";
import { FechasAnioForm } from "../forms/fechas-anio-form";
import { ESTADO_ANIO, ESTADO_BIMESTRE } from "./estados";

interface AnioDetalleProps {
  anio: AnioAcademico;
  guardandoFechas: boolean;
  guardandoBimestres: boolean;
  onGuardarFechas: (values: FechasAnioFormValues) => Promise<void>;
  onGuardarBimestres: (values: BimestresFormValues) => Promise<void>;
  onIniciar: () => void;
  onCerrar: () => void;
  onReabrir: () => void;
  onIniciarBimestre: (id: string) => void;
  onCerrarBimestre: (id: string) => void;
}

export function AnioDetalle({
  anio,
  guardandoFechas,
  guardandoBimestres,
  onGuardarFechas,
  onGuardarBimestres,
  onIniciar,
  onCerrar,
  onReabrir,
  onIniciarBimestre,
  onCerrarBimestre,
}: AnioDetalleProps) {
  const planificado = anio.estado === "planificado";
  const abierto = anio.estado === "en_curso" || anio.estado === "reabierto";
  const bimestres = [...anio.bimestres].sort((a, b) => a.numero - b.numero);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Año {anio.anio}</CardTitle>
          <Badge>{ESTADO_ANIO[anio.estado]}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {anio.estado === "reabierto" ? (
            <p className="text-sm">
              Reabierto hasta {formatoFecha(anio.reabiertoHasta)}. Al día siguiente vuelve a cerrado
              {anio.motivoReapertura ? `. Motivo: ${anio.motivoReapertura}` : ""}.
            </p>
          ) : null}
          <FechasAnioForm anio={anio} isSubmitting={guardandoFechas} onSubmit={onGuardarFechas} />
          <div className="flex flex-wrap gap-2">
            {planificado ? (
              <Button onClick={onIniciar} className="gap-1.5">
                <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
                Iniciar año
              </Button>
            ) : null}
            {abierto ? (
              <Button variant="outline" onClick={onCerrar} className="gap-1.5">
                <HugeiconsIcon icon={SquareLock01Icon} className="size-3.5" />
                Cerrar año
              </Button>
            ) : null}
            {anio.estado === "cerrado" ? (
              <Button onClick={onReabrir} className="gap-1.5">
                <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
                Reabrir
              </Button>
            ) : null}
            <Button variant="ghost" asChild className="gap-1.5">
              <Link href="/admin/calendario">
                <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                Ver calendario
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bimestres</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {bimestres.map((bimestre) => (
            <div
              key={bimestre.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">
                  {bimestre.nombre} · {formatoFecha(bimestre.fechaInicio)} –{" "}
                  {formatoFecha(bimestre.fechaFin)}
                </p>
                <p className="text-muted-foreground text-xs">{ESTADO_BIMESTRE[bimestre.estado]}</p>
              </div>
              {abierto && bimestre.estado === "planificado" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onIniciarBimestre(bimestre.id)}
                  className="gap-1.5"
                >
                  <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
                  Iniciar
                </Button>
              ) : null}
              {bimestre.estado === "en_curso" ? (
                <Button size="sm" onClick={() => onCerrarBimestre(bimestre.id)} className="gap-1.5">
                  <HugeiconsIcon icon={SquareLock01Icon} className="size-3.5" />
                  Cerrar bimestre
                </Button>
              ) : null}
            </div>
          ))}
          {bimestres.length < 4 && planificado ? (
            <p className="text-muted-foreground text-sm">
              Complete las fechas de los 4 bimestres antes de iniciar el año.
            </p>
          ) : null}
          <BimestresForm
            key={`${anio.id}-${anio.fechaInicio}-${anio.fechaFin}-${anio.bimestres.map((item) => item.fechaFin).join("-")}`}
            anio={anio}
            isSubmitting={guardandoBimestres}
            onSubmit={onGuardarBimestres}
          />
        </CardContent>
      </Card>
    </div>
  );
}
