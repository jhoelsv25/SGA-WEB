"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { useAuditDetailQuery } from "../../hooks/use-audit-query";
import { Spinner } from "@/components/common/spinner";
import { ErrorState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { getAuditActionMeta } from "../../consts";
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

export interface AuditDetailModalProps {
  auditId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditDetailModal({ auditId, open, onOpenChange }: AuditDetailModalProps) {
  const { data: detail, isLoading, isError, refetch } = useAuditDetailQuery(auditId);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles.`);
  };

  const actionMeta = getAuditActionMeta(detail?.accion);

  const formatValue = (val: unknown, campo: string) => {
    if (campo.toLowerCase().includes("contrasena") || campo.toLowerCase().includes("password")) {
      return (
        <span className="text-muted-foreground flex items-center gap-1 text-xs italic">
          <HugeiconsIcon icon={ShieldCheckIcon} className="text-primary size-3.5 shrink-0" />
          Contraseña modificada (protegida por seguridad)
        </span>
      );
    }
    if (val === null || val === undefined) {
      return <span className="text-muted-foreground/60 text-xs italic">vacío</span>;
    }
    if (typeof val === "boolean") {
      return (
        <span
          className={
            val ? "text-success text-xs font-semibold" : "text-destructive text-xs font-semibold"
          }
        >
          {val ? "true" : "false"}
        </span>
      );
    }
    if (typeof val === "object") {
      return (
        <pre className="bg-muted/50 max-w-xs overflow-x-auto rounded-lg p-1.5 font-mono text-xs">
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }
    return <span className="text-foreground text-xs font-medium">{String(val)}</span>;
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Detalle de auditoría #${auditId ?? ""}`}
      description="Registro inmutable de trazabilidad institucional."
      icon={Audit01Icon}
      size="2xl"
      footer={
        <div className="flex w-full items-center justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 gap-1.5 rounded-full px-5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cerrar</span>
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex min-h-60 flex-col items-center justify-center gap-2">
          <Spinner className="text-primary size-8" />
          <p className="text-muted-foreground text-xs">Cargando datos del evento...</p>
        </div>
      ) : isError || !detail ? (
        <div className="p-2">
          <ErrorState
            title="No se pudo obtener el detalle de auditoría"
            description="Verifique la conexión con el servidor o si el registro sigue disponible."
            onRetry={() => refetch()}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Tarjeta de Metadatos del Evento */}
          <div className="border-border/60 bg-muted/30 grid grid-cols-2 gap-3 rounded-2xl border p-3.5 text-xs sm:grid-cols-4">
            {/* Acción */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Acción
              </span>
              <div>
                <StatusBadge tone={actionMeta.tone} dot size="sm">
                  {actionMeta.label}
                </StatusBadge>
              </div>
            </div>

            {/* Usuario */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Usuario
              </span>
              <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <HugeiconsIcon
                  icon={UserIcon}
                  className="text-muted-foreground size-3.5 shrink-0"
                />
                <span>{detail.usuario || "Sistema"}</span>
              </div>
            </div>

            {/* Entidad / Módulo */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Módulo
              </span>
              <div className="text-foreground flex items-center gap-1.5 text-xs font-medium">
                <HugeiconsIcon
                  icon={Layers01Icon}
                  className="text-muted-foreground size-3.5 shrink-0"
                />
                <span className="capitalize">{detail.entidad}</span>
              </div>
            </div>

            {/* Dirección IP */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Dirección IP
              </span>
              <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                <HugeiconsIcon icon={ComputerIcon} className="size-3.5 shrink-0" />
                <span>{detail.direccionIp || "Local/Servidor"}</span>
              </div>
            </div>
          </div>

          {/* Fecha y Registro ID */}
          <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Clock01Icon} className="text-primary size-3.5 shrink-0" />
              <span>
                {formatDateTime(detail.registradoEn)} ({formatRelativeTime(detail.registradoEn)})
              </span>
            </div>

            {detail.registroId && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium">ID afectado:</span>
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs select-all">
                  {detail.registroId}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(detail.registroId!, "ID de registro")}
                  className="hover:text-foreground text-muted-foreground cursor-pointer rounded p-1 transition-colors"
                  aria-label="Copiar ID de registro al portapapeles"
                  title="Copiar ID"
                >
                  <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Comparativa Antes / Después (Diff Inspector) */}
          <div className="space-y-2">
            <h4 className="text-muted-foreground px-1 text-xs font-bold tracking-wider uppercase">
              Modificaciones y valores registrados
            </h4>

            {detail.diferencias && detail.diferencias.length > 0 ? (
              <div className="border-border/80 overflow-hidden rounded-2xl border shadow-2xs">
                <table className="divide-border/60 w-full divide-y text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground text-xs font-semibold">
                    <tr>
                      <th className="w-1/3 px-3 py-2.5">Campo afectado</th>
                      <th className="w-1/3 px-3 py-2.5">Valor anterior</th>
                      <th className="w-1/3 px-3 py-2.5">Valor nuevo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/40 bg-card divide-y">
                    {detail.diferencias.map((diff, index) => (
                      <tr
                        key={`${diff.campo}-${index}`}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="text-foreground px-3 py-2.5 font-mono text-xs font-medium">
                          {diff.campo}
                        </td>
                        <td className="text-muted-foreground bg-destructive/5 px-3 py-2.5">
                          {formatValue(diff.valorAnterior, diff.campo)}
                        </td>
                        <td className="text-foreground bg-success/5 px-3 py-2.5 font-medium">
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
                  <div className="border-border/60 bg-destructive/5 space-y-1.5 rounded-xl border p-3">
                    <span className="text-destructive text-xs font-bold tracking-wider uppercase">
                      Estado anterior
                    </span>
                    <pre className="text-muted-foreground font-mono text-xs break-all whitespace-pre-wrap">
                      {JSON.stringify(detail.valorAnterior, null, 2)}
                    </pre>
                  </div>
                )}
                {detail.valorNuevo && (
                  <div className="border-border/60 bg-success/5 space-y-1.5 rounded-xl border p-3">
                    <span className="text-success text-xs font-bold tracking-wider uppercase">
                      Estado nuevo
                    </span>
                    <pre className="text-foreground font-mono text-xs break-all whitespace-pre-wrap">
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
          <div className="bg-primary/5 border-primary/15 text-muted-foreground flex items-center gap-2 rounded-xl border p-2.5 text-xs">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary size-4 shrink-0" />
            <span>
              Registro inmutable sellado criptográficamente por la bitácora institucional. Prohibida
              su edición o borrado.
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
