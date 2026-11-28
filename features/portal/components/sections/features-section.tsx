"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { Revelar } from "../interactivo";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Award01Icon,
  DatabaseIcon,
  LockIcon,
  Shield01Icon,
  SmartPhone01Icon,
  Time02Icon,
} from "@hugeicons/core-free-icons";

interface ServicioItem {
  numero: string;
  icono: IconSvgElement;
  titulo: string;
  detalle: string;
  dirigidoA: string;
}

const SERVICIOS: ServicioItem[] = [
  {
    numero: "01",
    icono: Time02Icon,
    titulo: "Asistencia del colegio",
    dirigidoA: "Docentes y auxiliares",
    detalle:
      "Marcación en los kioskos del colegio, con cálculo automático de tardanzas según turno y compatibilidad con lector biométrico.",
  },
  {
    numero: "02",
    icono: Award01Icon,
    titulo: "Libretas del SIAGIE",
    dirigidoA: "Estudiantes y apoderados",
    detalle:
      "Las libretas oficiales se publican en PDF para su descarga al cierre de cada bimestre.",
  },
  {
    numero: "03",
    icono: LockIcon,
    titulo: "Acceso según tu rol",
    dirigidoA: "Toda la comunidad",
    detalle:
      "Cada usuario ve solo las herramientas de su rol. La cuenta se bloquea tras varios intentos fallidos.",
  },
  {
    numero: "04",
    icono: DatabaseIcon,
    titulo: "Registro de cambios",
    dirigidoA: "Dirección y coordinación",
    detalle:
      "Todo cambio en notas, asistencias o matrículas queda registrado con usuario, fecha y detalle.",
  },
  {
    numero: "05",
    icono: SmartPhone01Icon,
    titulo: "Uso en cualquier equipo",
    dirigidoA: "Toda la comunidad",
    detalle: "Se usa desde el navegador en computadora, tablet o celular, sin instalar nada.",
  },
  {
    numero: "06",
    icono: Shield01Icon,
    titulo: "Datos protegidos (Ley N.° 29733)",
    dirigidoA: "Toda la comunidad",
    detalle:
      "La información de estudiantes, docentes y apoderados se resguarda según la normativa vigente.",
  },
];

const TOTAL = SERVICIOS.length;

function medirSlider(contenedor: HTMLUListElement | null) {
  if (!contenedor || contenedor.children.length < TOTAL + 1) return null;
  const primero = contenedor.children[0] as HTMLElement;
  const segundo = contenedor.children[1] as HTMLElement;
  const siguienteBloque = contenedor.children[TOTAL] as HTMLElement;
  return {
    contenedor,
    paso: segundo.offsetLeft - primero.offsetLeft,
    anchoBloque: siguienteBloque.offsetLeft - primero.offsetLeft,
  };
}

function saltarSinAnimar(contenedor: HTMLUListElement, posicion: number) {
  contenedor.style.scrollBehavior = "auto";
  contenedor.style.scrollSnapType = "none";
  contenedor.scrollLeft = posicion;
  contenedor.style.scrollBehavior = "";
  contenedor.style.scrollSnapType = "";
}

