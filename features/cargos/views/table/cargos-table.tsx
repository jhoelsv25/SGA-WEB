"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCargoColumns } from "./columns/cargo-columns";
import { CargoActions } from "./columns/cargo-actions";
import { CargoModal } from "../../components/modals/cargo-modal";
import { useCargosQuery } from "../../hooks/use-cargos-query";
import type { CargoItem } from "../../types/cargos.types";

export function CargosTable() {
  const { data: cargos = [], isLoading, isError, refetch } = useCargosQuery(false);

  const [cargoModalOpen, setCargoModalOpen] = React.useState(false);
  const [cargoToEdit, setCargoToEdit] = React.useState<CargoItem | null>(null);

  const handleCreate = () => {
    setCargoToEdit(null);
    setCargoModalOpen(true);
  };

  const handleEdit = React.useCallback((cargo: CargoItem) => {
    setCargoToEdit(cargo);
    setCargoModalOpen(true);
  }, []);

  const columns = React.useMemo(() => getCargoColumns({ onEdit: handleEdit }), [handleEdit]);

  const renderCargoMobileCard = React.useCallback(
    (cargo: CargoItem) => {
      return (
        <div className="border-border/60 bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <button
                type="button"
                onClick={() => handleEdit(cargo)}
                className="text-foreground hover:text-primary text-left text-sm font-semibold transition-colors hover:underline"
              >
                {cargo.nombre}
              </button>
              {cargo.descripcion && (
                <p className="text-muted-foreground text-xs leading-relaxed">{cargo.descripcion}</p>
              )}
              {cargo.rolesSugeridos.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {cargo.rolesSugeridos.map((r) => (
                    <Badge
                      key={r.id}
                      variant="secondary"
                      className="rounded-full px-2 py-0.5 text-xs"
                    >
                      {r.nombre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <CargoActions cargo={cargo} onEdit={handleEdit} />
          </div>

          <div className="border-border/50 flex items-center justify-between border-t pt-3 text-xs">
            <span className="text-muted-foreground font-mono">
              {cargo.personasCount} {cargo.personasCount === 1 ? "persona" : "personas"}
            </span>
            <StatusBadge tone={cargo.vigente ? "success" : "neutral"} dot>
              {cargo.vigente ? "Vigente" : "Desactivado"}
            </StatusBadge>
          </div>
        </div>
      );
    },
    [handleEdit],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={cargos}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        searchKey="nombre"
        searchPlaceholder="Buscar cargo por nombre..."
        mobileCard={renderCargoMobileCard}
        caption="Catálogo de cargos del personal"
        toolbarActions={
          <Button onClick={handleCreate} className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
            Nuevo Cargo
          </Button>
        }
      />

      <CargoModal
        open={cargoModalOpen}
        onOpenChange={setCargoModalOpen}
        cargoToEdit={cargoToEdit}
      />
    </>
  );
}
