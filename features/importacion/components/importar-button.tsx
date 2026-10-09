"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileImportIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ImportarModal } from "./modals/importar-modal";
import type { TipoImportacion } from "../types/importacion.types";

interface ImportarButtonProps {
  tipo: TipoImportacion;
  onSuccess?: () => void;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ImportarButton({
  tipo,
  onSuccess,
  className,
  variant = "outline",
  size = "sm",
}: ImportarButtonProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={`h-8 gap-1.5 text-xs ${className ?? ""}`}
      >
        <HugeiconsIcon icon={FileImportIcon} className="h-4 w-4" />
        Importar Excel
      </Button>

      <ImportarModal open={open} onOpenChange={setOpen} tipo={tipo} onSuccess={onSuccess} />
    </>
  );
}
