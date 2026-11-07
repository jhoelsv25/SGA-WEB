"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon, Cancel01Icon, Sent02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/common/spinner";
import { toast } from "@/lib/toast";
import { ACCEPT_ADJUNTO_INTERACCION, MENSAJES_VALIDACION } from "../../consts";
import { esFormatoAdjuntoValido, esTamanoValido } from "../../utils";

export interface ChatInputBarProps {
  texto: string;
  onTextoChange: (val: string) => void;
  archivo: File | null;
  onArchivoChange: (file: File | null) => void;
  onEnviar: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function ChatInputBar({
  texto,
  onTextoChange,
  archivo,
  onArchivoChange,
  onEnviar,
  isPending,
}: ChatInputBarProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!esFormatoAdjuntoValido(file)) {
      toast.error(MENSAJES_VALIDACION.FORMATO_NO_PERMITIDO);
      e.target.value = "";
      return;
    }

    if (!esTamanoValido(file)) {
      toast.error(MENSAJES_VALIDACION.ADJUNTO_PESADO);
      e.target.value = "";
      return;
    }

    onArchivoChange(file);
  };

  const handleRemoverArchivo = () => {
    onArchivoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form onSubmit={onEnviar} className="border-border/60 bg-muted/20 space-y-2 border-t p-2.5">
      {archivo && (
        <div className="bg-muted flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs">
          <HugeiconsIcon icon={Attachment01Icon} size={14} className="text-primary shrink-0" />
          <span className="flex-1 truncate font-medium">{archivo.name}</span>
          <button
            type="button"
            onClick={handleRemoverArchivo}
            className="text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <input
          type="file"
          ref={fileInputRef}
          accept={ACCEPT_ADJUNTO_INTERACCION}
          className="hidden"
          onChange={handleArchivoChange}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-8.5 shrink-0"
          title="Adjuntar archivo (máx 10 MB)"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          <HugeiconsIcon icon={Attachment01Icon} size={16} />
        </Button>

        <Input
          value={texto}
          onChange={(e) => onTextoChange(e.target.value)}
          placeholder="Escribe un mensaje a la clase..."
          className="h-8.5 flex-1 text-xs"
          maxLength={2000}
          disabled={isPending}
        />

        <Button type="submit" size="icon" className="size-8.5 shrink-0 gap-1" disabled={isPending}>
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={Sent02Icon} size={16} />
          )}
        </Button>
      </div>
    </form>
  );
}
