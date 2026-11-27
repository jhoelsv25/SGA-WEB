"use client";

import * as React from "react";
import Image from "next/image";
import { Download01Icon, Pdf01Icon, PrinterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/common/spinner";
import { useInstitucionQuery } from "@/features/institucion";
import { obtenerConstanciaPdfBlobUrl } from "../../api";

interface ConstanciaPdfViewerContentProps {
  matriculaId: string;
  matriculaCodigo: string;
  onClose: () => void;
}

function ConstanciaPdfViewerContent({
  matriculaId,
  matriculaCodigo,
  onClose,
}: ConstanciaPdfViewerContentProps) {
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const { data: institucion } = useInstitucionQuery();

  const subtituloInstitucion = React.useMemo(() => {
    const parts = [
      institucion?.ugelDre || "UGEL Angaraes · DRE Huancavelica",
      institucion?.distrito || "Lircay",
    ].filter(Boolean);
    return parts.join(" · ");
  }, [institucion]);

  React.useEffect(() => {
    let isMounted = true;
    let activeUrl: string | null = null;

    obtenerConstanciaPdfBlobUrl(matriculaId)
      .then((url) => {
        if (!isMounted) {
          window.URL.revokeObjectURL(url);
          return;
        }
        activeUrl = url;
        setPdfUrl(url);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error al obtener PDF de constancia:", err);
        setError("No se pudo generar la constancia oficial. Intente nuevamente.");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (activeUrl) {
        window.URL.revokeObjectURL(activeUrl);
      }
    };
  }, [matriculaId]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `constancia-matricula-${matriculaCodigo}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div className="space-y-4 py-2">
      {/* Cabecera institucional de la constancia */}
      <div className="border-border/80 bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1 shadow-xs dark:bg-slate-900">
            <Image
              src="/logo.png"
              alt="Logo Institucional"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-foreground text-sm font-bold tracking-tight">
              {institucion?.nombre || "I.E. De Mujeres Nuestra Señora del Carmen"}
            </p>
            <p className="text-muted-foreground text-xs">{subtituloInstitucion}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary text-xs font-semibold"
          >
            Matrícula: {matriculaCodigo}
          </Badge>
          <Badge
            variant="outline"
            className="border-amber-600/20 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
          >
            Válido con QR
          </Badge>
        </div>
      </div>

      {/* Visor de Documento o Estados de Carga/Error */}
      <div className="bg-muted/20 relative flex min-h-130 w-full flex-col items-center justify-center overflow-hidden rounded-xl border">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <Spinner className="text-primary size-8" />
            <div className="space-y-1">
              <p className="text-foreground text-sm font-semibold">
                Generando Constancia Oficial...
              </p>
              <p className="text-muted-foreground max-w-sm text-xs">
                Estampando membrete institucional, datos del estudiante y código QR de validación.
              </p>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full bg-rose-500/10 p-3 text-rose-600">
              <HugeiconsIcon icon={Pdf01Icon} className="size-6" />
            </div>
            <p className="text-sm font-semibold text-rose-600">{error}</p>
          </div>
        )}

        {pdfUrl && !isLoading && (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            title={`Constancia de Matrícula ${matriculaCodigo}`}
            className="h-130 w-full border-none"
          />
        )}
      </div>

      {/* Barra de Acciones */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
          Cerrar
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            disabled={!pdfUrl || isLoading}
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={PrinterIcon} className="size-4" />
            Imprimir
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownload}
            disabled={!pdfUrl || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs font-semibold shadow-sm"
          >
            <HugeiconsIcon icon={Download01Icon} className="size-4" />
            Descargar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface ModalConstanciaPdfProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matriculaId: string;
  matriculaCodigo: string;
  estudianteNombre?: string;
}

export function ModalConstanciaPdf({
  open,
  onOpenChange,
  matriculaId,
  matriculaCodigo,
  estudianteNombre,
}: ModalConstanciaPdfProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Constancia Oficial de Matrícula"
      description={`Documento oficial emitido con membrete institucional y código QR para ${estudianteNombre || "el estudiante"}.`}
      icon={Pdf01Icon}
      size="xl"
    >
      {open && (
        <ConstanciaPdfViewerContent
          key={matriculaId}
          matriculaId={matriculaId}
          matriculaCodigo={matriculaCodigo}
          onClose={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
