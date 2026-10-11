"use client";

import * as React from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ValoresModalTexto {
  texto: string;
  enlace?: string;
}

interface ModalTextoProps {
  abierto: boolean;
  /** Cambia cuando se abre para otro registro: reinicia el formulario. */
  clave: string;
  onOpenChange: (abierto: boolean) => void;
  titulo: string;
  descripcion?: string;
  icono: IconSvgElement;
  etiqueta: string;
  placeholder: string;
  mensajeRequerido: string;
  textoInicial?: string;
  conEnlace?: boolean;
  textoBoton: string;
  pendiente: boolean;
  onEnviar: (valores: ValoresModalTexto) => void;
}

function Formulario(
  props: Omit<ModalTextoProps, "abierto" | "clave" | "titulo" | "descripcion" | "icono">,
) {
  const [texto, setTexto] = React.useState(props.textoInicial ?? "");
  const [enlace, setEnlace] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!texto.trim()) {
      setError(props.mensajeRequerido);
      return;
    }
    props.onEnviar({ texto: texto.trim(), enlace: enlace.trim() || undefined });
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="texto-modal" className="text-sm font-medium">
          {props.etiqueta} *
        </Label>
        <Textarea
          id="texto-modal"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            if (error) setError(null);
          }}
          placeholder={props.placeholder}
          maxLength={500}
          disabled={props.pendiente}
          aria-invalid={Boolean(error)}
        />
        {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      </div>
      {props.conEnlace && (
        <div className="space-y-1.5">
          <Label htmlFor="enlace-modal" className="text-sm font-medium">
            Enlace del documento (opcional)
          </Label>
          <Input
            id="enlace-modal"
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
            placeholder="https://…"
            maxLength={255}
            disabled={props.pendiente}
          />
        </div>
      )}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          onClick={() => props.onOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={props.pendiente} className="min-h-10 gap-2">
          {props.pendiente && <Spinner className="size-4" />}
          {props.textoBoton}
        </Button>
      </div>
    </form>
  );
}

export function ModalTexto({
  abierto,
  clave,
  titulo,
  descripcion,
  icono,
  ...resto
}: ModalTextoProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={resto.onOpenChange}
      title={titulo}
      description={descripcion}
      icon={icono}
      size="md"
    >
      {abierto && <Formulario key={clave} {...resto} />}
    </Modal>
  );
}
