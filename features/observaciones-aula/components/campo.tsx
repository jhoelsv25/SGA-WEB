import * as React from "react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CampoProps {
  id: string;
  etiqueta: string;
  error?: string;
  ayuda?: string;
  children: React.ReactNode;
}

/** Etiqueta + control + mensaje de error. */
export function Campo({ id, etiqueta, error, ayuda, children }: CampoProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {etiqueta}
      </Label>
      {children}
      {ayuda && !error && <p className="text-muted-foreground text-xs">{ayuda}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-destructive text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

interface PieFormularioProps {
  onCancelar: () => void;
  textoEnviar: string;
  cargando: boolean;
}

/** Pie común de los formularios en ventana: cancelar y enviar con estado de carga. */
export function PieFormulario({ onCancelar, textoEnviar, cargando }: PieFormularioProps) {
  return (
    <div className="flex justify-end gap-2.5 pt-3">
      <Button type="button" variant="outline" disabled={cargando} onClick={onCancelar}>
        Cancelar
      </Button>
      <Button type="submit" disabled={cargando} className="min-h-10 gap-2">
        {cargando && <Spinner className="size-4" />}
        {textoEnviar}
      </Button>
    </div>
  );
}

export function MensajeError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="text-destructive text-xs font-medium">
      {children}
    </p>
  );
}
