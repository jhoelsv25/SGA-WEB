"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Exchange01Icon,
  UserRemove01Icon,
  SchoolIcon,
  Delete02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MatriculaItem } from "../../types";
import type { OperacionMatriculaTipo } from "../forms/operacion-matricula-form";

interface DetalleOperacionesPanelProps {
  matricula: MatriculaItem;
  onSelectOperacion: (tipo: OperacionMatriculaTipo) => void;
}

export function DetalleOperacionesPanel({
  matricula,
  onSelectOperacion,
}: DetalleOperacionesPanelProps) {
  const esMatriculado = matricula.estado === "matriculado";

  return (
    <Card className="border-border/60 rounded-2xl shadow-2xs">
      <CardHeader className="border-border/50 bg-muted/30 border-b px-5 py-3.5">
        <CardTitle className="text-sm font-semibold">Operaciones de Secretaría</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        {esMatriculado ? (
          <>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Acciones reglamentarias disponibles para este estudiante matriculado:
            </p>

            <Button
              variant="outline"
              className="h-10 w-full justify-start gap-2.5 rounded-xl text-xs"
              onClick={() => onSelectOperacion("cambiar-seccion")}
            >
              <HugeiconsIcon icon={Exchange01Icon} className="size-4 text-blue-500" />
              <span>Cambiar de Sección (Mismo Grado)</span>
            </Button>

            <Button
              variant="outline"
              className="h-10 w-full justify-start gap-2.5 rounded-xl text-xs"
              onClick={() => onSelectOperacion("retirar")}
            >
              <HugeiconsIcon icon={UserRemove01Icon} className="size-4 text-amber-500" />
              <span>Registrar Retiro Escolar</span>
            </Button>

            <Button
              variant="outline"
              className="h-10 w-full justify-start gap-2.5 rounded-xl text-xs"
              onClick={() => onSelectOperacion("trasladar")}
            >
              <HugeiconsIcon icon={SchoolIcon} className="size-4 text-purple-500" />
              <span>Registrar Traslado Externo</span>
            </Button>

            <div className="border-border/50 border-t pt-2">
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-full justify-start gap-2.5 rounded-xl text-xs"
                onClick={() => onSelectOperacion("anular")}
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                <span>Anular Matrícula (por error)</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground space-y-2 py-2 text-xs">
            <div className="text-foreground flex items-center gap-2 font-semibold">
              <HugeiconsIcon icon={AlertCircleIcon} className="size-4 text-amber-500" />
              <span>Expediente Cerrado</span>
            </div>
            <p>
              Esta matrícula se encuentra en estado <strong>{matricula.estado}</strong>. No admite
              cambios de sección ni anulaciones adicionales.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
