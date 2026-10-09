import { IconSvgElement } from "@hugeicons/react";
import { ReactNode } from "react";

export type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"
  | "10xl"
  | "full";

export interface ModalProps {
  /** Indica si el diálogo se encuentra abierto */
  open: boolean;
  /** Función callback que se ejecuta al cambiar el estado de visibilidad */
  onOpenChange: (open: boolean) => void;
  /** Título accesible y visible del diálogo */
  title?: ReactNode;
  /** Descripción o detalle informativo debajo del título */
  description?: ReactNode;
  /** Icono decorativo de cabecera */
  icon?: IconSvgElement;
  /**
   * Contenido principal del diálogo. Se renderiza dentro del cuerpo con scroll vertical.
   *
   * @note Compatible hacia atrás: los formularios que colocan sus botones de acción dentro
   * de `children` continuarán funcionando. Sin embargo, se recomienda mover los botones a la
   * prop `footer` para que permanezcan siempre fijos y visibles en pantalla (evitando que
   * queden ocultos en dispositivos móviles o formularios extensos).
   */
  children: ReactNode;
  /**
   * Pie de diálogo fijo al fondo (acciones, botones Cancelar/Guardar).
   * Se ubica fuera del contenedor con desplazamiento vertical, garantizando que
   * los botones siempre estén a la vista del usuario.
   */
  footer?: ReactNode;
  /** Tamaño o ancho predefinido del diálogo */
  size?: ModalSize;
  /**
   * Determina si se muestra el botón de cierre (icono X) en la cabecera.
   * Por defecto es `!preventClose` (si `preventClose` es true, la X se oculta automáticamente).
   */
  showClose?: boolean;
  /** Clases CSS adicionales para el contenido del diálogo */
  className?: string;
  /**
   * Bloquea el cierre accidental del diálogo (deshabilita clics externos y tecla Escape,
   * y oculta la X por defecto).
   */
  preventClose?: boolean;
  /** Permite o deniega el cierre al hacer clic fuera del diálogo */
  closeOnInteractOutside?: boolean;
  /** Permite o deniega el cierre al presionar la tecla Escape */
  closeOnEscapeKeyDown?: boolean;
}
