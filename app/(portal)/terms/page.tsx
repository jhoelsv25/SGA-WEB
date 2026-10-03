import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config";
import { TermsContent } from "@/features/portal";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Calendar03Icon, FileCheckIcon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso",
  description: `Términos y condiciones oficiales para el acceso y uso del ${siteConfig.name} en la ${siteConfig.institution.name}.`,
  alternates: {
    canonical: siteConfig.routes.terms,
  },
  openGraph: {
    title: `Términos de Servicio · ${siteConfig.institution.name}`,
    description: `Normativa y condiciones de uso de la plataforma académica ${siteConfig.shortName}.`,
    url: siteConfig.routes.terms,
    siteName: siteConfig.name,
    locale: siteConfig.seo.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navegación y Volver */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            <span>Volver al portal principal</span>
          </Link>

          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary text-[11px]"
          >
            <HugeiconsIcon icon={FileCheckIcon} className="mr-1 size-3.5" />
            Normativa Escolar
          </Badge>
        </div>

        {/* Encabezado */}
        <header className="border-border mb-10 border-b pb-8">
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Términos y Condiciones del Servicio
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Reglamento de uso institucional, compromisos éticos, directivas de seguridad y
            condiciones de operación del {siteConfig.name} ({siteConfig.acronym}).
          </p>

          <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs font-medium">
            <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
            <span>Vigencia: Período Académico 2026 · V.1.0</span>
          </div>
        </header>

        {/* Contenido Legal */}
        <TermsContent />
      </div>
    </div>
  );
}
