"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/common/brand";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LogInIcon,
  Time02Icon,
  Menu01Icon,
  Cancel01Icon,
  Home01Icon,
  GridIcon,
  FlashIcon,
  FileTextIcon,
  MailAtSign01Icon,
} from "@hugeicons/core-free-icons";

const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio", icon: Home01Icon },
  { label: "Módulos", href: "/#modulos", icon: GridIcon },
  { label: "Características", href: "/#caracteristicas", icon: FlashIcon },
  { label: "Normativa", href: siteConfig.routes.privacy, icon: FileTextIcon },
  { label: "Contacto", href: "/#contacto", icon: MailAtSign01Icon },
];

export function PortalNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-border/80 bg-background/90 border-b shadow-sm backdrop-blur-xl"
          : "border-border/30 bg-background/50 border-b backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Brand ── */}
        <Brand
          href="/"
          size="md"
          title={siteConfig.acronym}
          subtitle="Portal Institucional"
          priority
        />

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center lg:flex" aria-label="Navegación principal">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {link.label}
                    {/* Underline indicator */}
                    <span
                      className={`bg-primary absolute inset-x-3.5 bottom-1 h-px rounded-full transition-all duration-200 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />

          {/* Divider */}
          <div className="bg-border mx-1 h-5 w-px" />

          {/* Kiosco */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hover:bg-muted/70 group h-9 gap-2 rounded-full px-4 font-medium"
          >
            <Link href="/access-control/kiosk">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                Terminal Kiosco
              </span>
            </Link>
          </Button>

          {/* Login CTA */}
          <Button
            asChild
            size="sm"
            className="from-primary to-primary/85 shadow-primary/25 h-9 gap-2 rounded-full bg-linear-to-br px-5 font-semibold shadow-md transition-all hover:scale-[1.03] hover:shadow-lg"
          >
            <Link href={siteConfig.routes.login}>
              <HugeiconsIcon icon={LogInIcon} className="size-4" />
              Iniciar Sesión
            </Link>
          </Button>
        </div>

        {/* ── Mobile: theme + burger ── */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
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
        className={`border-border/60 bg-background/98 overflow-hidden border-b backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? "max-h-120 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {/* Nav links */}
          <nav className="mb-4 space-y-0.5" aria-label="Menú móvil">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "text-primary bg-primary/8" : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  <HugeiconsIcon
                    icon={link.icon}
                    className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  />
                  {link.label}
                  {isActive && <span className="bg-primary ml-auto size-1.5 rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-border/50 border-t pt-4">
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                asChild
                variant="outline"
                className="h-10 w-full gap-2 rounded-xl font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/access-control/kiosk">
                  <HugeiconsIcon icon={Time02Icon} className="text-primary size-4" />
                  Terminal Kiosco
                </Link>
              </Button>

              <Button
                asChild
                className="h-10 w-full gap-2 rounded-xl font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href={siteConfig.routes.login}>
                  <HugeiconsIcon icon={LogInIcon} className="size-4" />
                  Iniciar Sesión
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer info */}
          <p className="text-muted-foreground mt-4 text-center text-[11px]">
            {siteConfig.institution.shortName} · {siteConfig.institution.location.reference}
          </p>
        </div>
      </div>
    </header>
  );
}
