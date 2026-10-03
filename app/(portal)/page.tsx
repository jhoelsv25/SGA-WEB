import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import {
  HeroSection,
  ModulesSection,
  FeaturesSection,
  FaqSection,
  CtaSection,
} from "@/features/portal";

export const metadata: Metadata = {
  title: `Portal Institucional · ${siteConfig.institution.shortName}`,
  description: `Portal Oficial del ${siteConfig.name} de la ${siteConfig.institution.name} en ${siteConfig.institution.location.reference}. Servicios educativos, control escolar, asistencia y vida institucional.`,
  alternates: {
    canonical: siteConfig.routes.home,
  },
  openGraph: {
    title: `Portal Institucional · ${siteConfig.institution.name}`,
    description: `${siteConfig.institution.motto}. Gestión escolar y académica en ${siteConfig.institution.location.reference}.`,
    url: siteConfig.routes.home,
    siteName: siteConfig.name,
    locale: siteConfig.seo.locale,
    type: "website",
    images: [
      {
        url: siteConfig.branding.logo,
        width: 800,
        height: 600,
        alt: `Logo Institucional ${siteConfig.institution.name}`,
      },
    ],
  },
};

export default function PortalPage() {
  return (
    <div id="inicio" className="flex flex-col">
      <HeroSection />
      <ModulesSection />
      <FeaturesSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
