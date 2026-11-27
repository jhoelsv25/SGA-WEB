"use client";

import * as React from "react";
import { Cancel01Icon, PlusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Campos que se escriben directamente sobre la hoja: sin caja propia, con el mismo tipo de letra
 * del documento, y un sombreado suave al pasar o escribir (como los campos de un formulario Word).
 */
const CAMPO =
  "w-full min-w-0 resize-none rounded-[2px] bg-transparent p-0 text-inherit [font:inherit] outline-none placeholder:text-(--hoja-tenue) placeholder:italic hover:bg-(--hoja-campo) focus-visible:bg-(--hoja-campo) focus-visible:ring-2 focus-visible:ring-(--hoja-accion)/60 disabled:cursor-default disabled:bg-transparent";

interface TextoProps {
  valor: string;
  onCambio: (v: string) => void;
  etiqueta: string;
  placeholder?: string;
  disabled?: boolean;
  /** Una sola línea (Enter no hace salto): título, unidad, campo temático. */
  unaLinea?: boolean;
  className?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  autoFocus?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

/** Área de texto que crece con su contenido, para que la celda tenga el alto del Word. */
export function TextoHoja({
  valor,
  onCambio,
  etiqueta,
  placeholder,
  disabled,
  unaLinea,
  className,
  onKeyDown,
  autoFocus,
  ref,
}: TextoProps) {
  const interno = React.useRef<HTMLTextAreaElement | null>(null);
  React.useImperativeHandle(ref, () => interno.current as HTMLTextAreaElement);
  React.useLayoutEffect(() => {
    const el = interno.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [valor]);
  return (
    <textarea
      ref={interno}
      rows={1}
      aria-label={etiqueta}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      value={valor}
      className={cn(CAMPO, "block overflow-hidden", className)}
      onChange={(e) => onCambio(unaLinea ? e.target.value.replace(/\n/g, " ") : e.target.value)}
      onKeyDown={(e) => {
        if (unaLinea && e.key === "Enter") e.preventDefault();
        onKeyDown?.(e);
      }}
    />
  );
}

/** Número dentro de la hoja (N.º de sesión, minutos). */
export function NumeroHoja({
  valor,
  onCambio,
  etiqueta,
  disabled,
  className,
  placeholder,
}: {
  valor: number | undefined;
  onCambio: (v: number | undefined) => void;
  etiqueta: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      min={0}
      inputMode="numeric"
      aria-label={etiqueta}
      placeholder={placeholder}
      disabled={disabled}
      value={valor ?? ""}
      className={cn(
        CAMPO,
        "inline-block [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none",
        className,
      )}
      onChange={(e) => onCambio(e.target.value === "" ? undefined : Number(e.target.value))}
    />
  );
}

/** Lista con viñetas editable: Enter crea otra viñeta y Retroceso en una vacía la borra. */
export function ListaHoja<T>({
  items,
  texto,
  conTexto,
  nuevo,
  onCambio,
  etiqueta,
  placeholder,
  disabled,
  textoAgregar = "Agregar",
}: {
  items: T[];
  texto: (item: T) => string;
  conTexto: (item: T, t: string) => T;
  nuevo: (t: string) => T;
  onCambio: (items: T[]) => void;
  etiqueta: string;
  placeholder?: string;
  disabled?: boolean;
  textoAgregar?: string;
}) {
  const refs = React.useRef<(HTMLTextAreaElement | null)[]>([]);
  // Viñeta que debe tomar el foco cuando la lista ya se volvió a dibujar (al crear o borrar).
  const enfocar = React.useRef<number | null>(null);
  React.useEffect(() => {
    const i = enfocar.current;
    if (i === null) return;
    enfocar.current = null;
    const el = refs.current[i];
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [items]);

  const insertar = (i: number) => {
    enfocar.current = i;
    onCambio([...items.slice(0, i), nuevo(""), ...items.slice(i)]);
  };

  if (disabled && items.length === 0) return <p>—</p>;
  return (
    <div>
      {items.length > 0 ? (
        <ul className="list-disc space-y-[2pt] pl-[14pt]">
          {items.map((item, i) => (
            <li key={i}>
              <TextoHoja
                ref={(el) => {
                  refs.current[i] = el;
                }}
                etiqueta={`${etiqueta} ${i + 1}`}
                valor={texto(item)}
                placeholder={placeholder}
                disabled={disabled}
                unaLinea
                onCambio={(t) => onCambio(items.map((x, k) => (k === i ? conTexto(x, t) : x)))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") insertar(i + 1);
                  if (e.key === "Backspace" && texto(item) === "") {
                    e.preventDefault();
                    enfocar.current = Math.max(0, i - 1);
                    onCambio(items.filter((_, k) => k !== i));
                  }
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-(--hoja-tenue) italic">{placeholder ?? "—"}</p>
      )}
      {!disabled && (
        <AccionHoja icono={PlusSignIcon} onClick={() => insertar(items.length)}>
          {textoAgregar}
        </AccionHoja>
      )}
    </div>
  );
}

/** Botón que solo existe en el editor (no sale en el Word): azul, pequeño y discreto. */
export function AccionHoja({
  children,
  onClick,
  icono,
  disabled,
  className,
  etiqueta,
}: {
  children?: React.ReactNode;
  onClick: () => void;
  icono?: typeof PlusSignIcon;
  disabled?: boolean;
  className?: string;
  etiqueta?: string;
}) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "mt-[2pt] inline-flex items-center gap-1 rounded-[3px] px-1 py-0.5 font-sans text-[8pt] font-medium text-(--hoja-accion) hover:bg-(--hoja-campo) focus-visible:ring-2 focus-visible:ring-(--hoja-accion)/60 focus-visible:outline-none disabled:opacity-50 print:hidden",
        className,
      )}
    >
      {icono && <HugeiconsIcon icon={icono} size={11} strokeWidth={2} aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Quitar una fila de la tabla: aparece al pasar por la celda o al llegar con el teclado. */
export function QuitarFilaHoja({ etiqueta, onClick }: { etiqueta: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      title={etiqueta}
      onClick={onClick}
      className="absolute top-0.5 right-0.5 flex size-5 items-center justify-center rounded-full bg-(--hoja-papel) text-(--hoja-tenue) opacity-0 shadow-sm group-focus-within/celda:opacity-100 group-hover/celda:opacity-100 hover:text-(--hoja-peligro) focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-(--hoja-accion)/60 focus-visible:outline-none print:hidden"
    >
      <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

export interface OpcionHoja {
  valor: string;
  texto: string;
  detalle?: string;
}

/**
 * Elegir del catálogo sin salir de la hoja: la celda muestra lo elegido tal cual saldrá en el Word
 * y, al hacer clic, abre la lista para marcar o desmarcar.
 */
export function SelectorHoja({
  opciones,
  seleccion,
  onCambio,
  multiple,
  etiqueta,
  disabled,
  children,
  vacioLista = "No hay opciones en el catálogo.",
  className,
}: {
  opciones: OpcionHoja[];
  seleccion: string[];
  onCambio: (seleccion: string[]) => void;
  multiple?: boolean;
  etiqueta: string;
  disabled?: boolean;
  /** Lo que se ve en la celda (lo elegido o un texto de ayuda). */
  children: React.ReactNode;
  vacioLista?: string;
  className?: string;
}) {
  const [abierto, setAbierto] = React.useState(false);
  if (disabled) return <div className={className}>{children}</div>;
  const elegir = (v: string) => {
    if (multiple) {
      onCambio(seleccion.includes(v) ? seleccion.filter((x) => x !== v) : [...seleccion, v]);
    } else {
      onCambio(seleccion.includes(v) ? [] : [v]);
      setAbierto(false);
    }
  };
  return (
    <Popover open={abierto} onOpenChange={setAbierto}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={etiqueta}
          className={cn(
            "block w-full cursor-pointer rounded-[2px] text-left hover:bg-(--hoja-campo) focus-visible:bg-(--hoja-campo) focus-visible:ring-2 focus-visible:ring-(--hoja-accion)/60 focus-visible:outline-none",
            className,
          )}
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(26rem,calc(100vw-2rem))] p-1.5">
        <p className="text-muted-foreground px-2 pt-1 text-xs font-medium">{etiqueta}</p>
        <div
          role={multiple ? "group" : "listbox"}
          aria-label={etiqueta}
          className="max-h-80 overflow-y-auto"
        >
          {opciones.length === 0 && (
            <p className="text-muted-foreground px-2 py-3 text-sm">{vacioLista}</p>
          )}
          {opciones.map((o) => {
            const marcado = seleccion.includes(o.valor);
            return multiple ? (
              <label
                key={o.valor}
                className="hover:bg-muted flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-sm"
              >
                <Checkbox
                  className="mt-0.5"
                  checked={marcado}
                  onCheckedChange={() => elegir(o.valor)}
                />
                <span>
                  {o.texto}
                  {o.detalle && (
                    <span className="text-muted-foreground block text-xs">{o.detalle}</span>
                  )}
                </span>
              </label>
            ) : (
              <button
                key={o.valor}
                type="button"
                role="option"
                aria-selected={marcado}
                onClick={() => elegir(o.valor)}
                className="hover:bg-muted flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm"
              >
                <span className="mt-0.5 size-4 shrink-0">
                  {marcado && <HugeiconsIcon icon={Tick02Icon} size={16} aria-hidden="true" />}
                </span>
                <span>{o.texto}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Texto de ayuda dentro de una celda vacía (en el Word esa celda sale con «—»). */
export function AyudaHoja({ children }: { children: React.ReactNode }) {
  return <span className="text-(--hoja-tenue) italic">{children}</span>;
}
