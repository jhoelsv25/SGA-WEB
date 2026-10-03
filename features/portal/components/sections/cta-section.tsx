import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogInIcon, Time02Icon } from "@hugeicons/core-free-icons";

export function CtaSection() {
  return (
    <section className="bg-background py-16 text-center sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-primary/20 from-primary/10 via-primary/5 rounded-3xl border bg-linear-to-b to-transparent p-8 shadow-sm sm:p-12">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            ¿Listo para ingresar al sistema?
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm leading-relaxed">
            Utiliza tus credenciales institucionales para acceder a tu panel de control, o consulta
            la terminal de marcado escolar en portería.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 font-semibold shadow-sm sm:w-auto">
              <Link href={siteConfig.routes.login}>
                <HugeiconsIcon icon={LogInIcon} className="size-5" />
                <span>Iniciar Sesión en {siteConfig.acronym}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full gap-2 sm:w-auto">
              <Link href="/access-control/kiosk">
                <HugeiconsIcon icon={Time02Icon} className="text-primary size-5" />
                <span>Ir al Marcado Kiosco</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
