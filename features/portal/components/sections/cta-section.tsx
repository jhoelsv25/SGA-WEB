import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogInIcon, Time02Icon } from "@hugeicons/core-free-icons";

export function CtaSection() {
  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_50%)]"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="max-w-2xl">
          <p className="text-primary-foreground/80 text-xs font-bold tracking-widest uppercase">
            {siteConfig.institution.shortName}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ingresa a la intranet del colegio
          </h2>
          <p className="text-primary-foreground/85 mt-3 text-sm leading-relaxed sm:text-base">
            Accede con el usuario y contraseña entregados por la institución para consultar
            asistencia, comunicados, aula virtual y libretas.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-12 w-full gap-2 rounded-full px-7 font-semibold shadow-md sm:w-auto"
          >
            <Link href={siteConfig.routes.login}>
              <HugeiconsIcon icon={LogInIcon} className="size-5" />
              <span>Ingresar ahora</span>
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground h-12 w-full gap-2 rounded-full px-6 font-medium sm:w-auto"
          >
            <Link href={siteConfig.routes.kiosk}>
              <HugeiconsIcon icon={Time02Icon} className="size-5" />
              <span>Registro de asistencia</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
