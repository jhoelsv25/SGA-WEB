"use client";

import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EstadoSesionBadge } from "../components";
import type { Sesion } from "../types";

interface ListaSesionesKioskoProps {
  docenteNombre: string;
  sesiones: Sesion[];
  elegidaId: string | null;
  onElegir: (id: string) => void;
  tema: string;
  onTema: (tema: string) => void;
  procesando: boolean;
  onFirmarIngreso: () => void;
  onFirmarSalida: () => void;
  onTerminar: () => void;
}

export function ListaSesionesKiosko(props: ListaSesionesKioskoProps) {
  const elegida = props.sesiones.find((s) => s.id === props.elegidaId) ?? null;

  return (
    <div className="space-y-4">
      <div className="border-primary/20 bg-primary/10 text-primary flex items-center justify-between rounded-2xl border p-3.5 text-sm font-bold">
        <span>Hola, {props.docenteNombre}</span>
        <span className="text-muted-foreground text-xs font-normal">Sus sesiones de hoy</span>
      </div>

      <ul className="space-y-2" aria-label="Sesiones de hoy">
        {props.sesiones.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => props.onElegir(s.id)}
              aria-pressed={s.id === props.elegidaId}
              className={cn(
                "border-border/80 bg-card hover:border-primary/40 flex min-h-14 w-full flex-wrap items-center justify-between gap-2 rounded-2xl border p-3 text-left transition-colors",
                s.id === props.elegidaId && "border-primary ring-primary/30 ring-2",
              )}
            >
              <span>
                <span className="block font-mono text-sm font-bold">
                  {s.horaInicio}–{s.horaFin}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {s.cursoNombre} · {s.seccionNombre}
                </span>
              </span>
              <EstadoSesionBadge sesion={s} />
            </button>
          </li>
        ))}
      </ul>

      {elegida?.estado === "pendiente" && (
        <div className="space-y-2">
          <Label htmlFor="tema-sesion" className="text-sm font-semibold">
            Tema de la sesión *
          </Label>
          <Input
            id="tema-sesion"
            value={props.tema}
            onChange={(e) => props.onTema(e.target.value)}
            placeholder="Ej. Ecuaciones cuadráticas"
            maxLength={500}
            disabled={props.procesando}
            className="h-12 text-base"
          />
          <Button
            type="button"
            className="h-12 w-full gap-2 rounded-2xl text-base font-bold"
            disabled={props.procesando}
            onClick={props.onFirmarIngreso}
          >
            {props.procesando && <Spinner className="size-4" />}
            Firmar ingreso
          </Button>
        </div>
      )}

      {elegida?.estado === "en_curso" && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            Tema: <span className="text-foreground font-medium">{elegida.tema}</span> · Ingreso{" "}
            {elegida.horaIngreso}
          </p>
          <Button
            type="button"
            className="h-12 w-full gap-2 rounded-2xl text-base font-bold"
            disabled={props.procesando}
            onClick={props.onFirmarSalida}
          >
            {props.procesando && <Spinner className="size-4" />}
            Firmar salida
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-2xl"
        onClick={props.onTerminar}
      >
        Terminar
      </Button>
    </div>
  );
}
