/* eslint-disable */
// Service Worker para SGA (PWA y Web Push Notifications)
const CACHE_NAME = "sga-cache-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Evento de Notificación Push en segundo plano
self.addEventListener("push", (event) => {
  let data = {
    title: "SGA Carmelinas",
    body: "Tienes una nueva notificación escolar.",
    url: "/admin/notificaciones",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/assets/icons/icon-192x192.png",
    badge: data.badge || "/assets/icons/icon-72x72.png",
    tag: data.tag || "sga-notification",
    data: {
      url: data.url || (data.data && data.data.url) || "/admin/notificaciones",
    },
    vibrate: [100, 50, 100],
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title || "SGA Carmelinas", options));
});

// Clic en la notificación: enfocar ventana existente o abrir una nueva
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen =
    (event.notification.data && event.notification.data.url) || "/admin/notificaciones";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }),
  );
});
