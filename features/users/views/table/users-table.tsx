"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Spinner } from "@/components/common/spinner";
import { UserAdd01Icon, FileExportIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useListFilters } from "@/hooks/use-list-filters";
import { useExportarReporte } from "@/hooks/use-exportar-reporte";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";
import { getUserColumns } from "./columns/user-columns";
import { UserActions } from "./columns/user-actions";
import { userFilterDefs } from "../../config/filters";
import { USER_STATUS_CONFIG } from "../../consts/users.consts";
import { useUsersQuery } from "../../hooks/use-users-query";
import { useSession } from "../../../auth/hooks/use-auth";
import { CreateUserModal } from "../../components/modals/create-user-modal";
import { ManageRolesModal } from "../../components/modals/manage-roles-modal";
import { UpdateUsernameModal } from "../../components/modals/update-username-modal";
import { TempPasswordModal } from "../../components/modals/temp-password-modal";
import type {
  CreateUserResponse,
  TempPasswordResetResponse,
  UserItem,
  UserStatus,
} from "../../types/users.types";

export function UsersTable() {
  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user?.id;

  const listFilters = useListFilters(userFilterDefs);
  const search = listFilters.getString("search");
  const estadoRaw = listFilters.getString("estado");
  const estado: UserStatus | undefined =
    estadoRaw && estadoRaw !== "all" ? (estadoRaw as UserStatus) : undefined;

  const limit = 10;
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const currentCursor = cursorHistory[pageIndex] ?? null;

  const [prevFilters, setPrevFilters] = React.useState({ search, estado });
  if (prevFilters.search !== search || prevFilters.estado !== estado) {
    setPrevFilters({ search, estado });
    setCursorHistory([null]);
    setPageIndex(0);
  }

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useUsersQuery({
    cursor: currentCursor,
    limit,
    estado,
    search: search ? search.trim() : undefined,
  });

  const handleNextPage = () => {
    if (response?.nextCursor) {
      setCursorHistory((prev) => [...prev.slice(0, pageIndex + 1), response.nextCursor]);
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const users = response?.data ?? [];

  // Exportación a Excel (todas las filas filtradas, generadas por el servidor)
  const { exportar, isExporting } = useExportarReporte("usuarios");
  const handleExportAll = () => exportar({ estado, search: search ? search.trim() : undefined });

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
    if (!res.tempPassword) {
      // La persona ya tenía cuenta: solo se le agregó el cargo y los roles, sin contraseña nueva.
      return;
    }
    setTempPasswordData({
      username: res.usuario.nombreUsuario,
      password: res.tempPassword,
      title: res.cuentaExistente
        ? "Cargo y roles agregados"
        : "Cuenta creada - contraseña temporal",
    });
    setTempPasswordModalOpen(true);
  };

  const handlePasswordReset = (data: TempPasswordResetResponse, username: string) => {
    setTempPasswordData({
      username,
      password: data.tempPassword,
      title: "Contraseña restablecida",
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
        currentUserId,
        onChangeRole: handleChangeRole,
        onUpdateUsername: handleUpdateUsername,
        onPasswordReset: handlePasswordReset,
      }),
    [currentUserId],
  );

  const renderUserMobileCard = React.useCallback(
    (user: UserItem) => {
      const p = user.persona;
      const fullName = `${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}, ${p.nombres}`.trim();
      const estadoConfig = USER_STATUS_CONFIG[user.estado] ?? USER_STATUS_CONFIG.inactivo;

      return (
        <div className="border-border/70 bg-card space-y-3 rounded-xl border p-4 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar name={fullName} avatar={p.fotoUrl ?? undefined} />
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-semibold">{fullName}</p>
                <p className="text-muted-foreground font-mono text-xs">
                  <span className="uppercase">{p.tipoDocumento}</span>: {p.numeroDocumento}
                  {p.correo && ` · ${p.correo}`}
                </p>
              </div>
            </div>
            <UserActions
              user={user}
              currentUserId={currentUserId}
              onChangeRole={handleChangeRole}
              onUpdateUsername={handleUpdateUsername}
              onPasswordReset={handlePasswordReset}
            />
          </div>

          <div className="border-border/50 flex flex-wrap items-center gap-2 border-t pt-2 text-xs">
            <span className="text-foreground/90 bg-muted/60 border-border/60 rounded-md border px-2 py-0.5 font-mono font-semibold">
              {user.nombreUsuario}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                user.rol.esSistema
                  ? "border-primary/20 bg-primary/10 text-primary dark:bg-primary/20"
                  : "border-border/80 bg-muted/60 text-muted-foreground",
              )}
            >
              {user.rol.nombre}
            </Badge>
            <StatusBadge tone={estadoConfig.tone} dot size="sm">
              {estadoConfig.label}
            </StatusBadge>
          </div>

          {user.ultimoAcceso && (
            <p className="text-muted-foreground text-xs">
              Último acceso: {formatDate(user.ultimoAcceso, "dd/MM/yyyy HH:mm")}
            </p>
          )}
        </div>
      );
    },
    [currentUserId],
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
              onClick={() => void handleExportAll()}
              disabled={isExporting || users.length === 0}
              className="gap-2"
            >
              {isExporting ? (
                <Spinner className="size-4" />
              ) : (
                <HugeiconsIcon icon={FileExportIcon} className="size-4" />
              )}
              <span>{isExporting ? "Exportando..." : "Exportar Excel"}</span>
            </Button>
            <Button size="sm" onClick={() => setCreateModalOpen(true)} className="gap-2">
              <HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
              Crear cuenta
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        hasActiveFilters={Boolean(search || estado)}
        caption="Listado de cuentas de usuario del sistema"
        mobileCard={renderUserMobileCard}
        cursorPagination={{
          hasNextPage: Boolean(response?.hasMore && response?.nextCursor),
          hasPreviousPage: pageIndex > 0,
          onNextPage: handleNextPage,
          onPreviousPage: handlePreviousPage,
          isLoading: isFetching,
          loadedCount: users.length,
        }}
      />

      {/* Modales */}
      <CreateUserModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onUserCreated={handleUserCreated}
      />

      <ManageRolesModal open={roleModalOpen} onOpenChange={setRoleModalOpen} user={userForRole} />

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
