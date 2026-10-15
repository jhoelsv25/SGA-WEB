"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Image01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { FileDropzone } from "@/components/common/file-dropzone";
import {
  ADJUNTO_SOLICITUD_ACCEPT,
  ADJUNTO_SOLICITUD_TAMANO_MAXIMO_BYTES,
  MENSAJES_CONSOLIDADO,
} from "../../consts";
import {
  solicitudRevisionSchema,
  type SolicitudRevisionFormValues,
} from "./solicitud-revision.schema";

interface SolicitudRevisionFormProps {
  cargando: boolean;
  onSubmit: (valores: SolicitudRevisionFormValues, adjunto?: File) => void;
  onCancel: () => void;
}

/**
 * Formulario para el registro de solicitudes de revisión docente (HU3).
 * Incluye motivo obligatorio con límite de 1000 caracteres y adjunto opcional (PDF/PNG/JPG ≤ 5 MB).
 */
export function SolicitudRevisionForm({
  cargando,
  onSubmit,
  onCancel,
}: SolicitudRevisionFormProps) {
  const [adjunto, setAdjunto] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SolicitudRevisionFormValues>({
    resolver: zodResolver(solicitudRevisionSchema),
    defaultValues: {
      motivo: "",
    },
    mode: "onSubmit",
  });

  const textoActual = useWatch({
    control,
    name: "motivo",
    defaultValue: "",
  });
  const caracteresRestantes = Math.max(0, 1000 - (textoActual?.length || 0));

  // Genera y limpia la URL de vista previa para imágenes
  const handleFileSelect = (nuevoArchivo: File | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setAdjunto(nuevoArchivo);
    if (nuevoArchivo && nuevoArchivo.type.startsWith("image/")) {
      const url = URL.createObjectURL(nuevoArchivo);
      setPreviewUrl(url);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFormSubmit = (valores: SolicitudRevisionFormValues) => {
    onSubmit(valores, adjunto ?? undefined);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <div className="border-primary/20 bg-primary/5 text-primary rounded-xl border p-3 text-xs">
        <p className="font-semibold">Solicitud de revisión ante la Dirección</p>
        <p className="text-muted-foreground mt-0.5">
          Si considera que existe una sesión o ausencia calculada de forma incorrecta, detalle los
          motivos y adjunte los comprobantes necesarios para que el Director evalúe su reapertura.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="motivo" className="text-sm font-medium">
            Motivo de su solicitud *
          </Label>
          <span className="text-2xs text-muted-foreground tabular-nums">
            {caracteresRestantes} caracteres restantes
          </span>
        </div>
        <Textarea
          id="motivo"
          placeholder="Describa detalladamente el motivo de su solicitud (ej. El 12/06 firmé en el kiosko; adjunto foto de la pizarra)..."
          disabled={cargando}
          rows={4}
          aria-invalid={Boolean(errors.motivo)}
          aria-describedby={errors.motivo ? "motivo-error" : "motivo-ayuda"}
          {...register("motivo")}
        />
        <p id="motivo-ayuda" className="text-muted-foreground text-xs">
          Sea preciso con fechas, sesiones o circunstancias. Esta información será evaluada por el
          Director del colegio.
        </p>
        {errors.motivo && (
          <p id="motivo-error" className="text-destructive text-xs font-medium">
            {errors.motivo.message ?? MENSAJES_CONSOLIDADO.SOLICITUD_SIN_MOTIVO}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Comprobante o evidencia (opcional)</Label>
        <FileDropzone
          file={adjunto}
          onFileSelect={handleFileSelect}
          accept={ADJUNTO_SOLICITUD_ACCEPT}
          acceptedFormats={["PDF", "PNG", "JPG"]}
          maxSizeBytes={ADJUNTO_SOLICITUD_TAMANO_MAXIMO_BYTES}
          sizeErrorMessage="El archivo supera el tamaño máximo permitido de 5 MB."
          formatErrorMessage="Formato no válido. Solo se admiten archivos PDF, PNG o JPG."
          title="Haz clic para seleccionar o arrastra el archivo"
          description="Comprobante en formato PDF o imagen PNG/JPG (máx. 5 MB)"
          disabled={cargando}
        />

        {previewUrl && (
          <div className="border-border/60 bg-muted/20 relative mt-2 flex items-center gap-3 rounded-xl border p-2.5">
            <div className="border-border/60 relative size-16 shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={previewUrl}
                alt="Vista previa del adjunto"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <HugeiconsIcon icon={Image01Icon} className="text-primary size-3.5" />
                <span className="truncate">Vista previa de imagen</span>
              </div>
              <p className="text-muted-foreground text-2xs truncate">{adjunto?.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={cargando}
          className="h-10 min-h-10 gap-1.5 rounded-full px-4 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={cargando}
          className="h-10 min-h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-xs"
        >
          {cargando ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={SentIcon} className="size-3.5" />
          )}
          <span>{cargando ? "Enviando solicitud..." : "Enviar solicitud"}</span>
        </Button>
      </div>
    </form>
  );
}
