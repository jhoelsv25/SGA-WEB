"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { VariableSistema } from "../../types";

interface EditVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variable: VariableSistema | null;
  onSubmit: (codigo: string, valor: string, motivoCambio: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditVariableModal({
  open,
  onOpenChange,
  variable,
  onSubmit,
  isSubmitting = false,
}: EditVariableModalProps) {
  if (!variable) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <EditVariableForm
            key={variable.codigo}
            variable={variable}
            onCancel={() => onOpenChange(false)}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditVariableForm({
  variable,
  onCancel,
  onSubmit,
  isSubmitting,
}: {
  variable: VariableSistema;
  onCancel: () => void;
  onSubmit: (codigo: string, valor: string, motivoCambio: string) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [valor, setValor] = React.useState(variable.valor);
  const [motivoCambio, setMotivoCambio] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivoCambio.trim()) {
      setError("Indique el motivo del cambio.");
      return;
    }
    if (!valor.trim()) {
      setError("El valor es obligatorio.");
      return;
    }

    try {
      setError(null);
      await onSubmit(variable.codigo, valor.trim(), motivoCambio.trim());
      onCancel();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar la variable.";
      setError(msg);
    }
  };

  const getRangoTexto = () => {
    if (variable.valorMinimo !== null && variable.valorMaximo !== null) {
      return `Entre ${variable.valorMinimo} y ${variable.valorMaximo} ${variable.unidad || ""}`.trim();
    }
    if (variable.valorMinimo !== null) {
      return `Mínimo ${variable.valorMinimo} ${variable.unidad || ""}`.trim();
    }
    if (variable.valorMaximo !== null) {
      return `Máximo ${variable.valorMaximo} ${variable.unidad || ""}`.trim();
    }
    return null;
  };

  const cleanDescription = variable.descripcion
    .replace(/\s*\((RF-[^)]*|P-[^)]*)\)/gi, "")
    .replace(/\s*\(\s*\)/g, "")
    .trim();

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <DialogTitle>Modificar Variable del Sistema</DialogTitle>
          <Badge variant="outline" className="text-xs">
            {variable.tipo}
          </Badge>
        </div>
        <DialogDescription className="text-muted-foreground font-mono text-xs">
          {variable.codigo}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-muted/30 text-muted-foreground rounded-lg border p-3 text-sm">
          <p className="text-foreground font-medium">{cleanDescription}</p>
          {getRangoTexto() && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Límites permitidos: {getRangoTexto()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor">
            Nuevo Valor{" "}
            {variable.unidad && (
              <span className="text-muted-foreground text-xs">({variable.unidad})</span>
            )}
          </Label>
          <Input
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ingrese el nuevo valor"
            disabled={!variable.editable || isSubmitting}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivoCambio">
            Motivo del Cambio <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="motivoCambio"
            value={motivoCambio}
            onChange={(e) => setMotivoCambio(e.target.value)}
            placeholder="Indique la justificación o acuerdo directivo para este cambio..."
            rows={3}
            disabled={!variable.editable || isSubmitting}
          />
          <p className="text-muted-foreground text-xs">
            Este motivo quedará registrado de forma inmutable en el historial y en la bitácora de
            auditoría.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-2.5 text-xs font-medium">
            {error}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!variable.editable || isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
