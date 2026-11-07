"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon, Download01Icon, ShieldAlertIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { urlDeArchivo } from "../../api";
import { formatearHora } from "../../utils";
import type { MensajeChat } from "../../types";
import type { OcultarContenidoTarget } from "../modals/ocultar-contenido-modal";

export interface ChatMensajeBurbujaProps {
  mensaje: MensajeChat;
  esMio: boolean;
  puedeAdministrar: boolean;
  onModerar?: (target: OcultarContenidoTarget) => void;
}

export function ChatMensajeBurbuja({
  mensaje,
  esMio,
  puedeAdministrar,
  onModerar,
}: ChatMensajeBurbujaProps) {
  return (
    <div className={`flex items-start gap-2 ${esMio ? "flex-row-reverse" : "flex-row"}`}>
      {!esMio && (
        <UserAvatar name={mensaje.emisorNombre} className="mt-0.5 size-7 shrink-0 text-[10px]" />
      )}

      <div
        className={`group relative max-w-[80%] rounded-2xl p-2.5 text-xs shadow-2xs ${
          esMio
            ? "bg-primary text-primary-foreground rounded-br-xs"
            : "bg-muted/70 text-foreground border-border/50 rounded-bl-xs border"
        }`}
      >
        {!esMio && (
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-[11px] font-semibold">{mensaje.emisorNombre}</span>
            {mensaje.emisorRol && (
              <StatusBadge
                tone={mensaje.emisorRol === "docente" ? "brand" : "neutral"}
                className="px-1 py-0 text-[8px]"
              >
                {mensaje.emisorRol === "docente" ? "Docente" : "Estudiante"}
              </StatusBadge>
            )}
          </div>
        )}

        {mensaje.contenido ? (
          <p className="wrap-break-words leading-relaxed whitespace-pre-wrap">
            {mensaje.contenido}
          </p>
        ) : null}

        {mensaje.adjuntoUrl && (
          <div
            className={`mt-2 flex items-center gap-2 rounded-lg p-2 text-xs ${
              esMio ? "bg-primary-foreground/15" : "bg-background/80 border"
            }`}
          >
            <HugeiconsIcon icon={Attachment01Icon} size={14} className="shrink-0" />
            <span className="flex-1 truncate text-[11px] font-medium">
              {mensaje.adjuntoUrl.split("/").pop() || "Archivo adjunto"}
            </span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-[10px] ${
                esMio ? "text-primary-foreground hover:bg-primary-foreground/20" : "text-foreground"
              }`}
            >
              <a href={urlDeArchivo(mensaje.adjuntoUrl)} target="_blank" rel="noreferrer">
                <HugeiconsIcon icon={Download01Icon} size={11} className="mr-1" />
                Ver
              </a>
            </Button>
          </div>
        )}

        <div
          className={`mt-1 flex items-center justify-end gap-1.5 text-[9px] ${
            esMio ? "text-primary-foreground/75" : "text-muted-foreground"
          }`}
        >
          <span>{formatearHora(mensaje.enviadoEn)}</span>

          {/* Botón de moderación para el docente */}
          {puedeAdministrar && onModerar && (
            <button
              type="button"
              className="text-destructive ml-1 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
              title="Ocultar mensaje"
              onClick={() =>
                onModerar({
                  tipo: "chat",
                  id: mensaje.id,
                  descripcion: mensaje.contenido || "Mensaje con adjunto",
                })
              }
            >
              <HugeiconsIcon icon={ShieldAlertIcon} size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
