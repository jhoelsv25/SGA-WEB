"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Link01Icon, Upload01Icon, Video01Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectOption } from "@/components/common/select";
import { FileDropzone } from "@/components/common/file-dropzone";
import { cn } from "@/lib/utils";
import { usePublicarExtra } from "../../hooks";
import { TIPOS_MATERIAL, esTipoEnlace } from "../../consts";
import type { TipoMaterial } from "../../types";

export interface PublicarExtraFormProps {
  unidadId: string;
  tamanoMaximoMb: number;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function PublicarExtraForm({
  unidadId,
  tamanoMaximoMb,
  onCancel,
  onSuccess,
}: PublicarExtraFormProps) {
  const [titulo, setTitulo] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoMaterial>("documento");
  const [modoVideo, setModoVideo] = React.useState<"enlace" | "archivo">("enlace");
  const [enlace, setEnlace] = React.useState("");
  const [archivo, setArchivo] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const publicarExtra = usePublicarExtra();
  const tipoInfo = TIPOS_MATERIAL.find((t) => t.value === tipo);
  const esEnlace = esTipoEnlace(tipo);
  const esVideo = tipo === "video";
  const requiereEnlace = esEnlace || (esVideo && modoVideo === "enlace");

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titulo.trim()) {
      setError("Ingrese el título del material.");
      return;
    }
    if (requiereEnlace && !/^https?:\/\/\S+$/i.test(enlace.trim())) {
      setError("Ingrese un enlace válido que empiece con http:// o https://.");
      return;
    }
    if (!requiereEnlace && !archivo) {
      setError("Adjunte el archivo del material.");
      return;
    }
    publicarExtra.mutate(
      {
        unidadId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        tipo,
        enlace: requiereEnlace ? enlace.trim() : undefined,
        archivo: requiereEnlace ? null : archivo,
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
      <div className="space-y-1.5">
        <Label htmlFor="extra-titulo" className="text-sm font-medium">
          Título *
        </Label>
        <Input
          id="extra-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Lectura de reforzamiento sobre los sacramentos"
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
          placeholder="Describe brevemente de qué trata este material de apoyo..."
          maxLength={1000}
          disabled={publicarExtra.isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Tipo *</Label>
        <SelectOption
          options={TIPOS_MATERIAL.map((t) => ({ value: t.value, label: t.label }))}
          value={tipo}
          onSelect={(v) => {
            setTipo(v as TipoMaterial);
            setError(null);
          }}
          disabled={publicarExtra.isPending}
        />
      </div>

      {/* Selector de modo para video */}
      {esVideo && (
        <div className="bg-muted/70 flex items-center rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setModoVideo("enlace");
              setError(null);
            }}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all",
              modoVideo === "enlace"
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
              setModoVideo("archivo");
              setError(null);
            }}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all",
              modoVideo === "archivo"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <HugeiconsIcon icon={Video01Icon} size={15} />
            <span>Subir archivo MP4</span>
          </button>
        </div>
      )}

      {requiereEnlace ? (
        <div className="space-y-1.5">
          <Label htmlFor="extra-enlace" className="text-sm font-medium">
            {esVideo ? "URL del video * (YouTube, Google Drive, Vimeo, etc.)" : "Enlace *"}
          </Label>
          <Input
            id="extra-enlace"
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
            disabled={publicarExtra.isPending}
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
          <Label className="text-sm font-medium">Archivo * ({tipoInfo?.formatos})</Label>
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
            disabled={publicarExtra.isPending}
          />
        </div>
      )}
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10 gap-2" onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
          <span>Cancelar</span>
        </Button>
        <Button type="submit" disabled={publicarExtra.isPending} className="min-h-10 gap-2">
          {publicarExtra.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={Upload01Icon} size={16} />
          )}
          <span>Publicar material</span>
        </Button>
      </div>
    </form>
  );
}
