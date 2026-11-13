"use client";

import * as React from "react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { guardarArchivoEnNavegador } from "@/features/consolidado-docente";
import { resolveBackendUrl } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/formatters/date";
import { descargarProtocoloPdf } from "../api";
import { useSubirArchivoFirmado } from "../hooks";
import type { ArchivoFirmado } from "../types";
import { MensajeError } from "./campo";

const TIPOS_ACEPTADOS = ["application/pdf", "image/png", "image/jpeg"];
const TAMANO_MAXIMO = 5 * 1024 * 1024;

interface PanelProtocoloProps {
  observacionId: string;
  archivos: ArchivoFirmado[];
  puedeSubir: boolean;
}

/** Protocolo de retroalimentación: PDF generado por la API y escaneo firmado (PDF, PNG o JPG). */
export function PanelProtocolo({ observacionId, archivos, puedeSubir }: PanelProtocoloProps) {
  const subir = useSubirArchivoFirmado();
  const [descargando, setDescargando] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const entrada = React.useRef<HTMLInputElement>(null);

  const descargar = async () => {
    setDescargando(true);
    try {
      guardarArchivoEnNavegador(await descargarProtocoloPdf(observacionId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo descargar el protocolo.");
    } finally {
      setDescargando(false);
    }
  };

  const alElegir = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo) return;
    if (!TIPOS_ACEPTADOS.includes(archivo.type) || archivo.size > TAMANO_MAXIMO) {
      setError("El archivo debe ser PDF, PNG o JPG de hasta 5 MB.");
      return;
    }
    setError(undefined);
    subir.mutate({ id: observacionId, archivo });
  };

  return (
    <section aria-labelledby="titulo-protocolo" className="space-y-3">
      <h2 id="titulo-protocolo" className="text-base font-semibold">
        Protocolo de retroalimentación
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="min-h-11 gap-2"
          disabled={descargando}
          onClick={() => void descargar()}
        >
          {descargando && <Spinner className="size-4" />}
          Descargar protocolo (PDF)
        </Button>
        {puedeSubir && (
          <>
            <input
              ref={entrada}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              className="sr-only"
              aria-label="Archivo firmado"
              onChange={alElegir}
            />
            <Button
              type="button"
              className="min-h-11 gap-2"
              disabled={subir.isPending}
              onClick={() => entrada.current?.click()}
            >
              {subir.isPending && <Spinner className="size-4" />}
              Subir archivo firmado
            </Button>
          </>
        )}
      </div>
      {error && <MensajeError>{error}</MensajeError>}
      {archivos.filter((a) => !a.retirado).length === 0 ? (
        <p className="text-muted-foreground text-sm">Aún no se subió el protocolo firmado.</p>
      ) : (
        <ul className="space-y-1.5 text-sm">
          {archivos
            .filter((a) => !a.retirado)
            .map((a) => (
              <li key={a.id}>
                <a
                  href={resolveBackendUrl(a.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-medium underline"
                >
                  {a.nombreOriginal ?? "Archivo firmado"}
                </a>
                <span className="text-muted-foreground"> · {formatDate(a.creadoEn)}</span>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
