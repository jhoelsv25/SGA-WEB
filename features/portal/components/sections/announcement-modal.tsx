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
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

const STORAGE_KEY = "sga_announcement_dismissed_v1";

export function AnnouncementModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        // pequeño delay para que la animación de entrada se note
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage no disponible (ej. modo privado)
    }
  }, []);

  const handleClose = (remember = false) => {
    setIsClosing(true);
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // silencio
      }
    }
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    /* Overlay */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      aria-describedby="announcement-desc"
      className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => handleClose(false)}
        aria-hidden="true"
      />

      {/* Panel del modal */}
      <div
        className={`border-border/80 bg-card relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Gradiente decorativo superior */}
        <div className="from-primary/20 via-primary/5 absolute inset-x-0 top-0 h-48 bg-linear-to-b to-transparent" />

        {/* Cabecera */}
        <div className="relative flex items-start justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="bg-card ring-border relative flex size-12 shrink-0 items-center justify-center rounded-2xl p-1.5 shadow-md ring-1">
              <Image
                src={siteConfig.branding.logo}
                alt={`Logo ${siteConfig.institution.name}`}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {siteConfig.institution.shortName}
              </p>
              <p className="text-foreground text-sm leading-tight font-bold">
                Comunicado Institucional
              </p>
            </div>
          </div>

          <button
            id="announcement-close-btn"
            onClick={() => handleClose(false)}
            aria-label="Cerrar anuncio"
            className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-full p-1.5 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="relative px-6 pt-4 pb-6">
          {/* Badge de novedad */}
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary mb-4 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Megaphone01Icon} className="size-3.5" />
            Año Académico 2026
          </Badge>

          <h2
            id="announcement-title"
            className="text-foreground mb-2 text-xl leading-snug font-extrabold"
          >
            ¡Bienvenidos al Nuevo Portal Institucional!
          </h2>

          <p id="announcement-desc" className="text-muted-foreground mb-5 text-sm leading-relaxed">
            La <strong className="text-foreground">{siteConfig.institution.name}</strong> pone a
            disposición de toda la comunidad educativa su nuevo Sistema de Gestión Académica (SGA).
            Docentes, administrativos y familias podrán acceder a calificaciones, asistencia y
            comunicados en tiempo real.
          </p>

          {/* Hitos del año */}
          <div className="border-border/60 bg-muted/30 mb-5 space-y-2.5 rounded-2xl border p-4">
            <p className="text-foreground mb-3 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-4" />
              Fechas Clave 2026
            </p>

            {[
              { label: "Inicio de Clases", date: "Marzo 10, 2026" },
              { label: "1er Bimestre", date: "Mar. 10 – May. 22" },
              { label: "2do Bimestre", date: "May. 26 – Ago. 07" },
              { label: "Clausura del Año", date: "Diciembre 19, 2026" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-foreground font-semibold">{item.date}</span>
              </div>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              asChild
              size="sm"
              className="shadow-primary/20 flex-1 gap-2 rounded-full font-semibold shadow-md"
            >
              <Link href={siteConfig.routes.login}>
                <HugeiconsIcon icon={LogInIcon} className="size-4" />
                Acceder al Sistema
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-1.5 rounded-full text-xs font-medium"
              onClick={() => handleClose(true)}
            >
              No volver a mostrar
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Franja inferior decorativa */}
        <div className="from-primary/30 to-primary/5 h-1.5 bg-linear-to-r" />
      </div>
    </div>
  );
}
