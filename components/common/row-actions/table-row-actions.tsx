"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Task01Icon,
  Copy01Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { TableRowActionsProps } from "./types";

/**
 * Componente global reutilizable para renderizar el menú de acciones contextuales por fila
 * en cualquier tabla de datos (Leads, Suscriptores, Contactos, Campañas, etc.).
 *
 * Incluye:
 * - Botón de 3 puntos con micro-interacciones
 * - Cabecera con título y subtítulo de la entidad
 * - Acción rápida de copiar texto al portapapeles
 * - Acción de editar
 * - Submenú nativo robusto para cambiar estado con puntos de color y checkmark
 * - Elementos de acción personalizados (botones o enlaces directos)
 * - Diálogo de confirmación de eliminación integrado
 */
export function TableRowActions<TStatus extends string = string>({
  header,
  copy,
  onEdit,
  editLabel = "Editar datos",
  statusPicker,
  items = [],
  deleteAction,
  className,
  triggerAriaLabel = "Abrir menú de opciones",
}: TableRowActionsProps<TStatus>) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleStatusSelect = async (value: TStatus) => {
    if (value === statusPicker?.current) {
      setMenuOpen(false);
      return;
    }
    await statusPicker?.onSelect(value);
    setMenuOpen(false);
  };

  const handleCopy = () => {
    if (!copy?.text) return;
    navigator.clipboard.writeText(copy.text);
    toast.success(copy.successMessage || "Copiado al portapapeles");
    setMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteAction) return;
    try {
      setIsDeleting(true);
      await deleteAction.onConfirm();
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const StatusIcon = statusPicker?.icon || Task01Icon;

  return (
    <>
      <div className={cn("relative inline-flex items-center", className)}>
        {/* Menú Principal Dropdown */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground/70 hover:border-border/60 hover:bg-muted/80 hover:text-foreground focus-visible:ring-ring data-[state=open]:bg-muted data-[state=open]:text-foreground size-8 rounded-lg transition-all duration-150 focus-visible:ring-1"
            >
              <span className="sr-only">{triggerAriaLabel}</span>
              <HugeiconsIcon icon={MoreHorizontalIcon} size={18} strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="border-border/60 bg-popover/95 w-56 rounded-xl p-1.5 shadow-xl backdrop-blur-md"
          >
            {/* Cabecera / Identificador de fila */}
            {header && (
              <>
                <div className="px-2 py-1">
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    {header.title}
                  </p>
                  {header.subtitle && (
                    <p className="text-foreground truncate text-xs font-semibold">
                      {header.subtitle}
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Copiar texto */}
            {copy && (
              <DropdownMenuItem
                onClick={handleCopy}
                className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
              >
                <HugeiconsIcon icon={Copy01Icon} size={15} />
                <span>{copy.label || "Copiar texto"}</span>
              </DropdownMenuItem>
            )}

            {/* Editar registro */}
            {onEdit && (
              <DropdownMenuItem
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
              >
                <HugeiconsIcon icon={PencilEdit02Icon} size={15} />
                <span>{editLabel}</span>
              </DropdownMenuItem>
            )}

            {/* Actualizar estado (Submenú anidado nativo) */}
            {statusPicker && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium">
                  <HugeiconsIcon icon={StatusIcon} size={15} />
                  <span>{statusPicker.label || "Actualizar estado"}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="border-border/60 bg-popover/95 w-52 rounded-xl p-1.5 shadow-xl backdrop-blur-md">
                  <div className="border-border/40 mb-1 border-b px-2 py-1">
                    <p className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                      <HugeiconsIcon icon={StatusIcon} size={12} />
                      <span>{statusPicker.title || "Actualizar Estado"}</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    {statusPicker.options.map((option) => {
                      const isCurrent = statusPicker.current === option.value;
                      return (
                        <DropdownMenuItem
                          key={option.value}
                          disabled={option.disabled}
                          onClick={() => handleStatusSelect(option.value)}
                          className={cn(
                            "cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                            isCurrent && "bg-muted text-foreground font-bold",
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={cn(
                                "size-2 shrink-0 rounded-full border",
                                option.className,
                              )}
                            />
                            <span className="truncate">{option.label}</span>
                          </div>
                          {isCurrent && (
                            <HugeiconsIcon
                              icon={CheckmarkCircle02Icon}
                              size={13}
                              className="text-primary shrink-0"
                            />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            {/* Items personalizados */}
            {items.map((item, idx) => {
              const itemVariantClass =
                item.variant === "destructive"
                  ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                  : item.variant === "warning"
                    ? "text-amber-500 focus:bg-amber-500/10 focus:text-amber-600"
                    : "focus:bg-primary/10 focus:text-primary";

              return (
                <React.Fragment key={item.key || `${item.label}-${idx}`}>
                  {item.separatorBefore && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    asChild={Boolean(item.href)}
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.onClick) {
                        setMenuOpen(false);
                        void item.onClick();
                      }
                    }}
                    className={cn(
                      "cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium",
                      itemVariantClass,
                    )}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.target}
                        rel={item.rel}
                        onClick={() => setMenuOpen(false)}
                      >
                        <HugeiconsIcon icon={item.icon} size={15} />
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <>
                        <HugeiconsIcon icon={item.icon} size={15} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </React.Fragment>
              );
            })}

            {/* Eliminar registro */}
            {deleteAction && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    setShowDeleteDialog(true);
                  }}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={15} />
                  <span>{deleteAction.label || "Eliminar"}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Diálogo de Confirmación de Eliminación */}
      {deleteAction && (
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          variant="danger"
          title={deleteAction.title || "¿Eliminar elemento?"}
          description={
            deleteAction.description || "Esta acción no se puede deshacer. ¿Deseas continuar?"
          }
          confirmText={deleteAction.confirmText || "Eliminar"}
          cancelText={deleteAction.cancelText || "Cancelar"}
          onConfirm={handleConfirmDelete}
          isLoading={deleteAction.isPending || isDeleting}
        />
      )}
    </>
  );
}
