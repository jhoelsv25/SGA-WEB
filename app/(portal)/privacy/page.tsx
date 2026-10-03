import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config";
import { PrivacyContent } from "@/features/portal";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Calendar03Icon, Shield01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Políticas de Privacidad y Protección de Datos",
  description: `Políticas institucionales de privacidad y protección de datos personales escolares de la ${siteConfig.institution.name} conforme a la Ley N° 29733.`,
  alternates: {
    canonical: siteConfig.routes.privacy,
  },
  openGraph: {
    title: `Políticas de Privacidad · ${siteConfig.institution.name}`,
    description: `Protección de datos escolares y privacidad de los alumnos en ${siteConfig.institution.shortName}.`,
    url: siteConfig.routes.privacy,
    siteName: siteConfig.name,
    locale: siteConfig.seo.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
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
            <HugeiconsIcon icon={Shield01Icon} className="mr-1 size-3.5" />
            Ley N° 29733 (Perú)
          </Badge>
        </div>

        {/* Encabezado */}
        <header className="border-border mb-10 border-b pb-8">
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Política de Privacidad y Tratamiento de Datos
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Directivas y lineamientos de confidencialidad, uso y protección de datos personales de
            los estudiantes, apoderados y personal de la {siteConfig.institution.name}.
          </p>

          <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs font-medium">
            <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
            <span>Última actualización: Año Académico 2026 · V.1.0</span>
          </div>
        </header>

        {/* Contenido Legal */}
        <PrivacyContent />
      </div>
    </div>
  );
}
