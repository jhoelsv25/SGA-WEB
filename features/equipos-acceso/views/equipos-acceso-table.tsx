"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCION_EQUIPO_ACCESO_TEXTOS,
  ESTADO_EQUIPO_ACCESO_META,
  PLATAFORMA_EQUIPO_ACCESO_LABEL,
} from "../consts";
import { useEquiposAccesoQuery, useResolverEquipoAccesoMutation } from "../hooks";
import type { AccionEquipoAcceso, EquipoAcceso } from "../types";
import { EquipoAccesoActions, getEquiposAccesoColumns } from "./equipos-acceso-columns";

interface Pendiente {
  equipo: EquipoAcceso;
  accion: AccionEquipoAcceso;
}

export function EquiposAccesoTable() {
  const { data: equipos = [], isLoading, isError, refetch } = useEquiposAccesoQuery();
  const resolver = useResolverEquipoAccesoMutation();

  const [pendiente, setPendiente] = React.useState<Pendiente | null>(null);
  const [motivo, setMotivo] = React.useState("");

  const abrir = React.useCallback((equipo: EquipoAcceso, accion: AccionEquipoAcceso) => {
    setMotivo("");
    setPendiente({ equipo, accion });
  }, []);

  const confirmar = async () => {
    if (!pendiente) return;
    await resolver.mutateAsync({
      id: pendiente.equipo.id,
      accion: pendiente.accion,
      motivo,
    });
    setPendiente(null);
  };

  const columns = React.useMemo(() => getEquiposAccesoColumns({ onResolver: abrir }), [abrir]);
  const textos = pendiente ? ACCION_EQUIPO_ACCESO_TEXTOS[pendiente.accion] : null;
  const pideMotivo = pendiente !== null && pendiente.accion !== "autorizar";

  return (
    <>
      <DataTable
        columns={columns}
        data={equipos}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        caption="Computadoras desde las que el programa del reloj pide autorización"
        searchKey="nombreUsuario"
        searchPlaceholder="Buscar por usuario..."
        emptyState={{
          title: "Aún no hay solicitudes",
          description:
            "Cuando el programa del reloj se conecte desde una computadora nueva, aparecerá aquí como pendiente.",
        }}
        mobileCard={(equipo: EquipoAcceso) => {
          const meta = ESTADO_EQUIPO_ACCESO_META[equipo.estado];
          return (
            <div className="border-border/70 bg-card space-y-2 rounded-xl border p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {equipo.nombreUsuario}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {equipo.nombre} • {PLATAFORMA_EQUIPO_ACCESO_LABEL[equipo.plataforma] ?? "Otro"}
                  </p>
                </div>
                <EquipoAccesoActions equipo={equipo} onResolver={abrir} />
              </div>
              <StatusBadge tone={meta?.tone ?? "neutral"} dot size="sm">
                {meta?.label ?? "Desconocido"}
              </StatusBadge>
            </div>
          );
        }}
      />

      <ConfirmDialog
        open={pendiente !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setPendiente(null);
        }}
        title={textos ? `${textos.titulo}: ${pendiente?.equipo.nombre}` : undefined}
        description={
          textos ? `${textos.descripcion} Usuario: ${pendiente?.equipo.nombreUsuario}.` : undefined
        }
        confirmText={textos?.confirmar}
        variant={pendiente?.accion === "autorizar" ? "info" : "danger"}
        isLoading={resolver.isPending}
        onConfirm={confirmar}
      >
        {pideMotivo && (
          <Textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            maxLength={255}
            placeholder="Motivo (opcional)"
            aria-label="Motivo"
          />
        )}
      </ConfirmDialog>
    </>
  );
}
