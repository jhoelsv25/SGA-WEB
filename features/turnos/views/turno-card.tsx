"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Edit01Icon,
  UserGroupIcon,
  TeacherIcon,
  Briefcase01Icon,
  HourglassIcon,
  Calendar03Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/common/status-badge";
import { TIPO_PERSONA_META, DIAS_SEMANA } from "../consts";
import type { TipoPersona, Turno } from "../types";

export interface TurnoCardProps {
  tipoPersona: TipoPersona;
  turno?: Turno;
  onEditTurno: (turno: Turno) => void;
  onCreateTurno: (tipoPersona: TipoPersona) => void;
  onToggleActivo: (turno: Turno, activo: boolean) => void;
  isToggling?: boolean;
}

function getShiftIcon(tipo: TipoPersona) {
  switch (tipo) {
    case "estudiantes":
      return UserGroupIcon;
    case "docentes":
      return TeacherIcon;
    case "administrativos":
      return Briefcase01Icon;
  }
}

export function TurnoCard({
  tipoPersona,
  turno,
  onEditTurno,
  onCreateTurno,
  onToggleActivo,
  isToggling = false,
}: TurnoCardProps) {
  const meta = TIPO_PERSONA_META[tipoPersona];
  const IconComponent = getShiftIcon(tipoPersona);

  if (!turno) {
    return (
      <Card className="border-border/80 bg-muted/20 hover:border-primary/40 flex flex-col justify-between rounded-2xl border-2 border-dashed p-6 transition-colors">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted text-muted-foreground rounded-xl p-2.5">
              <HugeiconsIcon icon={IconComponent} className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold capitalize">{meta.label}</h3>
              <div className="mt-0.5">
                <StatusBadge tone="neutral" size="sm">
                  No configurado
                </StatusBadge>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">{meta.description}</p>
        </div>

        <div className="pt-6">
          <Button
            variant="outline"
            className="border-primary/30 hover:bg-primary/10 hover:text-primary w-full gap-2"
            onClick={() => onCreateTurno(tipoPersona)}
          >
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
            Configurar turno de {meta.label.toLowerCase()}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`flex flex-col justify-between rounded-2xl border shadow-xs transition-all duration-200 hover:shadow-md ${
        turno.activo ? "border-border/80 bg-card" : "border-border/40 bg-muted/30 opacity-80"
      }`}
    >
      <div>
        <CardHeader className="border-border/40 border-b pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl p-2.5 ${
                  turno.activo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                <HugeiconsIcon icon={IconComponent} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-foreground text-base font-bold capitalize">{meta.label}</h3>
                <div className="mt-0.5 flex items-center gap-2">
                  <StatusBadge tone={turno.activo ? "success" : "neutral"} dot size="sm">
                    {turno.activo ? "Activo" : "Pausado"}
                  </StatusBadge>
                </div>
              </div>
            </div>

            {/* Toggle Activo / Inactivo */}
            <div className="flex flex-col items-end gap-1">
              <Switch
                checked={turno.activo}
                onCheckedChange={(checked) => onToggleActivo(turno, checked)}
                disabled={isToggling}
                aria-label={`Activar o desactivar turno de ${meta.label}`}
              />
              <span className="text-muted-foreground text-xs font-medium">
                {turno.activo ? "Activo" : "Pausado"}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Horario de Entrada y Ventana */}
          <div className="border-info/20 bg-info/10 space-y-2 rounded-xl border p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <HugeiconsIcon icon={Clock01Icon} className="text-info h-3.5 w-3.5" />
                Entrada oficial:
              </span>
              <span className="text-foreground text-sm font-bold">{turno.horaEntrada} hrs</span>
            </div>

            <div className="text-muted-foreground border-info/15 flex items-center justify-between border-t pt-1 text-xs">
              <span>Ventana de marcado:</span>
              <span className="text-foreground font-medium">
                {turno.ventanaEntradaInicio} — {turno.ventanaEntradaFin}
              </span>
            </div>
          </div>

          {/* Horario de Salida y Ventana */}
          <div className="border-warning/20 bg-warning/10 space-y-2 rounded-xl border p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <HugeiconsIcon icon={Clock01Icon} className="text-warning h-3.5 w-3.5" />
                Salida oficial:
              </span>
              <span className="text-foreground text-sm font-bold">{turno.horaSalida} hrs</span>
            </div>

            <div className="text-muted-foreground border-warning/15 flex items-center justify-between border-t pt-1 text-xs">
              <span>Ventana de salida:</span>
              <span className="text-foreground font-medium">
                {turno.ventanaSalidaInicio} — {turno.ventanaSalidaFin}
              </span>
            </div>
          </div>

          {/* Tolerancia y Días */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="bg-muted/20 space-y-1 rounded-lg border p-2.5">
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <HugeiconsIcon icon={HourglassIcon} className="h-3 w-3" />
                Tolerancia:
              </span>
              <p className="text-foreground font-bold">{turno.toleranciaMinutos} minutos</p>
            </div>

            <div className="bg-muted/20 space-y-1 rounded-lg border p-2.5">
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <HugeiconsIcon icon={Calendar03Icon} className="h-3 w-3" />
                Días activos:
              </span>
              <p className="text-foreground font-bold">
                {turno.diasLaborables?.length || 0} días / sem
              </p>
            </div>
          </div>

          {/* Chips de Días */}
          <div className="flex items-center justify-center gap-1 pt-1">
            {DIAS_SEMANA.map((dia) => {
              const isLaborable = turno.diasLaborables?.includes(dia.value);
              return (
                <span
                  key={dia.value}
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                    isLaborable
                      ? "border-primary/25 bg-primary/15 text-primary border"
                      : "bg-muted/40 text-muted-foreground/50 border border-transparent"
                  }`}
                  title={dia.label}
                >
                  {dia.short}
                </span>
              );
            })}
          </div>
        </CardContent>
      </div>

      <CardFooter className="border-border/40 border-t pt-2 pb-4">
        <Button
          variant="outline"
          className="border-border/80 hover:bg-muted h-9 w-full gap-2 text-xs font-medium"
          onClick={() => onEditTurno(turno)}
        >
          <HugeiconsIcon icon={Edit01Icon} className="h-3.5 w-3.5" />
          Editar parámetros del turno
        </Button>
      </CardFooter>
    </Card>
  );
}
