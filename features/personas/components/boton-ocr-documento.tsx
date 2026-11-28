"use client";

import * as React from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileUploadIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { personasApi } from "../api/personas.api";
import type { OcrDocumentoPersona } from "../types/personas.types";

const MAX_BYTES_OCR = 10 * 1024 * 1024;
const TIPOS_ACEPTADOS =
  "image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf";

interface BotonOcrDocumentoProps {
  onDatosExtraidos: (datos: OcrDocumentoPersona) => void;
  disabled?: boolean;
}

/**
 * Botón reutilizable que lee una imagen o PDF de DNI mediante OCR
 * y entrega los campos extraídos para autocompletar formularios de persona.
 */
export function BotonOcrDocumento({ onDatosExtraidos, disabled = false }: BotonOcrDocumentoProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [leyendo, setLeyendo] = React.useState(false);

  const manejarArchivo = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!archivo) return;

    if (archivo.size > MAX_BYTES_OCR) {
      toast.error("El archivo supera el límite de 10 MB para lectura OCR.");
      return;
    }

    setLeyendo(true);
    try {
      const datos = await personasApi.extraerDatosDocumentoOcr(archivo);
      const encontrados = [
        datos.dni,
        datos.nombres,
        datos.apellidoPaterno,
        datos.apellidoMaterno,
        datos.fechaNacimiento,
        datos.sexo,
      ].filter(Boolean).length;

      if (encontrados === 0) {
        toast.warning("No se pudieron leer datos claros del documento. Intenta con otra imagen.");
        return;
      }

      onDatosExtraidos(datos);
      toast.success("Datos del documento completados automáticamente. Verifica antes de guardar.");
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "No se pudo leer el documento con OCR.";
      toast.error(mensaje);
    } finally {
      setLeyendo(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || leyendo}
        onClick={() => inputRef.current?.click()}
        className="h-8 gap-1.5 text-xs"
      >
        {leyendo ? (
          <Spinner className="size-3.5" />
        ) : (
          <HugeiconsIcon icon={FileUploadIcon} className="size-3.5" />
        )}
        {leyendo ? "Leyendo DNI..." : "Autocompletar con DNI (OCR)"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={TIPOS_ACEPTADOS}
        className="hidden"
        onChange={manejarArchivo}
      />
    </>
  );
}
