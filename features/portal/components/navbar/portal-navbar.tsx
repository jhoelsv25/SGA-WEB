"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/common/brand";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LogInIcon,
  Menu01Icon,
  Cancel01Icon,
  Home01Icon,
  GridIcon,
  FlashIcon,
  FileTextIcon,
  MailAtSign01Icon,
  Image01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";

const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio", id: "inicio", icon: Home01Icon },
  { label: "Servicios", href: "/#caracteristicas", id: "caracteristicas", icon: FlashIcon },
  { label: "Vida escolar", href: "/#vida-escolar", id: "vida-escolar", icon: Image01Icon },
  { label: "Comunidad", href: "/#modulos", id: "modulos", icon: GridIcon },
  { label: "Guía rápida", href: "/#faq", id: "faq", icon: FileTextIcon },
  { label: "Contacto", href: "/#contacto", id: "contacto", icon: MailAtSign01Icon },
];

export function PortalNavbar() {
  const pathname = usePathname();
  const esInicio = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [seccionActiva, setSeccionActiva] = React.useState("inicio");

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resalta en el menú la sección que se está viendo
  React.useEffect(() => {
    if (!esInicio) return;
    const visibles = new Map<string, number>();
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) visibles.set(entrada.target.id, entrada.intersectionRatio);
          else visibles.delete(entrada.target.id);
        });
        const primera = NAV_LINKS.find((link) => visibles.has(link.id));
        if (primera) setSeccionActiva(primera.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1] },
    );
    NAV_LINKS.forEach((link) => {
      const elemento = document.getElementById(link.id);
      if (elemento) observador.observe(elemento);
    });
    return () => observador.disconnect();
  }, [esInicio]);

  // Transparente sobre la portada; sólido al bajar o al abrir el menú móvil
  const transparente = esInicio && !isScrolled && !mobileMenuOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        "dark text-foreground",
        transparente
          ? "border-transparent bg-transparent"
          : "border-white/10 bg-linear-to-r from-[#8a1538] to-[#2a0714] shadow-lg",
      )}
    >
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Brand ── */}
        <Brand
          href="/"
          size="md"
          title={siteConfig.acronym}
          subtitle="Intranet institucional"
          priority
        />

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center lg:flex" aria-label="Navegación principal">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const activo = esInicio && seccionActiva === link.id;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={activo ? "location" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center rounded-lg px-3.5 text-sm font-medium transition-colors",
                      activo ? "text-white" : "text-white/75 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3.5 bottom-1.5 h-0.5 origin-left rounded-full transition-transform duration-300",
                        "bg-white",
                        activo ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={siteConfig.institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors",
              "text-white/85 hover:bg-white/10 hover:text-white",
            )}
          >
            Sitio del colegio
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-3.5" />
          </a>
          <ThemeToggle />

          {/* Divider */}
          <div className="bg-border mx-1 h-5 w-px" />

          {/* Login CTA */}
          <Button
            asChild
            size="sm"
            className={cn(
              "h-9 gap-2 rounded-full px-5 font-semibold shadow-md transition-all hover:scale-[1.03] hover:shadow-lg",
              "bg-white bg-none text-[#8a1538] hover:bg-white/90",
            )}
          >
            <Link href={siteConfig.routes.login}>
              <HugeiconsIcon icon={LogInIcon} className="size-4" />
              Iniciar sesión
            </Link>
          </Button>
        </div>

        {/* ── Mobile: theme + burger ── */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
            aria-controls="menu-movil-portal"
          >
            <HugeiconsIcon
              icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon}
              className="size-5 transition-transform duration-200"
            />
          </Button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        id="menu-movil-portal"
        inert={!mobileMenuOpen}
        aria-hidden={!mobileMenuOpen}
        className={`border-border/60 bg-background/98 overflow-hidden border-b backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? "max-h-140 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {/* Nav links */}
          <nav className="mb-4 space-y-0.5" aria-label="Menú móvil">
            {NAV_LINKS.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground hover:bg-muted/60 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors"
                >
                  <HugeiconsIcon icon={link.icon} className="text-muted-foreground size-4" />
                  {link.label}
                </Link>
              );
            })}
            <a
              href={siteConfig.institution.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:bg-muted/60 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors"
            >
              <HugeiconsIcon icon={ArrowUpRight01Icon} className="text-muted-foreground size-4" />
              Sitio del colegio
            </a>
          </nav>

          {/* Divider */}
          <div className="border-border/50 border-t pt-4">
            <Button
              asChild
              className="h-10 w-full gap-2 rounded-xl font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href={siteConfig.routes.login}>
                <HugeiconsIcon icon={LogInIcon} className="size-4" />
                Iniciar sesión
              </Link>
            </Button>
          </div>

          {/* Footer info */}
          <p className="text-muted-foreground mt-4 text-center text-xs">
            {siteConfig.institution.shortName} · {siteConfig.institution.location.reference}
          </p>
        </div>
      </div>
    </header>
  );
}
