"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { useAuditDetailQuery } from "../../hooks/use-audit-query";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Audit01Icon,
  Clock01Icon,
  UserIcon,
  ComputerIcon,
  Layers01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Copy01Icon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { formatDateTime, formatRelativeTime } from "@/lib/formatters/date";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export interface AuditDetailModalProps {
  auditId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditDetailModal({ auditId, open, onOpenChange }: AuditDetailModalProps) {
  const { data: detail, isLoading, isError } = useAuditDetailQuery(auditId);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const getActionBadgeColor = (action?: string) => {
    switch (action?.toLowerCase()) {
      case "crear":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "actualizar":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "eliminar":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "iniciar_sesion":
        return "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20";
      case "cerrar_sesion":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatValue = (val: unknown, campo: string) => {
    if (campo.toLowerCase().includes("contrasena") || campo.toLowerCase().includes("password")) {
      return (
        <span className="text-muted-foreground/80 flex items-center gap-1 text-[11px] italic">
          <HugeiconsIcon icon={ShieldCheckIcon} className="text-primary size-3 shrink-0" />
          Contraseña modificada (protegida por seguridad)
        </span>
      );
    }
    if (val === null || val === undefined) {
      return <span className="text-muted-foreground/40 italic">vacio</span>;
    }
    if (typeof val === "boolean") {
      return (
        <span className={val ? "font-semibold text-emerald-600" : "font-semibold text-rose-500"}>
          {val ? "true" : "false"}
        </span>
      );
    }
    if (typeof val === "object") {
      return (
        <pre className="bg-muted/50 max-w-xs overflow-x-auto rounded-lg p-1.5 font-mono text-[11px]">
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }
    return <span className="text-foreground font-medium">{String(val)}</span>;
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Detalle de Auditoría #${auditId ?? ""}`}
      description="Registro inmutable de trazabilidad institucional"
      icon={Audit01Icon}
      size="2xl"
    >
      {isLoading ? (
        <div className="flex h-56 flex-col items-center justify-center gap-2">
          <Spinner className="text-primary size-8" />
          <p className="text-muted-foreground text-xs">Cargando datos del evento...</p>
        </div>
      ) : isError || !detail ? (
        <div className="space-y-2 p-6 text-center">
          <p className="text-destructive text-sm font-semibold">
            No se pudo obtener el detalle de auditoría.
          </p>
          <p className="text-muted-foreground text-xs">
            Verifique la conexión con el servidor o si el registro sigue disponible.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Tarjeta de Metadatos del Evento */}
          <div className="bg-muted/30 border-border/60 grid grid-cols-2 gap-3 rounded-2xl border p-3.5 text-xs sm:grid-cols-4">
            {/* Acción */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Acción
              </span>
              <div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize",
                    getActionBadgeColor(detail.accion),
                  )}
                >
                  {detail.accion.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Usuario */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Usuario
              </span>
              <div className="text-foreground flex items-center gap-1.5 font-semibold">
                <HugeiconsIcon icon={UserIcon} className="text-muted-foreground size-3.5" />
                <span>{detail.usuario || "Sistema"}</span>
              </div>
            </div>

            {/* Entidad */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Entidad
              </span>
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <HugeiconsIcon icon={Layers01Icon} className="text-muted-foreground size-3.5" />
                <span className="capitalize">{detail.entidad}</span>
              </div>
            </div>

            {/* IP */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Dirección IP
              </span>
              <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px]">
                <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
                <span>{detail.direccionIp || "Local/Servidor"}</span>
              </div>
            </div>
          </div>

          {/* Fecha y Registro ID */}
          <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Clock01Icon} className="text-primary size-3.5" />
              <span>
                {formatDateTime(detail.registradoEn)} ({formatRelativeTime(detail.registradoEn)})
              </span>
            </div>

            {detail.registroId && (
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-medium">ID Afectado:</span>
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[10px] select-all">
                  {detail.registroId}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(detail.registroId!, "ID de registro")}
                  className="hover:text-foreground text-muted-foreground cursor-pointer p-1 transition-colors"
                  title="Copiar ID"
                >
                  <HugeiconsIcon icon={Copy01Icon} className="size-3" />
                </button>
              </div>
            )}
          </div>

          {/* Comparativa Antes / Después (Diff Inspector) */}
          <div className="space-y-2">
            <h4 className="text-muted-foreground px-1 text-xs font-bold tracking-wider uppercase">
              Modificaciones y Valores Registrados
            </h4>

            {detail.diferencias && detail.diferencias.length > 0 ? (
              <div className="border-border/80 overflow-hidden rounded-2xl border shadow-2xs">
                <table className="divide-border/60 w-full divide-y text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground text-[11px] font-semibold">
                    <tr>
                      <th className="w-1/3 px-3 py-2.5">Campo Afectado</th>
                      <th className="w-1/3 px-3 py-2.5">Valor Anterior</th>
                      <th className="w-1/3 px-3 py-2.5">Valor Nuevo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/40 bg-card divide-y">
                    {detail.diferencias.map((diff, index) => (
                      <tr
                        key={`${diff.campo}-${index}`}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="text-foreground px-3 py-2.5 font-mono text-[11.5px] font-medium">
                          {diff.campo}
                        </td>
                        <td className="text-muted-foreground bg-rose-500/5 px-3 py-2.5">
                          {formatValue(diff.valorAnterior, diff.campo)}
                        </td>
                        <td className="text-foreground bg-emerald-500/5 px-3 py-2.5 font-medium">
                          {formatValue(diff.valorNuevo, diff.campo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : detail.valorNuevo || detail.valorAnterior ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {detail.valorAnterior && (
                  <div className="border-border/60 space-y-1.5 rounded-xl border bg-rose-500/5 p-3">
                    <span className="text-[10.5px] font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                      Estado Anterior
                    </span>
                    <pre className="text-muted-foreground font-mono text-[11px] break-all whitespace-pre-wrap">
                      {JSON.stringify(detail.valorAnterior, null, 2)}
                    </pre>
                  </div>
                )}
                {detail.valorNuevo && (
                  <div className="border-border/60 space-y-1.5 rounded-xl border bg-emerald-500/5 p-3">
                    <span className="text-[10.5px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                      Estado Nuevo
                    </span>
                    <pre className="text-foreground font-mono text-[11px] break-all whitespace-pre-wrap">
                      {JSON.stringify(detail.valorNuevo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-border bg-muted/20 text-muted-foreground rounded-xl border border-dashed p-4 text-center text-xs">
                Este evento no produjo cambios de atributos persistentes.
              </div>
            )}
          </div>

          {/* Sello de Inmutabilidad */}
          <div className="bg-primary/5 border-primary/15 text-muted-foreground flex items-center gap-2 rounded-xl border p-2.5 text-[11px]">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary size-4 shrink-0" />
            <span>
              Registro inmutable sellado criptográficamente por la bitácora institucional. Prohibida
              su edición o borrado.
            </span>
          </div>

          {/* Botón Cerrar */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9.5 gap-1.5 rounded-full px-5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              <span>Cerrar</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
