"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  ShieldCheckIcon,
  UserIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHistorialCriticoQuery } from "../../hooks/use-personas";
import type { Persona } from "../../types/personas.types";

interface HistorialCriticoModalProps {
  persona: Persona | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NOMBRES_CAMPOS: Record<string, string> = {
  tipoDocumento: "Tipo de Documento",
  numeroDocumento: "Número de Documento",
  nombres: "Nombres",
  apellidoPaterno: "Apellido Paterno",
  apellidoMaterno: "Apellido Materno",
  sexo: "Sexo",
  fechaNacimiento: "Fecha de Nacimiento",
  codigoSiagie: "Código SIAGIE",
  codigoDocente: "Código de Docente",
};

export function HistorialCriticoModal({ persona, open, onOpenChange }: HistorialCriticoModalProps) {
  const { data: historial, isLoading } = useHistorialCriticoQuery(
    open && persona ? persona.id : undefined,
  );

  if (!persona) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="3xl"
      title="Bitácora de Correcciones Críticas"
      description={`Historial de modificaciones de identidad para ${persona.nombreCompleto} (RF-007 HU6).`}
      icon={ShieldCheckIcon}
    >
      <div className="space-y-4 pt-1">
        {isLoading ? (
          <div className="text-muted-foreground flex h-48 items-center justify-center gap-2 text-sm">
            <Spinner size="sm" />
            <span>Consultando bitácora de auditoría...</span>
          </div>
        ) : !historial || historial.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="text-muted-foreground/60 h-10 w-10"
            />
            <h4 className="text-foreground mt-3 text-sm font-semibold">
              Sin correcciones registradas
            </h4>
            <p className="text-muted-foreground mt-1 max-w-sm text-xs">
              Esta persona mantiene sus datos de identidad originales. No se han efectuado
              rectificaciones en su ficha.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="space-y-3.5">
              {historial.map((item) => (
                <div
                  key={item.id}
                  className="bg-card space-y-3 rounded-xl border p-4 shadow-xs transition-colors"
                >
                  {/* Encabezado del cambio */}
                  <div className="flex flex-col justify-between gap-1.5 border-b pb-2.5 sm:flex-row sm:items-center">
                    <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
                      <HugeiconsIcon icon={Clock01Icon} className="text-primary h-3.5 w-3.5" />
                      <span>{new Date(item.fechaHora).toLocaleString("es-PE")}</span>
                      {item.direccionIp && (
                        <span className="text-muted-foreground font-mono text-[11px] font-normal">
                          (IP: {item.direccionIp})
                        </span>
                      )}
                    </div>

                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5" />
                      <span>
                        Autor:{" "}
                        <strong className="text-foreground">
                          {item.usuarioNombre ?? "Administrador"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Motivo justificado */}
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      Motivo registrado:{" "}
                    </span>
                    <span className="text-foreground">{item.motivo}</span>
                  </div>

                  {/* Campos modificados */}
                  {item.camposModificados && item.camposModificados.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                        Campos alterados ({item.camposModificados.length})
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {item.camposModificados.map((campo, idx) => (
                          <div
                            key={idx}
                            className="bg-muted/40 flex flex-col justify-between gap-1 rounded-md px-3 py-1.5 text-xs sm:flex-row sm:items-center"
                          >
                            <span className="text-foreground font-medium">
                              {NOMBRES_CAMPOS[campo.campo] ?? campo.campo}
                            </span>
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <Badge
                                variant="outline"
                                className="border-rose-500/30 bg-rose-500/10 font-normal text-rose-600 dark:text-rose-400"
                              >
                                {String(campo.valorAnterior ?? "—")}
                              </Badge>
                              <span className="text-muted-foreground">→</span>
                              <Badge
                                variant="outline"
                                className="border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400"
                              >
                                {String(campo.valorNuevo ?? "—")}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end border-t pt-2">
          <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
