"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getRoleColumns } from "./columns/role-columns";
import { RoleModal } from "../../components/modals/role-modal";
import { AssignPermissionsModal } from "../../components/modals/assign-permissions-modal";
import { useRolesQuery } from "../../hooks/use-roles-query";
import type { RoleItem } from "../../types/roles.types";

export function RolesTable() {
  const { data: roles = [], isLoading } = useRolesQuery();

  const [roleModalOpen, setRoleModalOpen] = React.useState(false);
  const [roleToEdit, setRoleToEdit] = React.useState<RoleItem | null>(null);

  const [permissionsModalOpen, setPermissionsModalOpen] = React.useState(false);
  const [roleForPermissions, setRoleForPermissions] = React.useState<RoleItem | null>(null);

  const handleCreate = () => {
    setRoleToEdit(null);
    setRoleModalOpen(true);
  };

  const handleEdit = (role: RoleItem) => {
    setRoleToEdit(role);
    setRoleModalOpen(true);
  };

  const handleAssignPermissions = (role: RoleItem) => {
    setRoleForPermissions(role);
    setPermissionsModalOpen(true);
  };

  const columns = React.useMemo(
    () =>
      getRoleColumns({
        onEdit: handleEdit,
        onAssignPermissions: handleAssignPermissions,
      }),
    [],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={roles}
        isLoading={isLoading}
        searchKey="nombre"
        searchPlaceholder="Buscar rol por nombre..."
        toolbarActions={
          <Button onClick={handleCreate} className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
            Nuevo Rol Adicional
          </Button>
        }
      />

      <RoleModal open={roleModalOpen} onOpenChange={setRoleModalOpen} roleToEdit={roleToEdit} />

      <AssignPermissionsModal
        open={permissionsModalOpen}
        onOpenChange={setPermissionsModalOpen}
        role={roleForPermissions}
      />
    </>
  );
}
