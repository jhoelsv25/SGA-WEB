"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  Cancel01Icon,
  LockIcon,
  MinusSignIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { PageState } from "@/components/common/page-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/lib/toast";
import { useSession } from "@/features/auth";
import {
  useMensajesChat,
  useEnviarMensajeChat,
  useMarcarChatLeido,
  useChatSocket,
  useChatNoLeidos,
} from "../../hooks";
import type { MensajeChat } from "../../types";
import {
  OcultarContenidoModal,
  type OcultarContenidoTarget,
} from "../modals/ocultar-contenido-modal";
import { MENSAJES_VALIDACION } from "../../consts";
import { ChatMensajeBurbuja } from "./chat-mensaje-burbuja";
import { ChatInputBar } from "./chat-input-bar";

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

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() && !archivo) return;

    try {
      await enviarMensaje.mutateAsync({
        payload: { mensaje: texto.trim() || undefined },
        archivo: archivo ?? undefined,
      });
      setTexto("");
      setArchivo(null);
    } catch {
      toast.error("No se pudo enviar el mensaje");
    }
  };

  const handleAbrirOExpandir = () => {
    if (!abierto) {
      setAbierto(true);
      setMinimizado(false);
    } else if (minimizado) {
      setMinimizado(false);
    }
  };

  const noLeidosCount = chatNoLeidos?.noLeidos ?? 0;

  return (
    <>
      {/* Botón flotante FAB */}
      {(!abierto || minimizado) && (
        <aside
          aria-label="Acceso al chat flotante del curso"
          className="fixed right-6 bottom-6 z-40 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleAbrirOExpandir}
            className="group bg-primary text-primary-foreground hover:bg-primary/95 relative flex h-13 items-center gap-2.5 rounded-full px-4.5 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Abrir chat en vivo"
          >
            <div className="relative">
              <HugeiconsIcon icon={BubbleChatIcon} size={22} />
              {/* Indicador de conexión */}
              <span
                className={`absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white transition-colors ${
                  conectado ? "bg-emerald-400" : "bg-amber-400"
                }`}
                title={conectado ? "Conectado al chat en vivo" : "Conectando al chat..."}
              />
            </div>
            <span className="text-xs font-semibold tracking-wide">Chat en vivo</span>

            {/* Badge de mensajes no leídos */}
            {noLeidosCount > 0 && (
              <span className="bg-destructive text-destructive-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold shadow-xs">
                {noLeidosCount > 99 ? "99+" : noLeidosCount}
              </span>
            )}
          </button>
        </aside>
      )}

      {/* Ventana flotante del chat */}
      {abierto && !minimizado && (
        <aside
          aria-label="Ventana de chat del aula virtual"
          className="border-border bg-card fixed right-4 bottom-4 z-40 flex h-145 w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-200 sm:right-6 sm:bottom-6 sm:w-102"
        >
          {/* Cabecera del chat */}
          <div className="border-border/80 bg-muted/40 flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-xl">
                  <HugeiconsIcon icon={BubbleChatIcon} size={18} />
                </div>
                <span
                  className={`absolute -top-0.5 -right-0.5 size-2 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                    conectado ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-foreground truncate text-xs font-bold">
                  {cursoNombre || "Chat de la clase"}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span
                    className={`size-1.5 rounded-full ${conectado ? "bg-emerald-500" : "bg-amber-500"}`}
                  />
                  <span className="text-muted-foreground font-medium">
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
                mensajes.map((m: MensajeChat) => (
                  <ChatMensajeBurbuja
                    key={m.id}
                    mensaje={m}
                    esMio={Boolean(usuarioActualId && m.emisorId === usuarioActualId)}
                    puedeAdministrar={puedeAdministrar}
                    onModerar={setTargetModeracion}
                  />
                ))
              )}
              <div ref={mensajesEndRef} />
            </PageState>
          </div>

          {/* Formulario de entrada de mensajes o aviso de modo supervisión */}
          {!anioCerrado && !soloLectura ? (
            <ChatInputBar
              texto={texto}
              onTextoChange={setTexto}
              archivo={archivo}
              onArchivoChange={setArchivo}
              onEnviar={handleEnviar}
              isPending={enviarMensaje.isPending}
            />
          ) : soloLectura ? (
            <div className="border-border/60 bg-muted/30 text-muted-foreground flex items-center justify-center gap-2 border-t px-4 py-3 text-center text-xs">
              <HugeiconsIcon icon={ViewIcon} size={15} className="text-primary shrink-0" />
              <span>
                <strong>Modo supervisión:</strong> Solo el docente a cargo y los estudiantes del
                aula pueden enviar mensajes.
              </span>
            </div>
          ) : null}

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
