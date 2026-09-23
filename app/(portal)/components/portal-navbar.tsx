"use client";

import * as React from "react";
import Link from "next/link";
import { Brand } from "@/components/common/brand";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogInIcon, Time02Icon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Módulos de Acceso", href: "#modulos" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Contacto", href: "#contacto" },
];

export function PortalNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-border/80 bg-background/80 border-b shadow-xs backdrop-blur-md"
          : "border-border/40 bg-background/60 border-b backdrop-blur-xs"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Brand
          href="/"
          size="md"
          title="SGA"
          subtitle="Portal Institucional"
          className="hover:opacity-95"
        />

        {/* Desktop Navigation Links */}
        <nav className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-border hover:bg-muted gap-2 font-medium"
          >
            <Link href="/access-control/kiosk">
              <HugeiconsIcon icon={Time02Icon} className="text-primary size-4" />
              <span>Marcado Kiosco</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="gap-2 font-semibold shadow-xs">
            <Link href="/login">
              <HugeiconsIcon icon={LogInIcon} className="size-4" />
              <span>Iniciar Sesión</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <HugeiconsIcon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-border bg-background/95 animate-in slide-in-from-top-2 border-b px-4 py-5 backdrop-blur-md duration-200 md:hidden">
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:bg-muted rounded-lg px-3 py-2 text-base font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="border-border flex flex-col gap-2.5 border-t pt-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/access-control/kiosk">
                  <HugeiconsIcon icon={Time02Icon} className="text-primary size-4" />
                  <span>Marcado Kiosco</span>
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-center gap-2 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/login">
                  <HugeiconsIcon icon={LogInIcon} className="size-4" />
                  <span>Iniciar Sesión</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
