import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sga.carmelitas.edu.pe";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171012" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SGA · Sistema de Gestión Académica | I.E. Carmelitas",
    template: "%s | SGA Carmelitas",
  },
  description:
    "Plataforma integral de gestión pedagógica, control escolar, asistencia, calificaciones y comunicación de la Institución Educativa Carmelitas de Lircay, Huancavelica.",
  applicationName: "SGA Carmelitas",
  authors: [{ name: "I.E. Carmelitas · Lircay, Huancavelica", url: SITE_URL }],
  creator: "I.E. Carmelitas - Lircay",
  publisher: "I.E. Carmelitas",
  generator: "Next.js",
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/assets/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/assets/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/assets/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    siteName: "SGA · I.E. Carmelitas",
    title: "SGA · Sistema de Gestión Académica | I.E. Carmelitas",
    description:
      "Plataforma integral de gestión escolar, control de asistencia y calificaciones de la I.E. Carmelitas en Lircay, Huancavelica.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Insignia Institucional - I.E. Carmelitas Lircay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SGA · Sistema de Gestión Académica | I.E. Carmelitas",
    description:
      "Plataforma integral de gestión escolar y asistencia de la I.E. Carmelitas (Lircay, Huancavelica).",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("h-full font-sans antialiased", inter.variable)}
    >
      <body className="bg-background text-foreground selection:bg-primary/20 selection:text-primary flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
