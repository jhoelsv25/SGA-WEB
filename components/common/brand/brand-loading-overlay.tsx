"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLoadingOverlayProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export function BrandLoadingOverlay({
  message = "Validando permisos corporativos...",
  subMessage = "JLH Corredores de Seguros • Marketing & AIS",
  className,
}: BrandLoadingOverlayProps) {
  return (
    <div
      className={cn(
        "bg-background/95 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md transition-all",
        className,
      )}
    >
      {/* Background radial glow muy sutil */}
      <div className="bg-primary/5 pointer-events-none absolute -top-24 size-96 rounded-full blur-3xl" />
      <div className="bg-secondary/5 pointer-events-none absolute -bottom-24 size-96 rounded-full blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 text-center">
        {/* Contenedor del Logo con animación de pulso elegante y sombra suave sin bordes toscos */}
        <div className="relative flex items-center justify-center">
          {/* Pulso suave continuo sin bordes */}
          <div className="bg-primary/10 absolute size-24 animate-pulse rounded-3xl blur-md" />

          {/* Tarjeta del Logo JLH con sombra elegante y sin bordes */}
          <div className="bg-card relative flex size-20 animate-pulse items-center justify-center rounded-2xl p-3.5 shadow-2xl shadow-slate-200/80 transition-transform dark:shadow-black/50">
            <Image
              src="/brand/jlh-favicon.png"
              alt="JLH Seguros"
              width={56}
              height={56}
              priority
              className="h-auto w-auto object-contain"
            />
          </div>
        </div>

        {/* Tipografía y Estado */}
        <div className="space-y-1.5">
          <h3 className="text-foreground text-sm font-bold tracking-tight">{message}</h3>
          <p className="text-muted-foreground text-xs font-medium tracking-wide">{subMessage}</p>
        </div>

        {/* Barra de progreso fina y elegante */}
        <div className="bg-muted/70 relative h-1 w-44 overflow-hidden rounded-full">
          <div className="from-primary via-secondary to-primary absolute h-full w-full animate-[shimmer_1.6s_infinite] rounded-full bg-gradient-to-r" />
        </div>
      </div>
    </div>
  );
}
