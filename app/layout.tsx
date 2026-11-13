import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.branding.themeColorDark },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.institution.shortName}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  authors: [
    {
      name: `${siteConfig.institution.shortName} · ${siteConfig.institution.location.reference}`,
      url: siteConfig.url,
    },
  ],
  creator: `${siteConfig.institution.shortName} - ${siteConfig.institution.location.district}`,
  publisher: siteConfig.institution.name,
  generator: "Next.js",
  keywords: [...siteConfig.seo.keywords],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteConfig.routes.home,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.shortName,
  },
  icons: {
    icon: [
      { url: siteConfig.branding.favicon },
      { url: siteConfig.branding.icons.icon192, sizes: "192x192", type: "image/png" },
      { url: siteConfig.branding.icons.icon512, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: siteConfig.branding.icons.appleTouch, sizes: "152x152", type: "image/png" },
      { url: siteConfig.branding.icons.icon192, sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: siteConfig.seo.locale,
    url: siteConfig.routes.home,
    siteName: `${siteConfig.acronym} · ${siteConfig.institution.shortName}`,
    title: `${siteConfig.name} | ${siteConfig.institution.shortName}`,
    description: siteConfig.description,
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: `${siteConfig.name} | ${siteConfig.institution.shortName}`,
    description: siteConfig.description,
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
      className={cn("h-full font-sans antialiased", sourceSans.variable)}
    >
      <body className="bg-background text-foreground selection:bg-primary/20 selection:text-primary flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
