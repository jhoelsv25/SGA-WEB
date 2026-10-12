"use client";

import * as React from "react";
import { FileAddIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectOption } from "@/components/common/select";
import { FileDropzone } from "@/components/common/file-dropzone";
import { usePublicarExtra } from "../hooks";
import { TIPOS_MATERIAL, esTipoEnlace } from "../consts";
import type { TipoMaterial } from "../types";

interface PublicarExtraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadId: string;
  tamanoMaximoMb: number;
}

function FormularioExtra({
  unidadId,
  tamanoMaximoMb,
  onCerrar,
}: {
  unidadId: string;
  tamanoMaximoMb: number;
  onCerrar: () => void;
}) {
  const [titulo, setTitulo] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoMaterial>("documento");
  const [enlace, setEnlace] = React.useState("");
  const [archivo, setArchivo] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const publicarExtra = usePublicarExtra();
  const tipoInfo = TIPOS_MATERIAL.find((t) => t.value === tipo);
  const esEnlace = esTipoEnlace(tipo);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titulo.trim()) {
      setError("Ingrese el título del material.");
      return;
    }
    if (esEnlace && !/^https?:\/\/\S+$/i.test(enlace.trim())) {
      setError("Ingrese un enlace válido que empiece con http:// o https://.");
      return;
    }
    if (!esEnlace && !archivo) {
      setError("Adjunte el archivo del material.");
      return;
    }
    publicarExtra.mutate(
      {
        unidadId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        tipo,
        enlace: enlace.trim() || undefined,
        archivo,
      },
      { onSuccess: onCerrar },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="extra-titulo" className="text-sm font-medium">
          Título *
        </Label>
        <Input
          id="extra-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={150}
          disabled={publicarExtra.isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="extra-descripcion" className="text-sm font-medium">
          Descripción (opcional)
        </Label>
        <Textarea
          id="extra-descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={1000}
          disabled={publicarExtra.isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Tipo *</Label>
        <SelectOption
          options={TIPOS_MATERIAL.map((t) => ({ value: t.value, label: t.label }))}
          value={tipo}
          onSelect={(v) => setTipo(v as TipoMaterial)}
          disabled={publicarExtra.isPending}
        />
      </div>
      {esEnlace ? (
        <div className="space-y-1.5">
          <Label htmlFor="extra-enlace" className="text-sm font-medium">
            Enlace *
          </Label>
          <Input
            id="extra-enlace"
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
            placeholder="https://…"
            maxLength={500}
            disabled={publicarExtra.isPending}
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Archivo * ({tipoInfo?.formatos})</Label>
          <FileDropzone
            file={archivo}
            onFileSelect={setArchivo}
            accept={tipoInfo?.accept}
            acceptedFormats={[tipoInfo?.formatos ?? ""]}
            maxSizeBytes={tamanoMaximoMb * 1024 * 1024}
            sizeErrorMessage={`El archivo supera el máximo de ${tamanoMaximoMb} MB.`}
            formatErrorMessage="Formato no permitido para el tipo de material elegido."
            disabled={publicarExtra.isPending}
          />
        </div>
      )}
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={publicarExtra.isPending} className="min-h-10 gap-2">
          {publicarExtra.isPending && <Spinner className="size-4" />}
          Publicar
        </Button>
      </div>
    </form>
  );
}

export function PublicarExtraModal({
  open,
  onOpenChange,
  unidadId,
  tamanoMaximoMb,
}: PublicarExtraModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Publicar material extra"
      description="Se ve igual que los demás, pero no cuenta en el IGM."
      icon={FileAddIcon}
      size="md"
    >
      {open && (
        <FormularioExtra
          key={unidadId}
          unidadId={unidadId}
          tamanoMaximoMb={tamanoMaximoMb}
          onCerrar={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
