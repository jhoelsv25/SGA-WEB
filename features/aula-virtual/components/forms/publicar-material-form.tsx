"use client";

import * as React from "react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/common/file-dropzone";
import { usePublicarMaterial, useReemplazarMaterial } from "../../hooks";
import { TIPOS_MATERIAL, esTipoEnlace } from "../../consts";
import type { Material } from "../../types";

export interface PublicarMaterialFormProps {
  material: Material;
  tamanoMaximoMb: number;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function PublicarMaterialForm({
  material,
  tamanoMaximoMb,
  onCancel,
  onSuccess,
}: PublicarMaterialFormProps) {
  const [enlace, setEnlace] = React.useState("");
  const [archivo, setArchivo] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const publicar = usePublicarMaterial();
  const reemplazar = useReemplazarMaterial();
  const yaPublicado = Boolean(material.publicadoEn);
  const mutacion = yaPublicado ? reemplazar : publicar;
  const tipoInfo = TIPOS_MATERIAL.find((t) => t.value === material.tipo);
  const esEnlace = esTipoEnlace(material.tipo);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (esEnlace && !/^https?:\/\/\S+$/i.test(enlace.trim())) {
      setError("Ingrese un enlace válido que empiece con http:// o https://.");
      return;
    }
    if (!esEnlace && !archivo) {
      setError("Adjunte el archivo del material.");
      return;
    }
    mutacion.mutate(
      { id: material.id, enlace: enlace.trim() || undefined, archivo },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      {esEnlace ? (
        <div className="space-y-1.5">
          <Label htmlFor="material-enlace" className="text-sm font-medium">
            Enlace *
          </Label>
          <Input
            id="material-enlace"
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
            placeholder="https://…"
            maxLength={500}
            disabled={mutacion.isPending}
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
            disabled={mutacion.isPending}
          />
        </div>
      )}
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={mutacion.isPending} className="min-h-10 gap-2">
          {mutacion.isPending && <Spinner className="size-4" />}
          {yaPublicado ? "Reemplazar" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
