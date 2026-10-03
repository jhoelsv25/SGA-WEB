/**
 * Configuración global y centralizada de la entidad institucional y del sistema SGA.
 * Permite invocar datos de la institución, branding, rutas y SEO desde cualquier componente o servicio.
 */

export const siteConfig = {
  // Identidad del Sistema
  name: "SGA · Sistema de Gestión Académica",
  shortName: "SGA Carmelitas",
  acronym: "SGA",
  description:
    "Plataforma integral de gestión pedagógica, control escolar, asistencia, calificaciones y comunicación de la Institución Educativa Carmelitas de Lircay, Huancavelica.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sga.carmelitas.edu.pe",

  // Datos Institucionales de la Entidad
  institution: {
    name: "Institución Educativa Carmelitas",
    shortName: "I.E. Carmelitas",
    badge: "I.E. Carmelitas · Lircay",
    motto: "Excelencia en la Gestión Educativa y Formación Integral",
    modularCode: "0342918", // Código modular de referencia
    address: "Jr. Los Estudiantes s/n, Lircay, Angaraes, Huancavelica, Perú",
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
    contact: {
      phone: "+51 967 123 456",
      supportPhone: "(067) 456-789",
      email: "contacto@carmelitas.edu.pe",
      supportEmail: "soporte@carmelitas.edu.pe",
      schedule: "Lunes a Viernes de 8:00am a 5:30pm",
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
    dashboard: "/dashboard",
    terms: "/terms",
    privacy: "/privacy",
  },

  // Configuración de SEO y Redes Sociales
  seo: {
    keywords: [
      "SGA",
      "I.E. Carmelitas",
      "Carmelitas Lircay",
      "Sistema de Gestión Académica",
      "Control Escolar Lircay",
      "Colegio Carmelitas Huancavelica",
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
