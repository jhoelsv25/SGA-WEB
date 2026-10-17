"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { desuscribirDispositivoPush, getVapidPublicKey, suscribirDispositivoPush } from "../api";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "default";
    return Notification.permission;
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  });

  // Inicializar y verificar estado de suscripción
  useEffect(() => {
    if (typeof window === "undefined" || !isSupported) return;

    // Registrar o verificar el Service Worker
    navigator.serviceWorker
      .register("/sw.js")
      .then(async (registration) => {
        try {
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(Boolean(subscription));
        } catch {
          setIsSubscribed(false);
        } finally {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [isSupported]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error("Tu navegador no soporta notificaciones push.");
      return false;
    }

    setIsLoading(true);
    try {
      // 1. Solicitar permisos al usuario
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        toast.warning(
          perm === "denied"
            ? "Permiso denegado. Habilita las notificaciones en los ajustes de tu navegador."
            : "No se concedió permiso para recibir notificaciones.",
        );
        setIsLoading(false);
        return false;
      }

      // 2. Obtener clave pública VAPID del backend
      const { publicKey } = await getVapidPublicKey();
      if (!publicKey) {
        throw new Error("El servidor no tiene configurada la clave VAPID pública.");
      }

      // 3. Suscribirse con el Service Worker
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
        });
      }

      const subscriptionJson = subscription.toJSON();
      if (
        !subscriptionJson.endpoint ||
        !subscriptionJson.keys?.p256dh ||
        !subscriptionJson.keys?.auth
      ) {
        throw new Error("Error al obtener los datos criptográficos de la suscripción.");
      }

      // 4. Enviar suscripción a la base de datos del backend
      await suscribirDispositivoPush({
        endpoint: subscriptionJson.endpoint,
        keys: {
          p256dh: subscriptionJson.keys.p256dh,
          auth: subscriptionJson.keys.auth,
        },
        dispositivo: navigator.userAgent.slice(0, 150),
      });

      setIsSubscribed(true);
      toast.success("¡Notificaciones Push activadas en este dispositivo!");
      return true;
    } catch (error) {
      toast.error((error as Error).message || "Error al activar notificaciones push.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await desuscribirDispositivoPush({ endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      toast.success("Notificaciones Push desactivadas en este dispositivo.");
      return true;
    } catch (error) {
      toast.error((error as Error).message || "Error al desactivar notificaciones push.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const testNotification = useCallback(async (): Promise<void> => {
    try {
      const { enviarPruebaPush } = await import("../api");
      await enviarPruebaPush();
      toast.info("Enviando notificación de prueba... revisa tu pantalla.");
    } catch (error) {
      toast.error((error as Error).message || "Error al enviar notificación de prueba.");
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    unsubscribe,
    testNotification,
  };
}
