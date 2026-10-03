import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { AuthSlider } from "@/features/auth";

export const metadata: Metadata = {
  title: {
    default: `Acceso Institucional · ${siteConfig.institution.shortName}`,
    template: `%s · ${siteConfig.acronym} Institucional`,
  },
  description: `Portal seguro de autenticación institucional del ${siteConfig.name}. Acceso exclusivo para la comunidad educativa de la ${siteConfig.institution.name} en ${siteConfig.institution.location.reference}.`,
  keywords: [
    "acceso institucional",
    "iniciar sesión sga",
    "intranet escolar",
    "portal académico",
    "sistema de gestión académica",
    siteConfig.institution.name,
    siteConfig.institution.shortName,
    siteConfig.institution.location.district,
    siteConfig.institution.location.department,
    ...siteConfig.seo.keywords,
  ],
  alternates: {
    canonical: siteConfig.routes.login,
  },
  openGraph: {
    title: `Acceso Institucional · ${siteConfig.name}`,
    description: `Portal oficial de autenticación y gestión académica para estudiantes, docentes y directivos de la ${siteConfig.institution.name}.`,
    url: `${siteConfig.url}${siteConfig.routes.login}`,
    siteName: siteConfig.name,
    locale: siteConfig.seo.locale,
    type: "website",
    images: [
      {
        url: siteConfig.branding.logo,
        width: 800,
        height: 600,
        alt: `Portal de Acceso Institucional - ${siteConfig.institution.name}`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `Acceso Institucional · ${siteConfig.acronym}`,
    description: `Portal de acceso seguro para la comunidad educativa de la ${siteConfig.institution.shortName}.`,
    images: [siteConfig.branding.logo],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
  classification: "Educational Portal Authentication",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background text-foreground grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-12">
      <section className="relative hidden lg:col-span-7 lg:flex">
        <AuthSlider />
      </section>

      <section className="border-border/50 bg-background flex flex-col justify-center border-l shadow-xs lg:col-span-5">
        {children}
      </section>
    </main>
  );
}
