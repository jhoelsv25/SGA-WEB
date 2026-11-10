"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight01Icon, Video01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { urlDeArchivo } from "../../api";
import type { Material } from "../../types";

export interface VideoReproductorModalProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Extrae la URL embebible para videos de YouTube.
 */
export function obtenerEmbedYoutubeUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}

/**
 * Extrae la URL embebible para videos de Vimeo.
 */
export function obtenerEmbedVimeoUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/i,
  );
  return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : null;
}

/**
 * Extrae la URL embebible para videos alojados en Google Drive.
 */
export function obtenerEmbedDriveUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
}

export function VideoReproductorModal({
  material,
  open,
  onOpenChange,
}: VideoReproductorModalProps) {
  if (!material || !material.url) return null;

  const url = material.url;
  const youtubeEmbed = obtenerEmbedYoutubeUrl(url);
  const vimeoEmbed = obtenerEmbedVimeoUrl(url);
  const driveEmbed = obtenerEmbedDriveUrl(url);

  const embedUrl = youtubeEmbed || vimeoEmbed || driveEmbed;
  const urlArchivo = urlDeArchivo(url);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={material.titulo}
      description={material.descripcion || "Reproductor de video del material de reforzamiento."}
      icon={Video01Icon}
      size="4xl"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <p className="text-muted-foreground truncate text-xs">
            {youtubeEmbed
              ? "Video de YouTube integrado"
              : driveEmbed
                ? "Video de Google Drive integrado"
                : "Reproducción directa en plataforma"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8.5 gap-1.5 rounded-xl text-xs"
            >
              <Link href={urlArchivo} target="_blank" rel="noreferrer">
                <span>Abrir en pestaña nueva</span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
              </Link>
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-8.5 rounded-xl text-xs font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      }
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={material.titulo}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video src={urlArchivo} controls autoPlay className="h-full w-full object-contain">
            Tu navegador no soporta la reproducción de video HTML5.
          </video>
        )}
      </div>
    </Modal>
  );
}
