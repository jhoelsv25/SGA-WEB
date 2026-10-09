"use client";

import * as React from "react";
import Image from "next/image";
import { siteConfig } from "@/config";
import { Button } from "@/components/ui/button";

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error("Critical Root Error capturado por app/global-error.tsx:", error);
  }, [error]);

  return (
    <html lang="es" className="h-full">
      <body className="bg-background text-foreground flex min-h-full flex-col items-center justify-center p-6 antialiased">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="bg-destructive/10 text-destructive mb-4 flex size-16 items-center justify-center rounded-2xl p-2 shadow-sm">
            <Image
              src={siteConfig.branding.logo}
              alt={`Logo ${siteConfig.institution.shortName}`}
              width={44}
              height={44}
              className="object-contain"
            />
          </div>

          <span className="border-destructive/20 bg-destructive/10 text-destructive mb-3 rounded-full border px-3 py-0.5 text-xs font-bold tracking-widest uppercase">
            Error Crítico Global
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Interrupción en el servicio
          </h1>

          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Se ha producido un error crítico a nivel raíz en la plataforma. Por favor, intenta
            recargar la aplicación.
          </p>

          {error.digest && (
            <p className="bg-muted text-muted-foreground mt-3 rounded-md px-2 py-1 font-mono text-xs">
              Código de rastreo: {error.digest}
            </p>
          )}

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => reset()}
              size="lg"
              className="h-11 flex-1 rounded-full text-sm font-bold shadow-md"
            >
              Reintentar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
              className="h-11 flex-1 rounded-full text-sm font-semibold"
            >
              Recargar Portal
            </Button>
          </div>

          <p className="text-muted-foreground mt-8 text-xs">
            {siteConfig.acronym} · {siteConfig.institution.badge}
          </p>
        </div>
      </body>
    </html>
  );
}
