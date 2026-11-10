"use client";

import * as React from "react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivosJustificacion, useSolicitarJustificacion } from "../hooks";
import type { MotivoJustificacion, Sesion } from "../types";

interface ModalJustificarProps {
  sesion: Sesion | null;
  onOpenChange: (abierto: boolean) => void;
}

interface Errores {
  motivo?: string;
  documento?: string;
  observacion?: string;
}

/** Valida con la regla del catálogo que entrega la API; la API vuelve a validar al enviar. */
export function validarJustificacion(
  motivo: MotivoJustificacion | undefined,
  valores: { observacion: string; documentoUrl: string },
): Errores {
  if (!motivo) return { motivo: "Elija el motivo de la justificación." };
  const errores: Errores = {};
  if (motivo.requiereObservacion && !valores.observacion.trim()) {
    errores.observacion = "Indique la observación del motivo «Otro».";
  }
  if (motivo.requiereDocumento && !valores.documentoUrl.trim()) {
    errores.documento = "Para este motivo debe adjuntar un documento.";
  }
  return errores;
}

function Formulario({
  sesion,
  onOpenChange,
}: {
  sesion: Sesion;
  onOpenChange: (a: boolean) => void;
}) {
  const { data: motivos = [], isLoading: cargando, isError } = useMotivosJustificacion();
  const justificar = useSolicitarJustificacion();
  const [codigo, setCodigo] = React.useState<string | undefined>();
  const [observacion, setObservacion] = React.useState("");
  const [documentoUrl, setDocumentoUrl] = React.useState("");
  const [errores, setErrores] = React.useState<Errores>({});

  const motivo = motivos.find((m) => m.codigo === codigo);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const encontrados = validarJustificacion(motivo, { observacion, documentoUrl });
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0 || !motivo) return;
    justificar.mutate(
      {
        id: sesion.id,
        motivo: motivo.codigo,
        observacion: motivo.requiereObservacion ? observacion.trim() : undefined,
        documentoUrl: documentoUrl.trim() || undefined,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Motivo *</Label>
        <SelectOption
          options={motivos.map((m) => ({ value: m.codigo, label: m.etiqueta }))}
          value={codigo}
          onSelect={(valor) => {
            setCodigo(valor);
            setErrores({});
          }}
          placeholder={cargando ? "Cargando motivos..." : "Elija el motivo"}
          disabled={cargando || justificar.isPending}
        />
        {isError && (
          <p className="text-destructive text-xs font-medium">
            No se pudieron cargar los motivos. Cierre e intente de nuevo.
          </p>
        )}
        {errores.motivo && <p className="text-destructive text-xs font-medium">{errores.motivo}</p>}
      </div>

      {motivo?.aviso && (
        <p
          role="note"
          className="border-warning/30 bg-warning/10 text-foreground rounded-xl border p-3 text-xs"
        >
          {motivo.aviso}
        </p>
      )}

      {motivo?.requiereObservacion && (
        <div className="space-y-1.5">
          <Label htmlFor="observacion-justificacion" className="text-sm font-medium">
            Observación *
          </Label>
          <Textarea
            id="observacion-justificacion"
            value={observacion}
            onChange={(e) => {
              setObservacion(e.target.value);
              setErrores((prev) => ({ ...prev, observacion: undefined }));
            }}
            maxLength={500}
            disabled={justificar.isPending}
            aria-invalid={Boolean(errores.observacion)}
          />
          {errores.observacion && (
            <p className="text-destructive text-xs font-medium">{errores.observacion}</p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="documento-justificacion" className="text-sm font-medium">
          Enlace del documento {motivo?.requiereDocumento ? "*" : "(opcional)"}
        </Label>
        <Input
          id="documento-justificacion"
          value={documentoUrl}
          onChange={(e) => {
            setDocumentoUrl(e.target.value);
            setErrores((prev) => ({ ...prev, documento: undefined }));
          }}
          placeholder="https://…"
          maxLength={255}
          disabled={justificar.isPending}
          aria-invalid={Boolean(errores.documento)}
        />
        {errores.documento && (
          <p className="text-destructive text-xs font-medium">{errores.documento}</p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={justificar.isPending || cargando}
          className="min-h-10 gap-2"
        >
          {justificar.isPending && <Spinner className="size-4" />}
          Enviar justificación
        </Button>
      </div>
    </form>
  );
}

export function ModalJustificar({ sesion, onOpenChange }: ModalJustificarProps) {
  return (
    <Modal
      open={Boolean(sesion)}
      onOpenChange={onOpenChange}
      title="Solicitar justificación"
      description={sesion ? `${sesion.cursoNombre} · ${sesion.seccionNombre}` : undefined}
      icon={FileEditIcon}
      size="md"
    >
      {sesion && <Formulario key={sesion.id} sesion={sesion} onOpenChange={onOpenChange} />}
    </Modal>
  );
}
