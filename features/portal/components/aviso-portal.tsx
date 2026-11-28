"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Megaphone01Icon,
} from "@hugeicons/core-free-icons";
import { AVISO_PORTAL } from "../constants/aviso";

const CLAVE_ALMACENAMIENTO = `aviso-portal:${AVISO_PORTAL.id}`;

export function AvisoPortal() {
  const [abierto, setAbierto] = React.useState(false);
  const [cerrado, setCerrado] = React.useState(false);

  React.useEffect(() => {
    if (!AVISO_PORTAL.activo) return;
    if (window.sessionStorage.getItem(CLAVE_ALMACENAMIENTO)) {
      const marca = window.setTimeout(() => setCerrado(true), 0);
      return () => window.clearTimeout(marca);
    }
    const temporizador = window.setTimeout(() => setAbierto(true), 600);
    return () => window.clearTimeout(temporizador);
  }, []);

  const cambiarEstado = (valor: boolean) => {
    setAbierto(valor);
    if (!valor) {
      window.sessionStorage.setItem(CLAVE_ALMACENAMIENTO, "1");
      setCerrado(true);
    }
  };

  return (
    <>
      {cerrado && !abierto && AVISO_PORTAL.activo && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label={`Ver aviso: ${AVISO_PORTAL.titulo}`}
          className="animate-in slide-in-from-bottom-8 fade-in from-primary group hover:shadow-primary/40 fixed bottom-5 left-5 z-40 flex items-center gap-3 rounded-full bg-linear-to-br to-[#2a0714] p-2 pr-5 text-white shadow-2xl ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 max-sm:pr-2"
        >
          <span className="relative flex size-11 items-center justify-center rounded-full bg-white text-[#8a1538]">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/60" />
            <HugeiconsIcon icon={Megaphone01Icon} className="relative size-5" />
          </span>
          <span className="text-left text-xs leading-tight font-bold max-sm:hidden">
            <span className="block text-[10px] tracking-widest text-white/70 uppercase">
              {AVISO_PORTAL.etiqueta}
            </span>
            {AVISO_PORTAL.titulo}
          </span>
        </button>
      )}
      <Dialog open={abierto} onOpenChange={cambiarEstado}>
        <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <div className="relative h-52 sm:h-60">
            <Image
              src={AVISO_PORTAL.imagen ?? "/assets/portada/slide-1.jpg"}
              alt=""
              fill
              sizes="(min-width: 640px) 512px, 100vw"
              className="object-cover"
            />
            <div className="from-primary/95 via-primary/60 absolute inset-0 bg-linear-to-t to-black/20" />
            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => cambiarEstado(false)}
              className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
            </button>
            <span className="absolute top-4 left-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-wider text-[#8a1538] uppercase shadow">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#8a1538]/60" />
                <span className="relative inline-flex size-2 rounded-full bg-[#8a1538]" />
              </span>
              {AVISO_PORTAL.etiqueta}
            </span>
          </div>

          {/* Escudo montado sobre el borde de la imagen */}
          <div className="relative -mt-12 flex justify-center">
            <span className="ring-background flex size-24 items-center justify-center rounded-full bg-white shadow-xl ring-4">
              <Image
                src={siteConfig.branding.logo}
                alt={siteConfig.institution.shortName}
                width={48}
                height={58}
                className="h-14 w-auto"
              />
            </span>
          </div>

          <DialogHeader className="items-center gap-3 px-6 pt-4 pb-6 text-center sm:px-10">
            <DialogTitle className="text-3xl font-black tracking-tight">
              {AVISO_PORTAL.titulo}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              {AVISO_PORTAL.mensaje}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[30vh] overflow-y-auto px-6 pb-6 sm:px-10">
            <p className="text-foreground text-sm font-bold">{AVISO_PORTAL.subtitulo}</p>
            <ul className="mt-3 space-y-2.5">
              {AVISO_PORTAL.puntos.map((punto) => (
                <li key={punto} className="text-muted-foreground flex items-start gap-3 text-sm">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary mt-0.5 size-5 shrink-0"
                  />
                  <span>{punto}</span>
                </li>
              ))}
            </ul>
            <p className="bg-primary/6 text-muted-foreground mt-5 rounded-xl px-4 py-3 text-xs leading-relaxed">
              {AVISO_PORTAL.nota}{" "}
              <strong className="text-foreground">
                {siteConfig.institution.contact.supportPhone} ·{" "}
                {siteConfig.institution.contact.schedule}
              </strong>
            </p>
          </div>

          <DialogFooter className="mx-0 mb-0 flex-col-reverse gap-3 rounded-none px-6 py-5 sm:flex-row sm:justify-center sm:px-10">
            <Button
              variant="ghost"
              className="h-11 rounded-lg px-6"
              onClick={() => cambiarEstado(false)}
            >
              Ahora no
            </Button>
            <Button asChild className="h-11 gap-2 rounded-lg px-7 font-semibold">
              <Link href={siteConfig.routes.login}>
                <span>{AVISO_PORTAL.accion.texto}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
