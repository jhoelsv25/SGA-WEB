"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

const INTERVALO_MS = 6000;

const DIAPOSITIVAS = [
  { src: "/assets/portada/slide-1.jpg", alt: "Estudiantes de la I.E. Nuestra Señora del Carmen" },
  { src: "/assets/portada/slide-2.jpg", alt: "Excelencia académica en el colegio" },
  { src: "/assets/portada/futbol-c-slide.jpg", alt: "Campeonas de fútbol en la etapa regional" },
];

export function HeroCarrusel() {
  const [indice, setIndice] = React.useState(0);
  const [pausado, setPausado] = React.useState(false);

  React.useEffect(() => {
    if (pausado) return;
    const temporizador = window.setInterval(
      () => setIndice((actual) => (actual + 1) % DIAPOSITIVAS.length),
      INTERVALO_MS,
    );
    return () => window.clearInterval(temporizador);
  }, [pausado]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {DIAPOSITIVAS.map((diapositiva, i) => (
        <Image
          key={diapositiva.src}
          src={diapositiva.src}
          alt={diapositiva.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={cn(
            "object-cover transition-[opacity,transform] duration-1000",
            i === indice ? "scale-110 opacity-100 duration-[8000ms]" : "scale-100 opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

      {(
        [
          {
            etiqueta: "Imagen anterior",
            icono: ArrowLeft01Icon,
            paso: -1,
            lado: "left-3 sm:left-6",
          },
          {
            etiqueta: "Imagen siguiente",
            icono: ArrowRight01Icon,
            paso: 1,
            lado: "right-3 sm:right-6",
          },
        ] as const
      ).map((flecha) => (
        <button
          key={flecha.etiqueta}
          type="button"
          aria-label={flecha.etiqueta}
          onClick={() =>
            setIndice((a) => (a + flecha.paso + DIAPOSITIVAS.length) % DIAPOSITIVAS.length)
          }
          className={cn(
            "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30 sm:flex",
            flecha.lado,
          )}
        >
          <HugeiconsIcon icon={flecha.icono} className="size-5" />
        </button>
      ))}

      <div
        className="absolute right-4 bottom-24 z-10 flex gap-2 sm:right-8 lg:right-12"
        role="tablist"
        aria-label="Imágenes del colegio"
      >
        {DIAPOSITIVAS.map((diapositiva, i) => (
          <button
            key={diapositiva.src}
            type="button"
            role="tab"
            aria-selected={i === indice}
            aria-label={`Ver imagen ${i + 1}`}
            onClick={() => setIndice(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === indice ? "w-8 bg-white" : "w-3 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}
