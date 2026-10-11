"use client";

import * as React from "react";
import { CloudUploadIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/common/file-dropzone";
import { usePublicarMaterial, useReemplazarMaterial } from "../hooks";
import { TIPOS_MATERIAL, esTipoEnlace } from "../consts";
import type { Material } from "../types";

interface PublicarMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
  tamanoMaximoMb: number;
}

function FormularioPublicar({
  material,
  tamanoMaximoMb,
  onCerrar,
}: {
  material: Material;
  tamanoMaximoMb: number;
  onCerrar: () => void;
}) {
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
    if (esEnlace && !enlace.trim()) {
      setError("Ingrese un enlace válido que empiece con http:// o https://.");
      return;
    }
    if (!esEnlace && !archivo) {
      setError("Adjunte el archivo del material.");
      return;
    }
    mutacion.mutate(
      { id: material.id, enlace: enlace.trim() || undefined, archivo },
      { onSuccess: onCerrar },
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
            disabled={mutacion.isPending}
          />
        </div>
      )}
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
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

export function PublicarMaterialModal({
  open,
  onOpenChange,
  material,
  tamanoMaximoMb,
}: PublicarMaterialModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={material?.publicadoEn ? "Reemplazar material" : "Publicar material"}
      description={material?.titulo}
      icon={CloudUploadIcon}
      size="md"
    >
      {material && (
        <FormularioPublicar
          key={material.id}
          material={material}
          tamanoMaximoMb={tamanoMaximoMb}
          onCerrar={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
