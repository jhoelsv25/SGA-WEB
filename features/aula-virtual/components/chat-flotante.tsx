"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Attachment01Icon,
  BubbleChatIcon,
  Cancel01Icon,
  Download01Icon,
  LockIcon,
  MinusSignIcon,
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
import { urlDeArchivo } from "../api";
import {
  useMensajesChat,
  useEnviarMensajeChat,
  useMarcarChatLeido,
  useChatSocket,
  useChatNoLeidos,
} from "../hooks";
import type { MensajeChat } from "../types";
import {
  OcultarContenidoModal,
  type OcultarContenidoTarget,
} from "./modals/ocultar-contenido-modal";
import { ACCEPT_ADJUNTO_INTERACCION, MENSAJES_VALIDACION } from "../consts";
import { esFormatoAdjuntoValido, esTamanoValido, formatearHora } from "../utils";

export interface ChatFlotanteProps {
  cursoSeccionId: string;
  cursoNombre?: string;
  seccionNombre?: string;
  puedeAdministrar: boolean;
  anioCerrado: boolean;
  soloLectura?: boolean;
}

export function ChatFlotante({
  cursoSeccionId,
  cursoNombre,
  seccionNombre,
  puedeAdministrar,
  anioCerrado,
  soloLectura = false,
}: ChatFlotanteProps) {
  const session = useSession();
  const usuarioActualId = session.data?.user?.id;

  const [abierto, setAbierto] = React.useState(false);
  const [minimizado, setMinimizado] = React.useState(false);

  const { conectado } = useChatSocket(cursoSeccionId);
  const { data: chatNoLeidos } = useChatNoLeidos(cursoSeccionId);

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

  // Marcar como leídos cuando el chat está abierto y hay mensajes nuevos
  React.useEffect(() => {
    if (abierto && !minimizado && cursoSeccionId) {
      marcarLeido.mutate();
    }
  }, [abierto, minimizado, cursoSeccionId, mensajes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll al final del chat cuando se abre o llegan mensajes
  React.useEffect(() => {
    if (abierto && !minimizado) {
      mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [abierto, minimizado, mensajes.length]);

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

  const noLeidos = chatNoLeidos?.noLeidos ?? 0;

  return (
    <>
      {/* Botón flotante disparador (visible cuando está cerrado o minimizado) */}
      {(!abierto || minimizado) && (
        <button
          type="button"
          onClick={() => {
            setAbierto(true);
            setMinimizado(false);
          }}
          className="bg-primary text-primary-foreground ring-background/60 fixed right-6 bottom-6 z-50 flex cursor-pointer items-center gap-2.5 rounded-full px-4 py-3 text-sm font-semibold shadow-xl ring-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          aria-label="Abrir chat en vivo del aula"
        >
          <div className="relative">
            <HugeiconsIcon icon={BubbleChatIcon} size={20} />
            {conectado && (
              <span className="ring-primary absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2" />
            )}
          </div>
          <span className="hidden sm:inline">Chat en vivo</span>
          {noLeidos > 0 && (
            <span className="flex size-5 animate-bounce items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-xs">
              {noLeidos > 99 ? "99+" : noLeidos}
            </span>
          )}
        </button>
      )}

      {/* Ventana flotante de Chat */}
      {abierto && !minimizado && (
        <aside
          aria-label="Ventana flotante de chat del aula"
          className="border-border/80 bg-card/95 animate-in slide-in-from-bottom-5 fixed right-6 bottom-6 z-50 flex h-[580px] max-h-[85vh] w-[94vw] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl duration-200 sm:w-[410px]"
        >
          {/* Cabecera del Chat Flotante */}
          <div className="border-border/60 bg-muted/40 flex items-center justify-between border-b px-4 py-3 select-none">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-xl">
                <HugeiconsIcon icon={BubbleChatIcon} size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-foreground truncate text-xs font-semibold">
                  Chat · {cursoNombre || "Clase"}
                </p>
                <div className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
                  <span
                    className={`size-1.5 rounded-full ${
                      conectado ? "animate-pulse bg-emerald-500" : "bg-muted-foreground/40"
                    }`}
                  />
                  <span>
                    {conectado ? "En vivo (WebSocket)" : "Conectando..."}
                    {seccionNombre ? ` · ${seccionNombre}` : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-7 rounded-lg"
                title="Minimizar chat"
                onClick={() => setMinimizado(true)}
              >
                <HugeiconsIcon icon={MinusSignIcon} size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-7 rounded-lg"
                title="Cerrar chat"
                onClick={() => setAbierto(false)}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </Button>
            </div>
          </div>

          {/* Alerta de año escolar cerrado */}
          {anioCerrado && (
            <Alert className="border-warning/40 bg-warning/10 rounded-none border-x-0 border-t-0 border-b p-2.5">
              <HugeiconsIcon icon={LockIcon} size={14} className="text-warning" />
              <AlertTitle className="text-xs font-semibold">Año escolar cerrado</AlertTitle>
              <AlertDescription className="text-[11px]">
                {MENSAJES_VALIDACION.ANIO_CERRADO}
              </AlertDescription>
            </Alert>
          )}

          {/* Historial de mensajes */}
          <div className="flex-1 scrollbar-thin space-y-3.5 overflow-y-auto p-4">
            <PageState
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => void refetch()}
              errorTitle="No se pudo cargar el chat"
            >
              {mensajes.length === 0 ? (
                <div className="flex h-full items-center justify-center p-4">
                  <EmptyState
                    title="Chat grupal del curso"
                    description="Todos los estudiantes y docentes de la clase pueden conversar aquí en tiempo real."
                    icon={BubbleChatIcon}
                  />
                </div>
              ) : (
                mensajes.map((m: MensajeChat) => {
                  const esMio = Boolean(usuarioActualId && m.emisorId === usuarioActualId);

                  return (
                    <div
                      key={m.id}
                      className={`flex items-start gap-2 ${esMio ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {!esMio && (
                        <UserAvatar
                          name={m.emisorNombre}
                          className="mt-0.5 size-7 shrink-0 text-[10px]"
                        />
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
                            <span className="text-[11px] font-semibold">{m.emisorNombre}</span>
                            {m.emisorRol && (
                              <StatusBadge
                                tone={m.emisorRol === "docente" ? "brand" : "neutral"}
                                className="px-1 py-0 text-[8px]"
                              >
                                {m.emisorRol === "docente" ? "Docente" : "Estudiante"}
                              </StatusBadge>
                            )}
                          </div>
                        )}

                        {m.contenido ? (
                          <p className="wrap-break-words leading-relaxed whitespace-pre-wrap">
                            {m.contenido}
                          </p>
                        ) : null}

                        {m.adjuntoUrl && (
                          <div
                            className={`mt-2 flex items-center gap-2 rounded-lg p-2 text-xs ${
                              esMio ? "bg-primary-foreground/15" : "bg-background/80 border"
                            }`}
                          >
                            <HugeiconsIcon icon={Attachment01Icon} size={14} className="shrink-0" />
                            <span className="flex-1 truncate text-[11px] font-medium">
                              {m.adjuntoUrl.split("/").pop() || "Archivo adjunto"}
                            </span>
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className={`h-6 px-2 text-[10px] ${
                                esMio
                                  ? "text-primary-foreground hover:bg-primary-foreground/20"
                                  : "text-foreground"
                              }`}
                            >
                              <a href={urlDeArchivo(m.adjuntoUrl)} target="_blank" rel="noreferrer">
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
                          <span>{formatearHora(m.enviadoEn)}</span>

                          {/* Botón de moderación para el docente */}
                          {puedeAdministrar && (
                            <button
                              type="button"
                              className="text-destructive ml-1 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
                              title="Ocultar mensaje"
                              onClick={() =>
                                setTargetModeracion({
                                  tipo: "chat",
                                  id: m.id,
                                  descripcion: m.contenido || "Mensaje con adjunto",
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
                })
              )}
              <div ref={mensajesEndRef} />
            </PageState>
          </div>

          {/* Formulario de entrada de mensajes */}
          {!anioCerrado && !soloLectura && (
            <form
              onSubmit={handleEnviar}
              className="border-border/60 bg-muted/20 space-y-2 border-t p-2.5"
            >
              {archivo && (
                <div className="bg-muted flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs">
                  <HugeiconsIcon
                    icon={Attachment01Icon}
                    size={14}
                    className="text-primary shrink-0"
                  />
                  <span className="flex-1 truncate font-medium">{archivo.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setArchivo(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
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
                  disabled={enviarMensaje.isPending}
                >
                  <HugeiconsIcon icon={Attachment01Icon} size={16} />
                </Button>

                <Input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escribe un mensaje a la clase..."
                  className="h-8.5 flex-1 text-xs"
                  maxLength={2000}
                  disabled={enviarMensaje.isPending}
                />

                <Button
                  type="submit"
                  size="icon"
                  className="size-8.5 shrink-0 gap-1"
                  disabled={enviarMensaje.isPending}
                >
                  {enviarMensaje.isPending ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <HugeiconsIcon icon={Sent02Icon} size={16} />
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Modal de moderación */}
          <OcultarContenidoModal
            open={Boolean(targetModeracion)}
            onOpenChange={(open) => !open && setTargetModeracion(null)}
            target={targetModeracion}
            cursoSeccionId={cursoSeccionId}
          />
        </aside>
      )}
    </>
  );
}
