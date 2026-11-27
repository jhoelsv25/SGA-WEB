"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronRightIcon } from "@hugeicons/core-free-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { opcionesDelNodo, type NodoMenu } from "../../utils/arbol-menu";

interface ArbolPermisosProps {
  nodos: NodoMenu[];
  seleccionados: ReadonlySet<string>;
  bloqueado?: boolean;
  /** Activa o desactiva de una vez las opciones indicadas. */
  onCambiar: (menuIds: string[], activar: boolean) => void;
}

/** Árbol vertical: cada rama se despliega debajo de su padre, con sangría. */
export function ArbolPermisos({ nodos, ...resto }: ArbolPermisosProps) {
  return (
    <ul className="border-border/80 bg-card space-y-1 rounded-2xl border p-3 sm:p-4">
      {nodos.map((seccion) => (
        <Rama key={seccion.clave} nodo={seccion} {...resto} />
      ))}
    </ul>
  );
}

type RamaProps = Omit<ArbolPermisosProps, "nodos"> & { nodo: NodoMenu };

function Rama(props: RamaProps) {
  const { nodo, seleccionados, bloqueado, onCambiar } = props;
  const ids = opcionesDelNodo(nodo);
  const activas = bloqueado ? ids.length : ids.filter((id) => seleccionados.has(id)).length;
  const completo = activas === ids.length;
  const parcial = activas > 0 && !completo;
  const esRama = !nodo.menuId;

  // Al abrir la pantalla se muestran desplegadas las ramas marcadas a medias.
  const [abierta, setAbierta] = React.useState(parcial);
  const idHijos = React.useId();

  return (
    <li>
      <div className="flex items-center gap-1">
        {esRama ? (
          <button
            type="button"
            onClick={() => setAbierta((valor) => !valor)}
            aria-expanded={abierta}
            aria-controls={idHijos}
            aria-label={`${abierta ? "Contraer" : "Desplegar"} ${nodo.nombre}`}
            className="text-muted-foreground hover:bg-muted focus-visible:ring-ring flex size-9 shrink-0 items-center justify-center rounded-lg outline-none focus-visible:ring-2"
          >
            <HugeiconsIcon
              icon={ChevronRightIcon}
              className={cn(
                "size-4 transition-transform motion-reduce:transition-none",
                abierta && "rotate-90",
              )}
              aria-hidden="true"
            />
          </button>
        ) : (
          <span className="size-9 shrink-0" aria-hidden="true" />
        )}

        <label
          className={cn(
            "hover:bg-muted/60 flex min-h-10 min-w-0 flex-1 items-center gap-3 rounded-lg px-2 text-sm select-none",
            bloqueado ? "cursor-default" : "cursor-pointer",
          )}
        >
          <Checkbox
            checked={completo ? true : parcial ? "indeterminate" : false}
            disabled={bloqueado}
            // Parcial o vacío → marca todo; completo → desmarca todo.
            onCheckedChange={() => onCambiar(ids, !completo)}
          />
          <span className={cn("text-foreground min-w-0", esRama && "font-medium")}>
            {nodo.nombre}
          </span>
          {esRama && (
            <span className="text-muted-foreground text-xs tabular-nums">
              {activas}/{ids.length}
            </span>
          )}
        </label>
      </div>

      {esRama && abierta && (
        <ul id={idHijos} className="mt-1 ml-8 space-y-1">
          {nodo.hijos.map((hijo) => (
            <Rama {...props} key={hijo.clave} nodo={hijo} />
          ))}
        </ul>
      )}
    </li>
  );
}
