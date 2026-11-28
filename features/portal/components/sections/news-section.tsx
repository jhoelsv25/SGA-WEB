import * as React from "react";
import Image from "next/image";
import { siteConfig } from "@/config";
import { Revelar } from "../interactivo";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface Noticia {
  categoria: string;
  fecha: string;
  titulo: string;
  detalle: string;
  imagen: string;
}

const NOTICIAS: Noticia[] = [
  {
    categoria: "Deportivo",
    fecha: "08 de setiembre, 2026",
    titulo: "JEDPA 2026: primer puesto en fútbol damas",
    detalle: "Categoría C, etapa regional. Con disciplina y pasión, vamos a la macroregional.",
    imagen: "/assets/portada/futbol-c-slide.jpg",
  },
  {
    categoria: "Académico",
    fecha: "07 de julio, 2026",
    titulo: "Olimpiada Regional de Matemática",
    detalle: "Felicitamos a nuestras estudiantes por su destacada participación.",
    imagen: "/assets/portada/noticia-1.jpg",
  },
  {
    categoria: "Institucional",
    fecha: "09 de julio, 2026",
    titulo: "66.° Aniversario Institucional",
    detalle: "Más de seis décadas de historia, formación y servicio a nuestra comunidad.",
    imagen: "/assets/portada/noticia-2.jpg",
  },
];

export function NewsSection() {
  const [principal, ...otras] = NOTICIAS;

  return (
    <section id="vida-escolar" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-primary flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase">
              <span className="bg-primary h-px w-10" />
              Vida escolar
            </p>
            <h2 className="text-foreground mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:leading-[1.05]">
              Lo que pasa en nuestro colegio
            </h2>
          </div>
          <a
            href={siteConfig.institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
          >
            <span>Ver todas las noticias</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Revelar className="lg:col-span-7">
            <a
              href={siteConfig.institution.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative isolate flex min-h-96 items-end overflow-hidden rounded-2xl lg:min-h-136"
            >
              <Image
                src={principal.imagen}
                alt={principal.titulo}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="p-6 text-white sm:p-8">
                <p className="text-xs font-bold tracking-wider uppercase">
                  {principal.categoria} · {principal.fecha}
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {principal.titulo}
                </h3>
                <p className="mt-2 max-w-md text-sm text-white/85">{principal.detalle}</p>
              </div>
            </a>
          </Revelar>

          <div className="flex flex-col gap-6 lg:col-span-5">
            {otras.map((noticia, i) => (
              <Revelar key={noticia.titulo} retardoMs={(i + 1) * 120} className="flex flex-1">
                <a
                  href={siteConfig.institution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-1 flex-col gap-4 sm:flex-row"
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl sm:w-48 sm:shrink-0">
                    <Image
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      fill
                      sizes="(min-width: 640px) 192px, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-primary text-xs font-bold tracking-wider uppercase">
                      {noticia.categoria} · {noticia.fecha}
                    </p>
                    <h3 className="text-foreground mt-1.5 text-lg font-bold">{noticia.titulo}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {noticia.detalle}
                    </p>
                  </div>
                </a>
              </Revelar>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
