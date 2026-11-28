/**
 * Configuración global y centralizada de la entidad institucional y del sistema SGA.
 * Permite invocar datos de la institución, branding, rutas y SEO desde cualquier componente o servicio.
 */

export const siteConfig = {
  // Identidad del Sistema
  name: "SGA · Sistema de Gestión Académica",
  shortName: "SGA Nuestra Señora del Carmen",
  acronym: "SGA",
  description:
    "Plataforma integral de gestión pedagógica, control escolar, asistencia, calificaciones y comunicación de la I.E. De Mujeres Nuestra Señora del Carmen, Lircay, Huancavelica.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sga.carmelinas.edu.pe",

  // Datos Institucionales de la Entidad
  institution: {
    name: "I.E. De Mujeres Nuestra Señora del Carmen",
    shortName: "I.E. Nuestra Señora del Carmen",
    badge: "I.E. Nuestra Señora del Carmen · Lircay",
    motto: "Excelencia en la Gestión Educativa y Formación Integral",
    modularCode: "0543210",
    website: "https://colegiocarmelinas.edu.pe/",
    address: "Av. Esmeralda 450, Lircay, Angaraes, Huancavelica, Perú",
    location: {
      district: "Lircay",
      province: "Angaraes",
      department: "Huancavelica",
      country: "Perú",
      reference: "Lircay, Huancavelica",
    },
    administration: {
      ugel: "UGEL Angaraes",
      dre: "DRE Huancavelica",
      levels: ["Educación Secundaria"],
    },
    // Datos tomados del sitio oficial https://colegiocarmelinas.edu.pe/
    contact: {
      phone: "975 772 422",
      supportPhone: "(067) 45 3030",
      email: "info@colegiocarmelinas.edu.pe",
      supportEmail: "info@colegiocarmelinas.edu.pe",
      schedule: "Lunes a viernes: 8:00 a.m. – 4:00 p.m.",
    },
  },

  // Recursos de Branding & Media
  branding: {
    logo: "/logo.png",
    favicon: "/favicon.ico",
    themeColor: "#881337", // Tono Carmine / Guinda institucional
    themeColorDark: "#171012",
    icons: {
      icon192: "/assets/icons/icon-192x192.png",
      icon512: "/assets/icons/icon-512x512.png",
      appleTouch: "/assets/icons/icon-152x152.png",
    },
  },

  // Rutas y Navegación del Sistema
  routes: {
    home: "/",
    login: "/login",
    recover: "/recover",
    changePassword: "/change-password",
    dashboard: "/admin/dashboard",
    terms: "/terms",
    privacy: "/privacy",
    kiosk: "/kiosko",
  },

  // Configuración de SEO y Redes Sociales
  seo: {
    keywords: [
      "SGA",
      "I.E. Nuestra Señora del Carmen",
      "Nuestra Señora del Carmen Lircay",
      "Sistema de Gestión Académica",
      "Control Escolar Lircay",
      "Colegio Nuestra Señora del Carmen Huancavelica",
      "Intranet Escolar",
      "Asistencia y Calificaciones",
      "Educación Lircay Angaraes",
    ],
    locale: "es_PE",
    type: "website",
    ogImage: "/logo.png",
    twitterCard: "summary_large_image",
  },
} as const;

export type SiteConfig = typeof siteConfig;
