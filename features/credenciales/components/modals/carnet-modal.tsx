"use client";

import * as React from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/common/spinner";
import { formatDate } from "@/lib/formatters/date";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  IdCardIcon,
  PrinterIcon,
  Cancel01Icon,
  UserIcon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import { useCarneDatosQuery } from "../../hooks/use-credenciales";
import { credencialesApi } from "../../api/credenciales.api";

interface CarnetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId: string;
}

export function CarnetModal({ open, onOpenChange, personaId }: CarnetModalProps) {
  const { data: carne, isLoading, error } = useCarneDatosQuery(open ? personaId : undefined);
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false);
  const printIframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    let isMounted = true;
    if (carne?.codigoCredencial) {
      QRCode.toDataURL(carne.codigoCredencial, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 160,
        color: {
          dark: "#7a1228",
          light: "#ffffff",
        },
      })
        .then((url) => {
          if (isMounted) setQrDataUrl(url);
        })
        .catch(() => {
          if (isMounted) setQrDataUrl(null);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [carne?.codigoCredencial]);

  const handleDownloadPdf = async () => {
    if (!personaId) return;
    try {
      setIsDownloadingPdf(true);
      const filename = carne?.codigoCredencial
        ? `carnet-${carne.codigoCredencial}.pdf`
        : `carnet-${personaId}.pdf`;
      await credencialesApi.descargarCarnePdf(personaId, filename);
    } catch (err) {
      console.error("Error al descargar carné PDF:", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrintOfficialPdf = async () => {
    if (!personaId) return;
    try {
      const blobUrl = await credencialesApi.obtenerCarnePdfBlobUrl(personaId);
      if (printIframeRef.current) {
        printIframeRef.current.src = blobUrl;
        printIframeRef.current.onload = () => {
          printIframeRef.current?.contentWindow?.focus();
          printIframeRef.current?.contentWindow?.print();
        };
      } else {
        window.open(blobUrl, "_blank");
      }
    } catch {
      window.print();
    }
  };

  const nombreColegio = carne?.institucion?.nombre || "I.E. De Mujeres Nuestra Señora del Carmen";
  const distritoColegio = carne?.institucion?.distrito || "Lircay";
  const iniciales = carne?.nombreCompleto
    ? carne.nombreCompleto
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "IE";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Carné Oficial de Marcación y Asistencia"
      description="Credencial digital oficial generada por el servidor para marcación en kioskos escolares."
      icon={IdCardIcon}
      size="lg"
    >
      {isLoading ? (
        <div className="flex h-56 items-center justify-center">
          <Spinner className="text-primary h-6 w-6" />
        </div>
      ) : error || !carne ? (
        <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border p-4 text-center text-xs">
          No se pudo cargar la credencial activa para generar el carné. Asegúrese de que la persona
          cuenta con una credencial válida.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Vista previa del carné oficial (PVC estándar 85.6mm x 54mm) */}
          <div className="flex justify-center p-2">
            <div
              id="carnet-printable"
              className="border-border/80 from-card via-background to-muted/30 relative w-full max-w-105 overflow-hidden rounded-2xl border-2 bg-linear-to-br p-4 shadow-xl transition-all print:m-0 print:border-none print:shadow-none"
              style={{
                aspectRatio: "1.586 / 1",
              }}
            >
              {/* Franja superior con acento institucional */}
              <div className="from-primary via-primary/80 absolute top-0 right-0 left-0 h-1.5 bg-linear-to-r to-amber-600" />

              {/* Cabecera del carné con logo oficial de la I.E. */}
              <div className="border-border/60 flex items-center justify-between border-b pt-1 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white p-0.5 shadow-xs dark:bg-slate-900">
                    <Image
                      src={carne.institucion?.logoUrl || "/logo.png"}
                      alt="Logo Institucional"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div className="max-w-52">
                    <h3 className="text-foreground line-clamp-1 text-[11px] font-black tracking-tight uppercase">
                      {nombreColegio}
                    </h3>
                    <p className="text-muted-foreground text-[8.5px] font-medium tracking-wide uppercase">
                      República del Perú · MINEDU
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[9.5px] font-bold tracking-wider uppercase ${
                    carne.tipoRol.toLowerCase() === "estudiante"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {carne.tipoRol}
                </Badge>
              </div>

              {/* Cuerpo del carné: Avatar + Datos + QR */}
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 pt-3">
                {/* 1. Avatar / Foto oficial */}
                <div className="flex flex-col items-center">
                  <div className="bg-muted border-primary/30 dark:border-primary/40 relative size-16 shrink-0 overflow-hidden rounded-xl border-2 shadow-xs">
                    {carne.fotoUrl ? (
                      <Avatar className="size-full rounded-none">
                        <AvatarImage
                          src={carne.fotoUrl}
                          alt={carne.nombreCompleto}
                          className="size-full rounded-none object-cover"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground rounded-none font-bold">
                          {iniciales}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="bg-primary/10 text-primary flex size-full flex-col items-center justify-center">
                        <HugeiconsIcon icon={UserIcon} className="size-8" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Datos personales y código de marcación */}
                <div className="space-y-1">
                  <p className="text-foreground line-clamp-2 text-xs leading-snug font-bold">
                    {carne.nombreCompleto}
                  </p>
                  <p className="text-muted-foreground font-mono text-[10px]">
                    <span className="uppercase">{carne.tipoDocumento}</span>:{" "}
                    <strong className="text-foreground">{carne.numeroDocumento}</strong>
                  </p>
                  {carne.codigoInstitucional && (
                    <p className="text-muted-foreground text-[10px] font-medium">
                      {carne.tipoRol.toLowerCase() === "estudiante" ? "SIAGIE" : "Código"}:{" "}
                      <span className="text-foreground font-mono font-semibold">
                        {carne.codigoInstitucional}
                      </span>
                    </p>
                  )}
                  <div className="pt-0.5">
                    <span className="text-muted-foreground block text-[8px] tracking-wider uppercase">
                      Código de Marcación
                    </span>
                    <span className="text-primary font-mono text-[11px] font-bold">
                      {carne.codigoCredencial}
                    </span>
                  </div>
                </div>

                {/* 3. Código QR de alta precisión */}
                <div className="border-border/80 flex flex-col items-center justify-center rounded-xl border bg-white p-1.5 shadow-xs">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt={`QR Credencial ${carne.codigoCredencial}`}
                      className="size-20 object-contain"
                    />
                  ) : (
                    <div className="flex size-20 items-center justify-center">
                      <Spinner className="text-muted-foreground size-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Pie institucional */}
              <div className="border-border/40 text-muted-foreground absolute right-4 bottom-2 left-4 flex items-center justify-between border-t pt-1 text-[7.5px]">
                <span>{distritoColegio} · Angaraes · Huancavelica</span>
                <span className="font-mono">Emisión: {formatDate(carne.emitidaEn)}</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground text-center text-[11px]">
            * Por seguridad institucional, el PIN no se imprime en el carné escolar ni en ningún
            soporte físico. El documento PDF oficial se descarga directamente del servidor.
          </p>

          {/* Botones de acción conectados a endpoints del backend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="gap-1.5 text-xs"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
              Cerrar
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrintOfficialPdf}
                className="gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={PrinterIcon} className="size-4" />
                Imprimir Carné
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs font-semibold shadow-md"
              >
                <HugeiconsIcon icon={Download01Icon} className="size-4 text-amber-400" />
                {isDownloadingPdf ? "Generando PDF..." : "Descargar Carné PDF"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Iframe oculto para impresión nativa del PDF oficial generado en el backend */}
      <iframe
        ref={printIframeRef}
        title="Impresión Carné PDF Oficial"
        className="hidden"
        style={{ display: "none" }}
      />
    </Modal>
  );
}

export const CarneModal = CarnetModal;
