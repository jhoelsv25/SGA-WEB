import {
  DashboardSquare01Icon,
  UserIcon,
  Notification01Icon,
  HelpCircleIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

export const defaultNavigation: NavSection[] = [
  {
    title: "General",
    items: [
      {
        id: "default-dashboard",
        label: "Panel Principal",
        link: "/dashboard",
        icon: DashboardSquare01Icon,
        permissions: ["dashboard:view"],
        exact: true,
        description: "Vista general y métricas del sistema",
      },
      {
        id: "default-notifications",
        label: "Notificaciones",
        link: "/dashboard/notifications",
        icon: Notification01Icon,
        permissions: ["notifications:view"],
        badge: { text: "Al día", variant: "outline" },
        description: "Avisos y comunicados institucionales",
      },
    ],
  },
  {
    title: "Cuenta y Soporte",
    items: [
      {
        id: "default-profile",
        label: "Mi Perfil",
        link: "/dashboard/profile",
        icon: UserIcon,
        permissions: ["profile:view"],
        description: "Datos personales y seguridad de la cuenta",
      },
      {
        id: "default-settings",
        label: "Preferencias",
        link: "/dashboard/settings",
        icon: Settings02Icon,
        permissions: ["settings:view"],
        description: "Tema, idioma y preferencias de interfaz",
      },
      {
        id: "default-help",
        label: "Mesa de Ayuda",
        link: "/dashboard/help",
        icon: HelpCircleIcon,
        permissions: ["help:view"],
        description: "Preguntas frecuentes y soporte técnico",
      },
    ],
  },
];
