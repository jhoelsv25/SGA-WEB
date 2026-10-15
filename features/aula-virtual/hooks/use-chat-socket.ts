"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { API_BASE_URL, getAccessToken } from "@/lib/api-client";
import { aulaKeys } from "./query-keys";
import type { MensajeChat } from "../types";

function obtenerSocketUrl(): string {
  // Extrae la URL base del backend desde API_BASE_URL (ej. http://localhost:3000/api -> http://localhost:3000)
  try {
    const url = new URL(API_BASE_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "http://localhost:3000";
  }
}

export function useChatSocket(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  const socketRef = React.useRef<Socket | null>(null);
  const [conectado, setConectado] = React.useState(false);

  React.useEffect(() => {
    if (!cursoSeccionId) return;

    const baseUrl = obtenerSocketUrl();
    const token = getAccessToken();

    const socket = io(`${baseUrl}/chat-aula`, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        token: token ?? undefined,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConectado(true);
      // Unirse a la sala del curso específico
      socket.emit("unirse_sala", { cursoSeccionId });
    });

    socket.on("disconnect", () => {
      setConectado(false);
    });

    // Escuchar mensajes entrantes en tiempo real
    socket.on("chat:nuevo_mensaje", (nuevoMensaje: MensajeChat) => {
      queryClient.setQueryData<MensajeChat[]>(aulaKeys.chat(cursoSeccionId), (anteriores) => {
        if (!anteriores) return [nuevoMensaje];
        // Evitar duplicar si el emisor ya lo agregó localmente
        if (anteriores.some((m) => m.id === nuevoMensaje.id)) {
          return anteriores;
        }
        return [...anteriores, nuevoMensaje];
      });
    });

    // Escuchar eventos de moderación (ocultado / restaurado)
    socket.on("chat:mensaje_moderado", ({ id, vigente }: { id: string; vigente: boolean }) => {
      queryClient.setQueryData<MensajeChat[]>(aulaKeys.chat(cursoSeccionId), (anteriores) => {
        if (!anteriores) return [];
        return anteriores.map((m) => (m.id === id ? { ...m, vigente } : m));
      });
    });

    return () => {
      socket.emit("salir_sala", { cursoSeccionId });
      socket.disconnect();
      socketRef.current = null;
      setConectado(false);
    };
  }, [cursoSeccionId, queryClient]);

  return { conectado };
}
