"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { getBackendOrigin } from "@/lib/api-client";
import { aulaKeys } from "./query-keys";
import type { MensajeChat } from "../types";

interface EntradaSocket {
  socket: Socket;
  refCount: number;
}

// Pool global de sockets compartidos por cursoSeccionId para evitar conexiones duplicadas
// entre ChatFlotante y ChatTab.
const poolSockets = new Map<string, EntradaSocket>();

export function useChatSocket(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  const [conectado, setConectado] = React.useState(
    () => poolSockets.get(cursoSeccionId)?.socket.connected ?? false,
  );

  React.useEffect(() => {
    if (!cursoSeccionId) return;

    let entrada = poolSockets.get(cursoSeccionId);

    if (!entrada) {
      const baseUrl = getBackendOrigin();

      const nuevoSocket = io(`${baseUrl}/chat-aula`, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      nuevoSocket.on("connect", () => {
        // Unirse a la sala del curso específico
        nuevoSocket.emit("unirse_sala", { cursoSeccionId });
      });

      // Escuchar mensajes entrantes en tiempo real
      nuevoSocket.on("chat:nuevo_mensaje", (nuevoMensaje: MensajeChat) => {
        queryClient.setQueryData<MensajeChat[]>(aulaKeys.chat(cursoSeccionId), (anteriores) => {
          if (!anteriores) return [nuevoMensaje];
          // Evitar duplicar si el emisor ya lo agregó localmente
          if (anteriores.some((m) => m.id === nuevoMensaje.id)) {
            return anteriores;
          }
          return [...anteriores, nuevoMensaje];
        });

        // Actualizar conteo de no leídos en tiempo real vía socket (cero polling HTTP)
        queryClient.setQueryData<number>(aulaKeys.chatNoLeidos(cursoSeccionId), (actual) =>
          typeof actual === "number" ? actual + 1 : 1,
        );
      });

      // Escuchar eventos de moderación (ocultado / restaurado)
      nuevoSocket.on(
        "chat:mensaje_moderado",
        ({ id, vigente }: { id: string; vigente: boolean }) => {
          queryClient.setQueryData<MensajeChat[]>(aulaKeys.chat(cursoSeccionId), (anteriores) => {
            if (!anteriores) return [];
            return anteriores.map((m) => (m.id === id ? { ...m, vigente } : m));
          });
        },
      );

      entrada = { socket: nuevoSocket, refCount: 0 };
      poolSockets.set(cursoSeccionId, entrada);
    }

    entrada.refCount += 1;
    const socket = entrada.socket;

    const handleConnect = () => setConectado(true);
    const handleDisconnect = () => setConectado(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      const actualEntrada = poolSockets.get(cursoSeccionId);
      if (!actualEntrada) return;

      actualEntrada.refCount -= 1;

      if (actualEntrada.refCount <= 0) {
        actualEntrada.socket.emit("salir_sala", { cursoSeccionId });
        actualEntrada.socket.disconnect();
        poolSockets.delete(cursoSeccionId);
      }
    };
  }, [cursoSeccionId, queryClient]);

  return { conectado };
}