export function FeaturesSection() {
  const pista = React.useRef<HTMLUListElement>(null);
  const arrastre = React.useRef({ activo: false, inicioX: 0, inicioScroll: 0, movido: false });
  const [indice, setIndice] = React.useState(0);
  const [pausado, setPausado] = React.useState(false);
  const total = TOTAL;
  // Se repite la lista tres veces para simular un bucle infinito
  const elementos = React.useMemo(() => [...SERVICIOS, ...SERVICIOS, ...SERVICIOS], []);

  // Ubica el slider en el bloque central al montar
  React.useEffect(() => {
    const datos = medirSlider(pista.current);
    if (datos) saltarSinAnimar(datos.contenedor, datos.anchoBloque);
  }, []);

  const mover = React.useCallback((pasos: number) => {
    const datos = medirSlider(pista.current);
    if (!datos) return;
    const actual = Math.round(datos.contenedor.scrollLeft / datos.paso);
    datos.contenedor.scrollTo({ left: (actual + pasos) * datos.paso, behavior: "smooth" });
  }, []);

  const alDesplazar = () => {
    const datos = medirSlider(pista.current);
    if (!datos) return;
    const { contenedor, paso, anchoBloque } = datos;
    // Al acercarse a un extremo, se salta al bloque equivalente del centro
    if (contenedor.scrollLeft < anchoBloque * 0.5) {
      saltarSinAnimar(contenedor, contenedor.scrollLeft + anchoBloque);
    } else if (contenedor.scrollLeft > anchoBloque * 1.5) {
      saltarSinAnimar(contenedor, contenedor.scrollLeft - anchoBloque);
    }
    const actual = Math.round(contenedor.scrollLeft / paso);
    setIndice(((actual % total) + total) % total);
  };

  // Avance automático (se pausa con el mouse encima o al arrastrar)
  React.useEffect(() => {
    if (pausado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const temporizador = window.setInterval(() => mover(1), 4500);
    return () => window.clearInterval(temporizador);
  }, [pausado, mover]);

  const iniciarArrastre = (evento: React.PointerEvent<HTMLUListElement>) => {
    if (evento.pointerType !== "mouse" || !pista.current) return;
    arrastre.current = {
      activo: true,
      inicioX: evento.clientX,
      inicioScroll: pista.current.scrollLeft,
      movido: false,
    };
  };
  const moverArrastre = (evento: React.PointerEvent<HTMLUListElement>) => {
    const estado = arrastre.current;
    if (!estado.activo || !pista.current) return;
    const delta = evento.clientX - estado.inicioX;
    if (Math.abs(delta) > 4) estado.movido = true;
    pista.current.style.scrollSnapType = "none";
    pista.current.scrollLeft = estado.inicioScroll - delta;
  };
  const terminarArrastre = () => {
    arrastre.current.activo = false;
    if (pista.current) pista.current.style.scrollSnapType = "";
  };

  return (
    <section
      id="caracteristicas"
      className="via-primary relative isolate overflow-hidden bg-linear-to-br from-[#b3224f] to-[#2a0714] py-20 text-white sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 -z-10 size-[36rem] rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-32 -z-10 size-[32rem] rounded-full bg-black/30 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Revelar className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-white/80 uppercase">
              <span className="h-px w-10 bg-white/70" />
              Qué ofrece
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:leading-[1.05]">
              Las herramientas del colegio, en un solo lugar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              {siteConfig.acronym} es la intranet de {siteConfig.institution.shortName}, de la{" "}
              {siteConfig.institution.administration.ugel} ·{" "}
              {siteConfig.institution.administration.dre}.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-sm font-bold text-white/70">
              {String(indice + 1).padStart(2, "0")} / {String(SERVICIOS.length).padStart(2, "0")}
            </span>
            {[
              { etiqueta: "Anterior", icono: ArrowLeft01Icon, paso: -1 },
              { etiqueta: "Siguiente", icono: ArrowRight01Icon, paso: 1 },
            ].map((boton) => (
              <button
                key={boton.etiqueta}
                type="button"
                aria-label={boton.etiqueta}
                onClick={() => mover(boton.paso)}
                className="flex size-12 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition hover:bg-white hover:text-[#8a1538]"
              >
                <HugeiconsIcon icon={boton.icono} className="size-5" />
              </button>
            ))}
          </div>
        </Revelar>
      </div>

      {/* Slider horizontal: arrastrable con el mouse, deslizable en celular */}
      <ul
        ref={pista}
        onScroll={alDesplazar}
        onPointerDown={iniciarArrastre}
        onPointerMove={moverArrastre}
        onPointerUp={terminarArrastre}
        onPointerLeave={() => {
          terminarArrastre();
          setPausado(false);
        }}
        onMouseEnter={() => setPausado(true)}
        className="mt-12 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 select-none active:cursor-grabbing sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {elementos.map((item, posicion) => {
          const i = posicion % total;
          return (
            <li
              key={`${item.numero}-${posicion}`}
              aria-hidden={posicion < total || posicion >= total * 2}
              onClick={() => !arrastre.current.movido && mover(i - indice)}
              className={cn(
                "group relative flex min-h-80 w-[82vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border p-7 transition-all duration-500 sm:w-96",
                i === indice
                  ? "border-white/40 bg-white/16 shadow-2xl backdrop-blur-md"
                  : "border-white/10 bg-white/5 opacity-70 hover:opacity-100",
              )}
            >
              <span className="pointer-events-none absolute -right-2 -bottom-6 font-mono text-[9rem] leading-none font-black text-white/8 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2">
                {item.numero}
              </span>
              <div className="relative">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#8a1538] shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  <HugeiconsIcon icon={item.icono} className="size-7" />
                </span>
                <h3 className="mt-6 text-2xl font-black tracking-tight">{item.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{item.detalle}</p>
              </div>
              <span className="relative mt-6 inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
                {item.dirigidoA}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 gap-2" role="tablist" aria-label="Servicios">
          {SERVICIOS.map((item, i) => (
            <button
              key={item.numero}
              type="button"
              role="tab"
              aria-selected={i === indice}
              aria-label={item.titulo}
              onClick={() => mover(i - indice)}
              className="group h-6 flex-1"
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-all",
                  i === indice ? "bg-white" : "bg-white/25 group-hover:bg-white/50",
                )}
              />
            </button>
          ))}
        </div>
        <Button asChild variant="secondary" className="h-11 gap-2 rounded-lg px-6 font-semibold">
          <Link href={siteConfig.routes.login}>
            <span>Ingresar a la intranet</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
