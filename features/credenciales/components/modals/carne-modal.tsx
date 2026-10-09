"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { IdCardIcon, PrinterIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useCarneDatosQuery } from "../../hooks/use-credenciales";

interface CarneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId: string;
}

export function CarneModal({ open, onOpenChange, personaId }: CarneModalProps) {
  const { data: carne, isLoading, error } = useCarneDatosQuery(open ? personaId : undefined);
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    if (carne?.codigoCredencial) {
      QRCode.toDataURL(carne.codigoCredencial, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 160,
        color: {
          dark: "#0f172a",
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Carné de Marcación y Asistencia"
      description="Documento oficial con código QR para marcación en kioskos escolares (RF-007 HU5)."
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
          {/* Vista previa del carné (diseño PVC estándar 85.6mm x 54mm) */}
          <div className="flex justify-center p-2">
            <div
              id="carne-printable"
              className="border-border/80 from-card to-muted/40 relative w-full max-w-[380px] rounded-2xl border-2 bg-gradient-to-br p-5 shadow-xl transition-all print:m-0 print:border-none print:shadow-none"
              style={{
                aspectRatio: "1.586 / 1",
              }}
            >
              {/* Cabecera del carné */}
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black">
                    SGA
                  </div>
                  <div>
                    <h3 className="text-foreground text-xs font-black tracking-tight uppercase">
                      Colegio Secundaria
                    </h3>
                    <p className="text-muted-foreground text-[9px] font-medium tracking-widest uppercase">
                      República del Perú · MINEDU
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                    carne.tipoRol.toLowerCase() === "estudiante"
                      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {carne.tipoRol}
                </span>
              </div>

              {/* Cuerpo del carné: Foto, Datos y QR */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 pt-3">
                <div className="space-y-1.5">
                  <p className="text-foreground line-clamp-2 text-sm leading-snug font-bold">
                    {carne.nombreCompleto}
                  </p>
                  <p className="text-muted-foreground font-mono text-[11px]">
                    <span className="uppercase">{carne.tipoDocumento}</span>:{" "}
                    {carne.numeroDocumento}
                  </p>
                  {carne.codigoInstitucional && (
                    <p className="text-muted-foreground text-[11px] font-medium">
                      {carne.tipoRol.toLowerCase() === "estudiante" ? "SIAGIE" : "Código Docente"}:{" "}
                      <span className="text-foreground font-mono font-semibold">
                        {carne.codigoInstitucional}
                      </span>
                    </p>
                  )}
                  <div className="pt-1">
                    <span className="text-muted-foreground block text-[9px] tracking-wider uppercase">
                      Código de Marcación
                    </span>
                    <span className="text-primary font-mono text-xs font-bold">
                      {carne.codigoCredencial}
                    </span>
                  </div>
                </div>

                {/* Código QR vectorial */}
                <div className="border-border/80 flex flex-col items-center justify-center rounded-xl border bg-white p-2 shadow-sm">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt={`QR Credencial ${carne.codigoCredencial}`}
                      className="h-24 w-24 object-contain"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center">
                      <Spinner className="text-muted-foreground h-5 w-5" />
                    </div>
                  )}
                  <span className="pt-1 font-mono text-[8px] font-semibold text-slate-800">
                    ESCANEABLE
                  </span>
                </div>
              </div>

              {/* Pie institucional */}
              <div className="border-border/40 text-muted-foreground absolute right-5 bottom-2.5 left-5 flex items-center justify-between border-t pt-1.5 text-[8px]">
                <span>Válido para marcación en kiosko escolar</span>
                <span className="font-mono">
                  Emisión: {new Date(carne.emitidaEn).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground text-center text-[11px]">
            * Por seguridad institucional, el PIN no se imprime en el carné escolar ni en ningún
            soporte físico.
          </p>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-1.5 text-xs"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
              Cerrar
            </Button>
            <Button type="button" onClick={handlePrint} className="gap-1.5 text-xs shadow-md">
              <HugeiconsIcon icon={PrinterIcon} className="h-4 w-4" />
              Imprimir Carné
            </Button>
          </div>
        </div>
      )}

      {/* Estilos específicos para impresión */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #carne-printable,
          #carne-printable * {
            visibility: visible !important;
          }
          #carne-printable {
            position: fixed !important;
            left: 20mm !important;
            top: 20mm !important;
            width: 85.6mm !important;
            max-width: 85.6mm !important;
            height: 54mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </Modal>
  );
}
