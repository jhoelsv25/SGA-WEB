"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";

interface SlideData {
  id: number;
  tagline: string;
  prefix: string;
  highlight: string;
  title: string;
  description: string;
  badge: string;
}

const SLIDES: SlideData[] = [
  {
    id: 0,
    tagline: "Formación Integral y Valores",
    prefix: "Bienvenido a",
    highlight: "I.E.",
    title: "Carmelinas",
    description:
      "Institución emblemática comprometida con la excelencia pedagógica, la disciplina y el futuro de nuestros estudiantes en Lircay, Huancavelica.",
    badge: "Lircay · Angaraes · Huancavelica",
  },
  {
    id: 1,
    tagline: "Modernización y Aulas Digitales",
    prefix: "Innovación en",
    highlight: "Gestión",
    title: "Académica",
    description:
      "Control de asistencia en tiempo real, registro de evaluaciones por competencias y seguimiento pedagógico continuo.",
    badge: "Plataforma Oficial SGA",
  },
  {
    id: 2,
    tagline: "Alianza Escuela y Familia",
    prefix: "Comunidad",
    highlight: "Unida y",
    title: "Conectada",
    description:
      "Comunicación transparente y oportuna entre docentes, directivos y familias para potenciar el talento de cada alumno.",
    badge: "Plataforma institucional",
  },
];

export function AuthSlider() {
  const [current, setCurrent] = React.useState(0);
  const movimientoReducido = useReducedMotion();
  const [pausado, setPausado] = React.useState(false);
  const enMovimiento = !pausado && !movimientoReducido;

  // Cambio automático cada 5.5 segundos (WCAG 2.2.2: se puede pausar)
  React.useEffect(() => {
    if (!enMovimiento) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [enMovimiento]);

  const slide = SLIDES[current];

  return (
    <div className="bg-secondary relative flex h-full w-full flex-col justify-between overflow-hidden p-8 select-none sm:p-12 lg:p-16">
      {/* Botón superior para volver al portal */}
      <div className="relative z-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-foreground/80 hover:text-primary inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-semibold shadow-xs backdrop-blur-md transition-all hover:bg-white dark:bg-black/40 dark:hover:bg-black/60"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
          <span>Volver al portal</span>
        </Link>

        <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
          {slide.badge}
        </span>
      </div>

      {/* Contenido textual con animaciones fluidas */}
      <div className="relative z-20 my-auto max-w-xl pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Tagline / Categoría */}
            <span className="text-primary/80 inline-block text-xs font-bold tracking-widest uppercase">
              {slide.tagline}
            </span>

            {/* Titular Principal estilo de referencia */}
            <div className="space-y-1">
              <h2 className="text-primary text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {slide.prefix}
              </h2>
              <div className="text-foreground text-5xl font-black tracking-tight italic sm:text-6xl lg:text-7xl">
                <span className="text-primary not-italic">{slide.highlight} </span>
                <span className="text-foreground">{slide.title}</span>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Composición Artística 3D con Pétalos y Ondas de Seda Carmesí */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {/* Glow cálido ambiental */}
        <div className="bg-primary/20 dark:bg-primary/30 absolute -bottom-24 -left-24 size-130 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 size-80 rounded-full bg-amber-500/10 blur-2xl" />

        {/* Formas orgánicas de ondas fluidas (Carmesí / Seda 3D) */}
        <motion.svg
          className="absolute -right-16 -bottom-16 h-[85%] w-[110%] max-w-none opacity-90 sm:h-[90%] sm:w-full"
          viewBox="0 0 800 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={enMovimiento ? { y: [0, -12, 0], rotate: [0, 1.2, 0] } : undefined}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <defs>
            <linearGradient id="silkGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.58 0.22 25)" />
              <stop offset="50%" stopColor="oklch(0.46 0.18 20)" />
              <stop offset="100%" stopColor="oklch(0.32 0.14 18)" />
            </linearGradient>

            <linearGradient id="silkGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.68 0.24 28)" />
              <stop offset="60%" stopColor="oklch(0.50 0.19 22)" />
              <stop offset="100%" stopColor="oklch(0.38 0.15 20)" />
            </linearGradient>

            <linearGradient id="silkGradient3" x1="30%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.74 0.22 30)" />
              <stop offset="100%" stopColor="oklch(0.48 0.18 20)" />
            </linearGradient>

            <filter id="petalShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="-10" dy="16" stdDeviation="24" floodColor="rgba(80, 0, 10, 0.35)" />
            </filter>
          </defs>

          {/* Capa Trasera - Pétalo profundo */}
          <path
            d="M 120 700 C 220 540, 360 480, 520 540 C 680 600, 780 480, 820 380 L 850 720 Z"
            fill="url(#silkGradient1)"
            opacity="0.85"
            filter="url(#petalShadow)"
          />

          {/* Capa Media - Banda de seda curvada elegante */}
          <path
            d="M 20 720 C 150 480, 380 420, 540 500 C 690 570, 760 440, 810 320 C 830 460, 740 640, 560 680 C 400 710, 180 730, 20 720 Z"
            fill="url(#silkGradient2)"
            filter="url(#petalShadow)"
          />

          {/* Capa Delantera - Pétalo con reflejo de luz */}
          <path
            d="M -30 710 C 80 560, 220 510, 380 580 C 510 640, 640 590, 720 510 C 620 630, 480 720, 260 720 Z"
            fill="url(#silkGradient3)"
            opacity="0.9"
            filter="url(#petalShadow)"
          />
        </motion.svg>
      </div>

      {/* Indicadores de paginación del slider (Píldora expandida + puntos) */}
      <div className="relative z-20 flex items-center gap-2 pt-6">
        <button
          type="button"
          onClick={() => setPausado((valor) => !valor)}
          aria-pressed={pausado}
          aria-label={pausado ? "Reanudar diapositivas" : "Pausar diapositivas"}
          className="text-foreground/70 hover:text-foreground focus-visible:ring-ring/40 mr-1 flex size-9 items-center justify-center rounded-full outline-none focus-visible:ring-2"
        >
          <HugeiconsIcon icon={pausado ? PlayIcon : PauseIcon} className="size-4" />
        </button>
        {SLIDES.map((s, idx) => {
          const isActive = current === idx;
          return (
            <button
              key={s.id}
              onClick={() => setCurrent(idx)}
              className="group focus-visible:ring-ring/40 relative flex h-9 min-w-9 items-center justify-center rounded-full p-1 outline-none focus-visible:ring-2"
              aria-current={isActive ? "true" : undefined}
              aria-label={`Ir a la diapositiva ${idx + 1}`}
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary w-8 shadow-xs"
                    : "bg-foreground/25 hover:bg-foreground/50 w-2 dark:bg-white/30"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
