"use client";

import * as React from "react";
import {
  MoreHorizontalIcon,
  Pdf01Icon,
  ArrowRight01Icon,
  UserRemove01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MatriculaItem } from "../../types";

interface MatriculaActionsProps {
  matricula: MatriculaItem;
  puedeGestionar: boolean;
  onDescargarConstancia: (matricula: MatriculaItem) => void;
  onCambiarSeccion?: (matricula: MatriculaItem) => void;
  onRetirar?: (matricula: MatriculaItem) => void;
  onTrasladar?: (matricula: MatriculaItem) => void;
  onAnular?: (matricula: MatriculaItem) => void;
}

export function MatriculaActions({
  matricula,
  puedeGestionar,
  onDescargarConstancia,
  onCambiarSeccion,
  onRetirar,
  onTrasladar,
  onAnular,
}: MatriculaActionsProps) {
  const esMatriculado = matricula.estado === "matriculado";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label="Acciones de matrícula">
          <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>

        {/* Constancia PDF siempre disponible */}
        <DropdownMenuItem onClick={() => onDescargarConstancia(matricula)}>
          <HugeiconsIcon icon={Pdf01Icon} className="mr-2 size-4 text-rose-500" />
          Constancia PDF
        </DropdownMenuItem>

        {puedeGestionar && esMatriculado && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onCambiarSeccion?.(matricula)}>
              <HugeiconsIcon icon={ArrowRight01Icon} className="mr-2 size-4 text-blue-500" />
              Cambiar sección
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRetirar?.(matricula)}>
              <HugeiconsIcon icon={UserRemove01Icon} className="mr-2 size-4 text-amber-500" />
              Retirar estudiante
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTrasladar?.(matricula)}>
              <HugeiconsIcon icon={ArrowRight01Icon} className="mr-2 size-4 text-purple-500" />
              Trasladar a otro colegio
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onAnular?.(matricula)}
              className="text-destructive focus:text-destructive"
            >
              <HugeiconsIcon icon={Delete02Icon} className="mr-2 size-4" />
              Anular matrícula
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
