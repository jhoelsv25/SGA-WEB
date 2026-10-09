import { ReactNode } from "react";
import { EmptyStateProps } from "@/components/common/empty-state";

export interface ErrorStateProps {
  /**
   * Título accesible y visible del error.
   * Por defecto: «No se pudo cargar la información».
   */
  title?: ReactNode;
  /**
   * Mensaje descriptivo o detalle técnico comprensible del error.
   */
  description?: ReactNode;
  /**
   * Función callback para reintentar la carga o acción fallida.
   * Si se especifica, renderiza un botón «Reintentar» con icono.
   */
  onRetry?: () => void;
  /**
   * Clases CSS adicionales para el contenedor del estado de error.
   */
  className?: string;
}

export interface PageStateProps {
  /**
   * Indica si la página o sección se encuentra cargando datos.
   */
  isLoading: boolean;
  /**
   * Indica si ocurrió un error en la carga de datos.
   */
  isError: boolean;
  /**
   * Objeto o mensaje de error (por ejemplo, el retornado por TanStack Query o Error nativo).
   * Si no se define una descripción explícita, se extrae de `error.message` o de la cadena.
   */
  error?: unknown;
  /**
   * Función callback para reintentar la petición al ocurrir un error.
   */
  onRetry?: () => void;
  /**
   * Título personalizado para el estado de error (opcional).
   */
  errorTitle?: ReactNode;
  /**
   * Propiedades avanzadas opcionales para personalizar el componente ErrorState.
   */
  errorProps?: Partial<ErrorStateProps>;
  /**
   * Indica si no hay registros o elementos que mostrar.
   */
  isEmpty?: boolean;
  /**
   * Propiedades para configurar el componente EmptyState cuando `isEmpty` es true.
   */
  empty?: EmptyStateProps;
  /**
   * Componente o skeleton personalizado para mostrar mientras `isLoading` es true.
   * Por defecto se renderiza un skeleton accesible con `aria-busy="true"`.
   */
  loading?: ReactNode;
  /**
   * Contenido que se renderiza cuando los datos cargaron exitosamente (no cargando, no error, no vacío).
   */
  children: ReactNode;
  /**
   * Clases CSS opcionales para envolver los estados en contenedores con estilos específicos.
   */
  className?: string;
}
