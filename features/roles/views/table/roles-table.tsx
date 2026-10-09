"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getRoleColumns } from "./columns/role-columns";
import { RoleActions } from "./columns/role-actions";
import { RoleModal } from "../../components/modals/role-modal";
import { useRolesQuery } from "../../hooks/use-roles-query";
import type { RoleItem } from "../../types/roles.types";

export function RolesTable() {
  const router = useRouter();
  const { data: roles = [], isLoading, isError, refetch } = useRolesQuery();

  const [roleModalOpen, setRoleModalOpen] = React.useState(false);
  const [roleToEdit, setRoleToEdit] = React.useState<RoleItem | null>(null);

  const handleCreate = () => {
    setRoleToEdit(null);
    setRoleModalOpen(true);
  };

  const handleEdit = React.useCallback((role: RoleItem) => {
    setRoleToEdit(role);
    setRoleModalOpen(true);
  }, []);

  const handleAssignPermissions = React.useCallback(
    (role: RoleItem) => {
      router.push(`/admin/roles/${role.id}/permissions`);
    },
    [router],
  );

  const columns = React.useMemo(
    () =>
      getRoleColumns({
        onEdit: handleEdit,
        onAssignPermissions: handleAssignPermissions,
      }),
    [handleEdit, handleAssignPermissions],
  );

  const renderRoleMobileCard = React.useCallback(
    (role: RoleItem) => {
      return (
        <div className="border-border/60 bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAssignPermissions(role)}
                  className="text-foreground hover:text-primary text-left text-sm font-semibold transition-colors hover:underline"
                >
                  {role.nombre}
                </button>
                <StatusBadge tone={role.esSistema ? "brand" : "neutral"}>
                  {role.esSistema ? "Sistema" : "Adicional"}
                </StatusBadge>
              </div>
              {role.descripcion && (
                <p className="text-muted-foreground text-xs leading-relaxed">{role.descripcion}</p>
              )}
            </div>
            <RoleActions
              role={role}
              onEdit={handleEdit}
              onAssignPermissions={handleAssignPermissions}
            />
          </div>

          <div className="border-border/50 flex items-center justify-between border-t pt-3 text-xs">
            <span className="text-muted-foreground font-mono">
              {role.usuariosCount} {role.usuariosCount === 1 ? "cuenta" : "cuentas"}
            </span>
            <StatusBadge tone={role.activo ? "success" : "neutral"} dot>
              {role.activo ? "Activo" : "Inactivo"}
            </StatusBadge>
          </div>
        </div>
      );
    },
    [handleAssignPermissions, handleEdit],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={roles}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        searchKey="nombre"
        searchPlaceholder="Buscar rol por nombre..."
        mobileCard={renderRoleMobileCard}
        caption="Listado de roles del sistema y adicionales"
        toolbarActions={
          <Button onClick={handleCreate} className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
            Nuevo Rol Adicional
          </Button>
        }
      />

      <RoleModal open={roleModalOpen} onOpenChange={setRoleModalOpen} roleToEdit={roleToEdit} />
    </>
  );
}
