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
import { PORTAL_FAQS } from "@/features/portal/constants/faq";

const PORTAL_TITLE = `Intranet Educativa · ${siteConfig.institution.shortName}`;
const PORTAL_DESCRIPTION = `Intranet escolar oficial de la ${siteConfig.institution.name} (${siteConfig.institution.location.reference}). Acceso para docentes, estudiantes y apoderados: asistencia, sesiones de clase, aula virtual, comunicados y libretas SIAGIE.`;

export const metadata: Metadata = {
  title: PORTAL_TITLE,
  description: PORTAL_DESCRIPTION,
  keywords: [
    ...siteConfig.seo.keywords,
    "Intranet Carmensita Lircay",
    "Libretas SIAGIE",
    "Aula Virtual Secundaria",
    "Kiosko Escolar",
  ],
  alternates: {
    canonical: siteConfig.routes.home,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: PORTAL_TITLE,
    description: PORTAL_DESCRIPTION,
    url: siteConfig.url,
    siteName: `${siteConfig.acronym} · ${siteConfig.institution.shortName}`,
    locale: siteConfig.seo.locale,
    type: "website",
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: PORTAL_TITLE,
    description: PORTAL_DESCRIPTION,
  },
};

const portalJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "School",
      "@id": `${siteConfig.url}/#school`,
      name: siteConfig.institution.name,
      alternateName: siteConfig.institution.shortName,
      description: siteConfig.description,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.branding.logo}`,
      email: siteConfig.institution.contact.email,
      telephone: siteConfig.institution.contact.phone,
      slogan: siteConfig.institution.motto,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.institution.address,
        addressLocality: siteConfig.institution.location.district,
        addressRegion: siteConfig.institution.location.department,
        addressCountry: "PE",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: PORTAL_DESCRIPTION,
      inLanguage: "es-PE",
      publisher: { "@id": `${siteConfig.url}/#school` },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/#faq`,
      mainEntity: PORTAL_FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function PortalPage() {
  return (
    <div id="inicio" className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portalJsonLd) }}
      />
      <HeroSection />
      <ModulesSection />
      <FeaturesSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
