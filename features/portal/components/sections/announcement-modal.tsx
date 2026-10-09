"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  LogInIcon,
  Megaphone01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

const STORAGE_KEY = "sga_announcement_dismissed_v1";

const DATES = [
  { emoji: "🏫", label: "Inicio de Clases", date: "10 de Marzo, 2026" },
  { emoji: "📝", label: "1.er Bimestre", date: "Mar. 10 – May. 22" },
  { emoji: "📚", label: "2.do Bimestre", date: "May. 26 – Ago. 07" },
  { emoji: "3️⃣", label: "3.er Bimestre", date: "Ago. 11 – Oct. 16" },
  { emoji: "🎓", label: "Clausura del Año", date: "19 de Diciembre, 2026" },
];

export function AnnouncementModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      /* localStorage no disponible */
    }
  }, []);

  const handleClose = (remember = false) => {
    setIsClosing(true);
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        /* silencio */
      }
    }
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      aria-describedby="announcement-desc"
      className={`fixed inset-0 z-999 flex items-center justify-center p-4 transition-all duration-300 sm:p-6 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={() => handleClose(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`border-border/70 bg-card relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* ── Banner superior ilustrado ── */}
        <div className="from-primary/25 via-primary/10 relative overflow-hidden bg-linear-to-br to-transparent px-7 pt-6 pb-5">
          {/* Destellos decorativos */}
          <div className="bg-primary/15 absolute -top-10 -right-10 size-48 rounded-full blur-3xl" />
          <div className="bg-primary/10 absolute top-8 -left-6 size-32 rounded-full blur-2xl" />

          {/* Fila: logo + textos + cerrar */}
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-card ring-border flex size-16 shrink-0 items-center justify-center rounded-2xl p-2 shadow-lg ring-1">
                <Image
                  src={siteConfig.branding.logo}
                  alt={`Logo ${siteConfig.institution.name}`}
                  width={52}
                  height={52}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-primary text-[11px] font-bold tracking-widest uppercase">
                  Comunicado Oficial
                </p>
                <p className="text-foreground text-base leading-tight font-extrabold">
                  {siteConfig.institution.shortName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {siteConfig.institution.location.reference}
                </p>
              </div>
            </div>

            <button
              id="announcement-close-btn"
              onClick={() => handleClose(false)}
              aria-label="Cerrar anuncio"
              className="hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full p-2 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-5" />
            </button>
          </div>

          {/* Badge de anuncio */}
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary mt-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Megaphone01Icon} className="size-3.5" />
            Año académico 2026 · Inicio de Actividades
          </Badge>
        </div>

        {/* ── Cuerpo ── */}
        <div className="px-7 pt-5 pb-3">
          <h2
            id="announcement-title"
            className="text-foreground mb-2 text-2xl leading-snug font-extrabold"
          >
            ¡Bienvenida, Comunidad Carmelinas! 🎉
          </h2>

          <p id="announcement-desc" className="text-muted-foreground mb-6 text-sm leading-relaxed">
            La <strong className="text-foreground">{siteConfig.institution.name}</strong> se
            complace en presentar su nuevo{" "}
            <strong className="text-foreground">Sistema de Gestión Académica (SGA)</strong>.
            Docentes, administrativos y familias podrán consultar calificaciones, asistencia y
            comunicados institucionales en tiempo real, desde cualquier dispositivo.
          </p>

          {/* Calendario de fechas */}
          <div className="border-border/50 mb-6 overflow-hidden rounded-2xl border">
            <div className="border-border/50 bg-muted/50 flex items-center gap-2 border-b px-4 py-2.5">
              <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-4" />
              <p className="text-foreground text-xs font-bold tracking-wider uppercase">
                Calendario Escolar 2026
              </p>
            </div>
            <div className="divide-border/40 divide-y">
              {DATES.map((item) => (
                <div
                  key={item.label}
                  className="hover:bg-muted/30 flex items-center justify-between px-4 py-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{item.emoji}</span>
                    <span className="text-foreground text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-muted-foreground text-xs font-semibold tabular-nums">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Acciones ── */}
        <div className="px-7 pb-6">
          <Button
            asChild
            size="lg"
            className="shadow-primary/20 mb-3 h-12 w-full gap-2 rounded-full text-base font-semibold shadow-lg transition-all hover:scale-[1.02]"
          >
            <Link href={siteConfig.routes.login}>
              <HugeiconsIcon icon={LogInIcon} className="size-5" />
              Acceder al Sistema Ahora
            </Link>
          </Button>

          <button
            onClick={() => handleClose(true)}
            className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3.5" />
            Entendido, no volver a mostrar
          </button>
        </div>

        {/* Franja inferior decorativa */}
        <div className="from-primary/40 via-primary/20 to-primary/5 h-1.5 bg-linear-to-r" />
      </div>
    </div>
  );
}
