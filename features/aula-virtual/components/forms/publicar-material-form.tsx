"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Link01Icon, Upload01Icon, Video01Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/common/file-dropzone";
import { cn } from "@/lib/utils";
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
  const esVideo = material.tipo === "video";
  const esEnlacePuro = esTipoEnlace(material.tipo);

  // Para videos, por defecto recomendamos enlace (YouTube/Drive) para evitar saturar el servidor
  const [modoPublicacion, setModoPublicacion] = React.useState<"enlace" | "archivo">(
    esVideo || esEnlacePuro ? "enlace" : "archivo",
  );

  const [enlace, setEnlace] = React.useState("");
  const [archivo, setArchivo] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const publicar = usePublicarMaterial();
  const reemplazar = useReemplazarMaterial();
  const yaPublicado = Boolean(material.publicadoEn);
  const mutacion = yaPublicado ? reemplazar : publicar;
  const tipoInfo = TIPOS_MATERIAL.find((t) => t.value === material.tipo);

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (modoPublicacion === "enlace") {
      if (!/^https?:\/\/\S+$/i.test(enlace.trim())) {
        setError("Ingrese un enlace válido que empiece con http:// o https://.");
        return;
      }
    } else {
      if (!archivo) {
        setError("Adjunte el archivo del material.");
        return;
      }
    }

    mutacion.mutate(
      {
        id: material.id,
        enlace: modoPublicacion === "enlace" ? enlace.trim() : undefined,
        archivo: modoPublicacion === "archivo" ? archivo : null,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      {/* Selector de modo para videos (Enlace vs Archivo) */}
      {esVideo && (
        <div className="bg-muted/70 flex items-center rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setModoPublicacion("enlace");
              setError(null);
            }}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all",
              modoPublicacion === "enlace"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <HugeiconsIcon icon={Link01Icon} size={15} />
            <span>Enlace web (YouTube / Drive)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setModoPublicacion("archivo");
              setError(null);
            }}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all",
              modoPublicacion === "archivo"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <HugeiconsIcon icon={Video01Icon} size={15} />
            <span>Subir archivo MP4</span>
          </button>
        </div>
      )}

      {modoPublicacion === "enlace" ? (
        <div className="space-y-1.5">
          <Label htmlFor="material-enlace" className="text-sm font-medium">
            {esVideo ? "URL del video * (YouTube, Google Drive, Vimeo, etc.)" : "Enlace *"}
          </Label>
          <Input
            id="material-enlace"
            value={enlace}
            onChange={(e) => {
              setEnlace(e.target.value);
              if (error) setError(null);
            }}
            placeholder={
              esVideo
                ? "https://www.youtube.com/watch?v=... o https://drive.google.com/..."
                : "https://…"
            }
            maxLength={500}
            disabled={mutacion.isPending}
          />
          {esVideo && (
            <p className="text-muted-foreground text-xs">
              💡 Recomendado: Pega el enlace de YouTube o Drive para que los estudiantes lo vean
              directamente sin saturar el almacenamiento del colegio.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Archivo * ({tipoInfo?.formatos ?? "MP4"})</Label>
          <FileDropzone
            file={archivo}
            onFileSelect={(f) => {
              setArchivo(f);
              if (error) setError(null);
            }}
            accept={tipoInfo?.accept}
            acceptedFormats={[tipoInfo?.formatos ?? ""]}
            maxSizeBytes={tamanoMaximoMb * 1024 * 1024}
            description={`Archivos ${tipoInfo?.formatos ?? ""}`}
            sizeErrorMessage={`El archivo supera el máximo de ${tamanoMaximoMb} MB.`}
            formatErrorMessage="Formato no permitido para el tipo de material elegido."
            disabled={mutacion.isPending}
          />
        </div>
      )}

      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10 gap-2" onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
          <span>Cancelar</span>
        </Button>
        <Button type="submit" disabled={mutacion.isPending} className="min-h-10 gap-2">
          {mutacion.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={Upload01Icon} size={16} />
          )}
          <span>{yaPublicado ? "Reemplazar material" : "Publicar material"}</span>
        </Button>
      </div>
    </form>
  );
}
