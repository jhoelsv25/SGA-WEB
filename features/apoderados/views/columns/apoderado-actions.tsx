"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreVerticalIcon, Edit01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import type { Apoderado } from "../../types/apoderados.types";

interface ApoderadoActionsProps {
  apoderado: Apoderado;
  onEdit: (apoderado: Apoderado) => void;
  onDelete: (apoderado: Apoderado) => void;
}

export function ApoderadoActions({ apoderado, onEdit, onDelete }: ApoderadoActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(apoderado)} className="cursor-pointer gap-2">
          <HugeiconsIcon icon={Edit01Icon} className="h-4 w-4" />
          Editar ficha
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete(apoderado)}
          className="text-destructive focus:text-destructive cursor-pointer gap-2"
        >
          <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
          Eliminar ficha
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
