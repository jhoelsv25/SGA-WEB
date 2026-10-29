"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Attachment01Icon,
  BubbleChatIcon,
  Cancel01Icon,
  Download01Icon,
  LockIcon,
  Sent02Icon,
  ShieldAlertIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { EmptyState } from "@/components/common/empty-state";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/lib/toast";
import { useSession } from "@/features/auth";
import { urlDeArchivo } from "../../api";
import {
  useMensajesChat,
  useEnviarMensajeChat,
  useMarcarChatLeido,
  useChatSocket,
} from "../../hooks";
import type { MensajeChat } from "../../types";
import {
  OcultarContenidoModal,
  type OcultarContenidoTarget,
} from "../modals/ocultar-contenido-modal";

import { ACCEPT_ADJUNTO_INTERACCION, MENSAJES_VALIDACION } from "../../consts";
import { esFormatoAdjuntoValido, esTamanoValido, formatearHora } from "../../utils";

export function ChatTab({
  cursoSeccionId,
  puedeAdministrar,
  anioCerrado,
  soloLectura = false,
}: {
  cursoSeccionId: string;
  puedeAdministrar: boolean;
  anioCerrado: boolean;
  soloLectura?: boolean;
}) {
  const session = useSession();
  const usuarioActualId = session.data?.user?.id;

  const { conectado } = useChatSocket(cursoSeccionId);

  const {
    data: mensajes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useMensajesChat(cursoSeccionId);

  const enviarMensaje = useEnviarMensajeChat(cursoSeccionId);
  const marcarLeido = useMarcarChatLeido(cursoSeccionId);

  const [texto, setTexto] = React.useState("");
  const [archivo, setArchivo] = React.useState<File | null>(null);
  const [targetModeracion, setTargetModeracion] = React.useState<OcultarContenidoTarget | null>(
    null,
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const mensajesEndRef = React.useRef<HTMLDivElement | null>(null);

  // Marcar como leídos al entrar y cuando cambian los mensajes
  React.useEffect(() => {
    if (cursoSeccionId) {
      marcarLeido.mutate();
    }
  }, [cursoSeccionId, mensajes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll al final del chat cuando llegan mensajes
  React.useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes.length]);

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
    setArchivo(file);
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (anioCerrado) {
      toast.error(MENSAJES_VALIDACION.ANIO_CERRADO);
      return;
    }

    const contenidoLimpio = texto.trim();
    if (!contenidoLimpio && !archivo) {
      toast.error(MENSAJES_VALIDACION.VACIO);
      return;
    }

    enviarMensaje.mutate(
      {
        payload: {
          mensaje: contenidoLimpio,
        },
        archivo,
      },
      {
        onSuccess: () => {
          setTexto("");
          setArchivo(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      },
    );
  };

  return (
    <div className="bg-card flex h-162 flex-col overflow-hidden rounded-xl border shadow-xs">
      {/* Barra de estado en vivo (WebSocket) */}
      <div className="bg-muted/30 text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          <HugeiconsIcon icon={BubbleChatIcon} size={14} />
          <span>Chat de la clase</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span
            className={`size-2 rounded-full ${
              conectado ? "animate-pulse bg-emerald-500" : "bg-muted-foreground/40"
            }`}
          />
          <span className="font-medium">{conectado ? "En vivo (WebSocket)" : "Conectando..."}</span>
        </div>
      </div>

      {/* Alerta si el año está cerrado */}
      {anioCerrado && (
        <Alert className="border-warning/40 bg-warning/10 rounded-none border-x-0 border-t-0 border-b p-3">
          <HugeiconsIcon icon={LockIcon} size={16} className="text-warning" />
          <AlertTitle className="text-xs font-semibold">Año escolar cerrado</AlertTitle>
          <AlertDescription className="text-[11px]">
            {MENSAJES_VALIDACION.ANIO_CERRADO}
          </AlertDescription>
        </Alert>
      )}

      {/* Historial de mensajes */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          errorTitle="No se pudo cargar el chat"
        >
          {mensajes.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                title="Chat grupal del curso"
                description="Todos los estudiantes y docentes del aula pueden participar en esta sala común."
                icon={BubbleChatIcon}
              />
            </div>
          ) : (
            mensajes.map((m: MensajeChat) => {
              const esMio = Boolean(usuarioActualId && m.emisorId === usuarioActualId);

              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${esMio ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!esMio && (
                    <UserAvatar name={m.emisorNombre} className="mt-1 size-8 shrink-0 text-xs" />
                  )}

                  <div
                    className={`group relative max-w-[75%] rounded-2xl p-3 text-sm shadow-2xs ${
                      esMio
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : "bg-muted/70 text-foreground border-border/50 rounded-bl-xs border"
                    }`}
                  >
                    {!esMio && (
                      <div className="mb-1 flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{m.emisorNombre}</span>
                        {m.emisorRol && (
                          <StatusBadge
                            tone={m.emisorRol === "docente" ? "brand" : "neutral"}
                            className="px-1 py-0 text-[9px]"
                          >
                            {m.emisorRol === "docente" ? "Docente" : "Estudiante"}
                          </StatusBadge>
                        )}
                      </div>
                    )}

                    {m.contenido ? (
                      <p className="wrap-break-words text-xs leading-relaxed whitespace-pre-wrap">
                        {m.contenido}
                      </p>
                    ) : null}

                    {m.adjuntoUrl && (
                      <div
                        className={`mt-2 flex items-center gap-2 rounded-lg p-2 text-xs ${
                          esMio ? "bg-primary-foreground/10" : "bg-background/80 border"
                        }`}
                      >
                        <HugeiconsIcon icon={Attachment01Icon} size={15} className="shrink-0" />
                        <span className="flex-1 truncate text-[11px] font-medium">
                          {m.adjuntoUrl.split("/").pop() || "Archivo adjunto"}
                        </span>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 text-[11px] ${
                            esMio
                              ? "text-primary-foreground hover:bg-primary-foreground/20"
                              : "text-foreground"
                          }`}
                        >
                          <a href={urlDeArchivo(m.adjuntoUrl)} target="_blank" rel="noreferrer">
                            <HugeiconsIcon icon={Download01Icon} size={12} className="mr-1" />
                            Ver
                          </a>
                        </Button>
                      </div>
                    )}

                    <div
                      className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${
                        esMio ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      <span>{formatearHora(m.enviadoEn)}</span>

                      {/* Botón de moderación para el docente */}
                      {puedeAdministrar && (
                        <button
                          type="button"
                          className="text-destructive ml-1 opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
                          title="Ocultar mensaje"
                          onClick={() =>
                            setTargetModeracion({
                              tipo: "chat",
                              id: m.id,
                              descripcion: m.contenido || "Mensaje con adjunto",
                            })
                          }
                        >
                          <HugeiconsIcon icon={ShieldAlertIcon} size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={mensajesEndRef} />
        </PageState>
      </div>

      {/* Barra de entrada de mensajes */}
      {!anioCerrado && !soloLectura && (
        <form onSubmit={handleEnviar} className="bg-muted/20 space-y-2 border-t p-3">
          {archivo && (
            <div className="bg-muted flex items-center gap-2 rounded-md px-2.5 py-1 text-xs">
              <HugeiconsIcon icon={Attachment01Icon} size={14} className="text-primary shrink-0" />
              <span className="flex-1 truncate font-medium">{archivo.name}</span>
              <button
                type="button"
                onClick={() => {
                  setArchivo(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
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
              className="text-muted-foreground hover:text-foreground size-9 shrink-0"
              title="Adjuntar archivo (máx 10 MB)"
              onClick={() => fileInputRef.current?.click()}
              disabled={enviarMensaje.isPending}
            >
              <HugeiconsIcon icon={Attachment01Icon} size={18} />
            </Button>

            <Input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe un mensaje al curso..."
              className="flex-1 text-xs"
              maxLength={2000}
              disabled={enviarMensaje.isPending}
            />

            <Button
              type="submit"
              size="icon"
              className="size-9 shrink-0 gap-1"
              disabled={enviarMensaje.isPending}
            >
              {enviarMensaje.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <HugeiconsIcon icon={Sent02Icon} size={18} />
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Modal de confirmación para moderar mensaje */}
      <OcultarContenidoModal
        open={Boolean(targetModeracion)}
        onOpenChange={(open) => !open && setTargetModeracion(null)}
        target={targetModeracion}
        cursoSeccionId={cursoSeccionId}
      />
    </div>
  );
}
