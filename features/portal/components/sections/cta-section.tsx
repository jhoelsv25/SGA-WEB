import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, LogInIcon } from "@hugeicons/core-free-icons";

export function CtaSection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:px-8">
        <div className="lg:col-span-8">
          <p className="text-primary-foreground/70 text-xs font-bold tracking-[0.2em] uppercase">
            {siteConfig.institution.shortName}
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Ingresa a la intranet del colegio
          </h2>
          <p className="text-primary-foreground/80 mt-5 max-w-xl text-base leading-relaxed">
            Usa el usuario y la contraseña que te entregó la institución.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-12 w-full gap-2 rounded-lg px-7 font-semibold sm:w-auto"
          >
            <Link href={siteConfig.routes.login}>
              <HugeiconsIcon icon={LogInIcon} className="size-5" />
              <span>Ingresar ahora</span>
            </Link>
          </Button>
          <Link
            href={siteConfig.routes.kiosk}
            className="text-primary-foreground/85 hover:text-primary-foreground inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            <span>Registro de asistencia</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Link>
          <a
            href={siteConfig.institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground/85 hover:text-primary-foreground inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            <span>Sitio web del colegio</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
