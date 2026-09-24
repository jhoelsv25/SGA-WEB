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
      <body className="flex min-h-full flex-col items-center justify-center bg-neutral-50 p-6 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-rose-100 p-2 shadow-sm dark:bg-rose-950/50">
            <Image
              src={siteConfig.branding.logo}
              alt={`Logo ${siteConfig.institution.shortName}`}
              width={44}
              height={44}
              className="object-contain"
            />
          </div>

          <span className="mb-3 rounded-full border border-rose-200 bg-rose-50 px-3 py-0.5 text-xs font-bold tracking-widest text-rose-700 uppercase dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
            Error Crítico Global
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Interrupción en el servicio
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Se ha producido un error crítico a nivel raíz en la plataforma. Por favor, intenta
            recargar la aplicación.
          </p>

          {error.digest && (
            <p className="mt-3 rounded-md bg-neutral-200/70 px-2 py-1 font-mono text-[11px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
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

          <p className="mt-8 text-xs text-neutral-500 dark:text-neutral-500">
            {siteConfig.acronym} · {siteConfig.institution.badge}
          </p>
        </div>
      </body>
    </html>
  );
}
