"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  PlayIcon,
  RefreshIcon,
  SquareLock01Icon,
} from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BimestresFormValues, FechasAnioFormValues } from "../../schemas";
import type { AnioAcademico } from "../../types";
import { formatoFecha } from "../../utils";
import { BimestresForm } from "../forms/bimestres-form";
import { FechasAnioForm } from "../forms/fechas-anio-form";
import { ESTADO_ANIO, ESTADO_BIMESTRE, TONO_ESTADO_ANIO, TONO_ESTADO_BIMESTRE } from "./estados";

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
  const cerrados = bimestres.filter((item) => item.estado === "cerrado").length;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Año {anio.anio}</CardTitle>
              <StatusBadge tone={TONO_ESTADO_ANIO[anio.estado]} dot={anio.estado === "en_curso"}>
                {ESTADO_ANIO[anio.estado]}
              </StatusBadge>
            </div>
            <p className="text-muted-foreground text-xs">
              {anio.nombre ? `${anio.nombre} · ` : ""}
              {formatoFecha(anio.fechaInicio)} – {formatoFecha(anio.fechaFin)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" asChild className="gap-1.5">
              <Link href="/admin/calendario">
                <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                Ver calendario
              </Link>
            </Button>
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
          </div>
        </CardHeader>
        {planificado || anio.estado === "reabierto" ? (
          <CardContent className="flex flex-col gap-4">
            {anio.estado === "reabierto" ? (
              <p className="bg-warning/10 rounded-lg border px-3 py-2 text-sm">
                Reabierto hasta {formatoFecha(anio.reabiertoHasta)}. Al día siguiente vuelve a
                cerrado
                {anio.motivoReapertura ? `. Motivo: ${anio.motivoReapertura}` : ""}.
              </p>
            ) : null}
            {planificado ? (
              <FechasAnioForm
                anio={anio}
                isSubmitting={guardandoFechas}
                onSubmit={onGuardarFechas}
              />
            ) : null}
          </CardContent>
        ) : null}
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Bimestres</CardTitle>
          <span className="text-muted-foreground text-xs font-medium">
            {cerrados} de {bimestres.length || 4} cerrados
          </span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {planificado ? (
            <>
              {bimestres.length < 4 ? (
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
            </>
          ) : (
            <>
              <div className="flex gap-1.5" aria-hidden="true">
                {bimestres.map((bimestre) => (
                  <span
                    key={bimestre.id}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      bimestre.estado === "cerrado" && "bg-primary",
                      bimestre.estado === "en_curso" && "bg-primary/40",
                      bimestre.estado !== "cerrado" && bimestre.estado !== "en_curso" && "bg-muted",
                    )}
                  />
                ))}
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {bimestres.map((bimestre) => {
                  const actual = bimestre.estado === "en_curso";
                  return (
                    <li
                      key={bimestre.id}
                      className={cn(
                        "flex flex-col gap-3 rounded-xl border p-4 transition-colors",
                        actual ? "border-primary/40 bg-primary/5" : "bg-card",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                            actual
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {bimestre.nombre}
                        </span>
                        <StatusBadge tone={TONO_ESTADO_BIMESTRE[bimestre.estado]} dot={actual}>
                          {ESTADO_BIMESTRE[bimestre.estado]}
                        </StatusBadge>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold">Bimestre {bimestre.nombre}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatoFecha(bimestre.fechaInicio)} – {formatoFecha(bimestre.fechaFin)}
                        </p>
                      </div>
                      {abierto && bimestre.estado === "planificado" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onIniciarBimestre(bimestre.id)}
                          className="mt-auto gap-1.5 rounded-full"
                        >
                          <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
                          Iniciar
                        </Button>
                      ) : null}
                      {actual ? (
                        <Button
                          size="sm"
                          onClick={() => onCerrarBimestre(bimestre.id)}
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
              <p className="text-muted-foreground text-xs">
                Solo se pueden modificar las fechas de un año planificado.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
