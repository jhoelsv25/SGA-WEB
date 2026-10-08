"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Button } from "@/components/ui/button";
import { UserAdd01Icon, FileExportIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useListFilters } from "@/hooks/use-list-filters";
import { useExportExcel } from "@/hooks/use-export-excel";
import { getUserColumns } from "./columns/user-columns";
import { userFilterDefs } from "../../config/filters";
import { userExportColumns } from "../../config/export";
import { useUsersQuery } from "../../hooks/use-users-query";
import { CreateUserModal } from "../../components/modals/create-user-modal";
import { ChangeRoleModal } from "../../components/modals/change-role-modal";
import { UpdateUsernameModal } from "../../components/modals/update-username-modal";
import { TempPasswordModal } from "../../components/modals/temp-password-modal";
import type {
  CreateUserResponse,
  TempPasswordResetResponse,
  UserItem,
  UserStatus,
} from "../../types/users.types";

export function UsersTable() {
  const listFilters = useListFilters(userFilterDefs);
  const search = listFilters.getString("search");
  const estadoRaw = listFilters.getString("estado");
  const estado: UserStatus | undefined =
    estadoRaw && estadoRaw !== "all" ? (estadoRaw as UserStatus) : undefined;

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const {
    data: response,
    isLoading,
    refetch,
    isFetching,
  } = useUsersQuery({
    page,
    limit,
    estado,
    search: search ? search.trim() : undefined,
  });

  const users = response?.data ?? [];

  // Exportación a Excel
  const { exportToExcel, isExporting } = useExportExcel<UserItem>({
    columns: userExportColumns,
    filenamePrefix: "cuentas-usuarios-sga",
    sheetName: "Usuarios",
  });

  // Estados de modales
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  const [roleModalOpen, setRoleModalOpen] = React.useState(false);
  const [userForRole, setUserForRole] = React.useState<UserItem | null>(null);

  const [usernameModalOpen, setUsernameModalOpen] = React.useState(false);
  const [userForUsername, setUserForUsername] = React.useState<UserItem | null>(null);

  const [tempPasswordModalOpen, setTempPasswordModalOpen] = React.useState(false);
  const [tempPasswordData, setTempPasswordData] = React.useState<{
    username: string;
    password: string;
    title: string;
  } | null>(null);

  const handleUserCreated = (res: CreateUserResponse) => {
    setTempPasswordData({
      username: res.user.nombreUsuario,
      password: res.tempPassword,
      title: "Cuenta Creada - Contraseña Temporal",
    });
    setTempPasswordModalOpen(true);
  };

  const handlePasswordReset = (data: TempPasswordResetResponse, username: string) => {
    setTempPasswordData({
      username,
      password: data.tempPassword,
      title: "Contraseña Restablecida",
    });
    setTempPasswordModalOpen(true);
  };

  const handleChangeRole = (user: UserItem) => {
    setUserForRole(user);
    setRoleModalOpen(true);
  };

  const handleUpdateUsername = (user: UserItem) => {
    setUserForUsername(user);
    setUsernameModalOpen(true);
  };

  const columns = React.useMemo(
    () =>
      getUserColumns({
        onChangeRole: handleChangeRole,
        onUpdateUsername: handleUpdateUsername,
        onPasswordReset: handlePasswordReset,
      }),
    [],
  );

  return (
    <div className="space-y-4">
      <ListToolbar
        filterDefs={userFilterDefs}
        listFilters={listFilters}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToExcel(users)}
              disabled={isExporting || users.length === 0}
              className="gap-2"
            >
              <HugeiconsIcon icon={FileExportIcon} className="h-4 w-4" />
              Exportar Excel
            </Button>
            <Button size="sm" onClick={() => setCreateModalOpen(true)} className="gap-2">
              <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
              Crear cuenta
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        pagination={
          response
            ? {
                page,
                totalPages: response.totalPages,
                total: response.total,
                onNextPage: () => setPage((p) => Math.min(p + 1, response.totalPages)),
                onPreviousPage: () => setPage((p) => Math.max(p - 1, 1)),
                canNextPage: page < response.totalPages,
                canPreviousPage: page > 1,
              }
            : false
        }
      />

      {/* Modales */}
      <CreateUserModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onUserCreated={handleUserCreated}
      />

      <ChangeRoleModal open={roleModalOpen} onOpenChange={setRoleModalOpen} user={userForRole} />

      <UpdateUsernameModal
        open={usernameModalOpen}
        onOpenChange={setUsernameModalOpen}
        user={userForUsername}
      />

      {tempPasswordData && (
        <TempPasswordModal
          open={tempPasswordModalOpen}
          onOpenChange={setTempPasswordModalOpen}
          username={tempPasswordData.username}
          tempPassword={tempPasswordData.password}
          actionTitle={tempPasswordData.title}
        />
      )}
    </div>
  );
}
