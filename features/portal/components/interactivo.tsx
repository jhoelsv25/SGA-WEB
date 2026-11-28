"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";

/** Hook: true cuando el elemento entra en pantalla (una sola vez). */
function useAparece<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return { ref, visible };
}

interface RevelarProps extends React.HTMLAttributes<HTMLDivElement> {
  retardoMs?: number;
}

/** Hace aparecer su contenido con un deslizamiento suave al hacer scroll. */
export function Revelar({ retardoMs = 0, className, style, children, ...props }: RevelarProps) {
  const { ref, visible } = useAparece<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${retardoMs}ms`, ...style }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 motion-reduce:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface TarjetaProps extends React.HTMLAttributes<HTMLLIElement> {
  retardoMs?: number;
}

/** Elemento de lista con aparición al scroll y un foco de luz que sigue al cursor. */
export function TarjetaInteractiva({
  retardoMs = 0,
  className,
  style,
  children,
  ...props
}: TarjetaProps) {
  const { ref, visible } = useAparece<HTMLLIElement>();

  const seguirCursor = (evento: React.MouseEvent<HTMLLIElement>) => {
    const caja = evento.currentTarget.getBoundingClientRect();
    evento.currentTarget.style.setProperty("--x", `${evento.clientX - caja.left}px`);
    evento.currentTarget.style.setProperty("--y", `${evento.clientY - caja.top}px`);
  };

  return (
    <li
      ref={ref}
      onMouseMove={seguirCursor}
      style={{ transitionDelay: visible ? "0ms" : `${retardoMs}ms`, ...style }}
      className={cn(
        "group relative overflow-hidden transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.22), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </li>
  );
}

/** Barra de progreso de lectura y botón para volver arriba. */
export function ProgresoPagina() {
  const [progreso, setProgreso] = React.useState(0);

  React.useEffect(() => {
    const actualizar = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgreso(total > 0 ? Math.min(window.scrollY / total, 1) : 0);
    };
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    return () => window.removeEventListener("scroll", actualizar);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="bg-primary fixed top-0 left-0 z-60 h-1 origin-left"
        style={{ width: "100%", transform: `scaleX(${progreso})` }}
      />
      <button
        type="button"
        aria-label="Volver arriba"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "bg-primary text-primary-foreground fixed right-5 bottom-5 z-50 flex size-12 items-center justify-center rounded-full shadow-lg transition-all hover:-translate-y-1",
          progreso > 0.15
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <HugeiconsIcon icon={ArrowUp01Icon} className="size-5" />
      </button>
    </>
  );
}
