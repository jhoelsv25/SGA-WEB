# Estilos, Tailwind CSS v4 e Iconografía

## 1. Tailwind CSS v4

- **Sin `tailwind.config.js` obsoleto**:
  - Este proyecto utiliza Tailwind CSS v4 con la nueva arquitectura basada en CSS nativo y `@theme` en `app/globals.css`.
  - No intentes generar ni referenciar configuraciones JavaScript de Tailwind v3 (`tailwind.config.js`).
- **Variables de Tema y Modo Oscuro**:
  - Usa los tokens de color del sistema definidos en variables CSS (ej: `bg-background`, `text-foreground`, `border-border`, `bg-muted`).
  - No uses colores hexadecimales arbitrarios o directos en clases a menos que sean tokens de marca previamente aprobados.

## 2. Componentes UI Primitivos (shadcn/ui)

- Los componentes base se encuentran en `@/components/ui/` (`button`, `input`, `dialog`, `badge`, etc.).
- Utiliza siempre `cn()` (`@/lib/utils`) para concatenar clases condicionales.
- Usa `class-variance-authority` (`cva`) si necesitas crear o extender variantes de componentes UI.

## 3. Iconografía Estándar: `@hugeicons/react`

- **Iconografía Exclusiva**:
  - El proyecto tiene integrado `@hugeicons/react` y `@hugeicons/core-free-icons`.
  - **No instales ni importes `lucide-react` ni otras librerías de iconos**. Mantén la coherencia visual usando HugeIcons en todo el dashboard:
    ```tsx
    import { Search01Icon, PlusSignIcon, Delete02Icon } from "@hugeicons/react";
    ```
- **Accesibilidad en Botones de Icono**:
  - Todo botón que contenga exclusivamente un icono debe incluir `aria-label` o `sr-only` explicando su función para lectores de pantalla.
