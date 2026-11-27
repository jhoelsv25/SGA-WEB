"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const ALTO_MINIMO = 40;

/**
 * Barra de desplazamiento propia del menú: la nativa no permite cambiar el cursor.
 * La rueda, el teclado y el gesto táctil siguen usando el desplazamiento normal de la lista.
 */
export function BarraDesplazamiento({ lista }: { lista: HTMLElement | null }) {
  const [medida, setMedida] = React.useState({ alto: 0, arriba: 0 });
  const [arrastrando, setArrastrando] = React.useState(false);
  const inicio = React.useRef({ y: 0, scroll: 0 });

  React.useEffect(() => {
    if (!lista) return;
    const medir = () => {
      const { clientHeight, scrollHeight, scrollTop } = lista;
      if (scrollHeight <= clientHeight + 1) {
        setMedida({ alto: 0, arriba: 0 });
        return;
      }
      const alto = Math.max(ALTO_MINIMO, (clientHeight * clientHeight) / scrollHeight);
      const arriba = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - alto);
      setMedida({ alto, arriba });
    };
    // El contenido cambia de alto al abrir o cerrar grupos.
    const observador = new ResizeObserver(medir);
    observador.observe(lista);
    Array.from(lista.children).forEach((hijo) => observador.observe(hijo));
    lista.addEventListener("scroll", medir, { passive: true });
    return () => {
      observador.disconnect();
      lista.removeEventListener("scroll", medir);
    };
  }, [lista]);

  if (!lista || medida.alto === 0) return null;

  // Ocupa su propio carril junto a la lista: así los colores de la selección no pasan por debajo.
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative w-3.5 shrink-0 touch-none transition-opacity duration-200",
        // Solo se ve con el puntero sobre la barra lateral (o mientras se arrastra).
        // En pantallas táctiles no hay puntero, así que queda visible.
        arrastrando
          ? "opacity-100"
          : "opacity-0 group-hover/lateral:opacity-100 pointer-coarse:opacity-100",
      )}
    >
      <div
        className={cn(
          "group/barra absolute inset-x-0 flex justify-center select-none",
          arrastrando ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ top: medida.arriba, height: medida.alto }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          inicio.current = { y: e.clientY, scroll: lista.scrollTop };
          setArrastrando(true);
        }}
        onPointerMove={(e) => {
          if (!arrastrando) return;
          const recorrido = lista.clientHeight - medida.alto;
          if (recorrido <= 0) return;
          const proporcion = (lista.scrollHeight - lista.clientHeight) / recorrido;
          lista.scrollTo({
            top: inicio.current.scroll + (e.clientY - inicio.current.y) * proporcion,
          });
        }}
        onLostPointerCapture={() => setArrastrando(false)}
      >
        <span
          className={cn(
            "bg-foreground/22 group-hover/barra:bg-foreground/40 h-full w-2.5 rounded-full transition-colors",
            arrastrando && "bg-foreground/50 group-hover/barra:bg-foreground/50",
          )}
        />
      </div>
    </div>
  );
}
