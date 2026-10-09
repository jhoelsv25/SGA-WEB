"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShieldCheckIcon,
  ArrowLeft01Icon,
  Search01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  CheckmarkBadge01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { usePermissionsCatalogQuery, useRoleDetailQuery } from "../hooks/use-roles-query";
import { useAssignPermissionsMutation } from "../hooks/use-roles-mutations";
import type { PermissionCatalogItem, RoleDetail } from "../types/roles.types";
import { cn } from "@/lib/utils";

export interface RolePermissionsPageProps {
  roleId: string;
}

export function RolePermissionsPage({ roleId }: RolePermissionsPageProps) {
  const {
    data: catalog = [],
    isLoading: isLoadingCatalog,
    isError: isErrorCatalog,
    refetch: refetchCatalog,
  } = usePermissionsCatalogQuery();
  const {
    data: roleDetail,
    isLoading: isLoadingRole,
    isError: isErrorRole,
    refetch: refetchRole,
  } = useRoleDetailQuery(roleId);

  const isLoading = isLoadingCatalog || isLoadingRole;
  const isError = isErrorCatalog || isErrorRole;

  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      onRetry={() => {
        if (isErrorCatalog) void refetchCatalog();
        if (isErrorRole) void refetchRole();
      }}
      errorTitle="No se pudo cargar la matriz de permisos"
      errorProps={{
        description:
          "Ocurrió un problema al obtener los datos del rol o el catálogo de permisos. Por favor, vuelve a intentarlo.",
      }}
    >
      {!roleDetail ? (
        <div className="space-y-4 p-8 text-center">
          <p className="text-muted-foreground text-sm">
            El rol solicitado no existe o no se pudo cargar.
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/roles">Volver a Roles y Permisos</Link>
          </Button>
        </div>
      ) : (
        <RolePermissionsEditor key={roleDetail.id} roleDetail={roleDetail} catalog={catalog} />
      )}
    </PageState>
  );
}

interface RolePermissionsEditorProps {
  roleDetail: RoleDetail;
  catalog: PermissionCatalogItem[];
}

function RolePermissionsEditor({ roleDetail, catalog }: RolePermissionsEditorProps) {
  const router = useRouter();
  const mutation = useAssignPermissionsMutation();

  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(
    () => new Set(roleDetail.permisos ?? []),
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [confirmLeaveOpen, setConfirmLeaveOpen] = React.useState(false);

  const initialPermissions = React.useMemo(
    () => new Set(roleDetail.permisos ?? []),
    [roleDetail.permisos],
  );

  const isAdminRole = roleDetail.nombre === "Administrador";

  // Detección de cambios sin guardar
  const hasChanges = React.useMemo(() => {
    if (isAdminRole) return false;
    if (selectedPermissions.size !== initialPermissions.size) return true;
    for (const p of selectedPermissions) {
      if (!initialPermissions.has(p)) return true;
    }
    return false;
  }, [selectedPermissions, initialPermissions, isAdminRole]);

  // Aviso al intentar cerrar la pestaña o recargar con cambios sin guardar
  React.useEffect(() => {
    if (!hasChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

  // Navegación segura hacia el listado de roles
  const handleBackToRoles = () => {
    if (hasChanges) {
      setConfirmLeaveOpen(true);
    } else {
      router.push("/admin/roles");
    }
  };

  // Agrupar catálogo por módulo
  const permissionsByModule = React.useMemo(() => {
    const map = new Map<
      string,
      { moduleId: string; moduleName: string; permissions: PermissionCatalogItem[] }
    >();
    catalog.forEach((perm) => {
      if (!map.has(perm.moduloId)) {
        map.set(perm.moduloId, {
          moduleId: perm.moduloId,
          moduleName: perm.moduloNombre,
          permissions: [],
        });
      }
      map.get(perm.moduloId)!.permissions.push(perm);
    });
    return Array.from(map.values());
  }, [catalog]);

  // Filtrar módulos y permisos según la búsqueda
  const filteredModules = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return permissionsByModule;

    return permissionsByModule
      .map((mod) => {
        const matchesModule = mod.moduleName.toLowerCase().includes(q);
        const filteredPerms = mod.permissions.filter(
          (p) =>
            matchesModule ||
            p.nombre.toLowerCase().includes(q) ||
            p.codigo.toLowerCase().includes(q) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(q)),
        );

        return {
          ...mod,
          permissions: matchesModule ? mod.permissions : filteredPerms,
        };
      })
      .filter((mod) => mod.permissions.length > 0);
  }, [permissionsByModule, searchQuery]);

  // Conmutar un permiso individual
  const togglePermission = (id: string) => {
    if (isAdminRole) return;
    const next = new Set(selectedPermissions);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedPermissions(next);
  };

  // Conmutar todos los permisos de un módulo
  const toggleModule = (modulePermissions: PermissionCatalogItem[]) => {
    if (isAdminRole) return;
    const next = new Set(selectedPermissions);
    const allSelected = modulePermissions.every((p) => next.has(p.id));

    if (allSelected) {
      modulePermissions.forEach((p) => next.delete(p.id));
    } else {
      modulePermissions.forEach((p) => next.add(p.id));
    }
    setSelectedPermissions(next);
  };

  // Marcar o desmarcar todos en el catálogo
  const handleToggleAll = () => {
    if (isAdminRole) return;
    if (selectedPermissions.size === catalog.length) {
      setSelectedPermissions(new Set());
    } else {
      setSelectedPermissions(new Set(catalog.map((p) => p.id)));
    }
  };

  // Restablecer al estado inicial
  const handleReset = () => {
    setSelectedPermissions(new Set(initialPermissions));
  };

  // Guardar cambios en lote
  const handleSave = async () => {
    if (isAdminRole) return;
    await mutation.mutateAsync({
      id: roleDetail.id,
      permissionIds: Array.from(selectedPermissions),
    });
  };

  const coveragePercent =
    catalog.length > 0 ? Math.round((selectedPermissions.size / catalog.length) * 100) : 0;

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      {/* Cabecera principal de la página */}
      <PageHeader
        title={`Matriz de Permisos: ${roleDetail.nombre}`}
        description="Asigna y gestiona los privilegios de acceso y operaciones autorizadas en el sistema."
        icon={ShieldCheckIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Administración", href: "/admin/roles" },
          { label: "Roles y Permisos", href: "/admin/roles" },
          { label: `Permisos: ${roleDetail.nombre}` },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={handleBackToRoles}
            className="h-9 gap-1.5 rounded-full px-4 text-xs font-semibold"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
            <span>Volver a Roles</span>
          </Button>
        }
      />

      {/* Banner de protección para el rol Administrador */}
      {isAdminRole && (
        <div className="border-primary/25 bg-primary/5 flex items-start gap-3.5 rounded-2xl border p-4 text-sm shadow-xs">
          <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
            <HugeiconsIcon icon={AlertCircleIcon} size={20} strokeWidth={2} />
          </div>
          <div className="space-y-0.5">
            <p className="text-foreground font-bold">Acceso Maestro Protegido (Superusuario)</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              El rol <strong>Administrador</strong> cuenta con todos los permisos del sistema de
              forma obligatoria e inmutable. Por directivas de seguridad institucional, esta matriz
              no puede ser deshabilitada.
            </p>
          </div>
        </div>
      )}

      {/* Barra de herramientas, filtros y cobertura */}
      <div className="border-border/80 bg-card flex flex-col gap-4 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Lado izquierdo: Metadatos del rol y buscador */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge tone={roleDetail.esSistema ? "brand" : "neutral"}>
              {roleDetail.esSistema ? "Sistema" : "Adicional"}
            </StatusBadge>
            <span className="text-muted-foreground font-mono text-xs">
              {roleDetail.usuariosCount}{" "}
              {roleDetail.usuariosCount === 1 ? "usuario asignado" : "usuarios asignados"}
            </span>
          </div>

          <div className="relative max-w-md flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground/70 absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por nombre, código o módulo..."
              className="border-border/80 bg-muted/20 focus:bg-background h-9 rounded-full pr-3 pl-9 text-xs"
            />
          </div>
        </div>

        {/* Lado derecho: Cobertura y acción rápida de marcar todos */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="border-border/60 flex items-center gap-2 border-r pr-3">
            <div className="text-right">
              <span className="text-foreground text-xs font-bold">
                {selectedPermissions.size} / {catalog.length}
              </span>
              <span className="text-muted-foreground block text-xs font-medium">
                {coveragePercent}% de permisos
              </span>
            </div>
            <div className="bg-primary/10 text-primary relative flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {coveragePercent}%
            </div>
          </div>

          {!isAdminRole && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToggleAll}
              className="h-8 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-3.5" />
              <span>
                {selectedPermissions.size === catalog.length ? "Desmarcar todos" : "Marcar todos"}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Módulos agrupados en tarjetas */}
      <div className="space-y-5">
        {filteredModules.length === 0 ? (
          <div className="border-border/80 rounded-2xl border border-dashed p-12 text-center">
            <div className="bg-muted/40 text-muted-foreground mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </div>
            <p className="text-foreground text-sm font-bold">
              No se encontraron permisos coincidentes
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Prueba con otro término de búsqueda o limpia el filtro.
            </p>
          </div>
        ) : (
          filteredModules.map(({ moduleId, moduleName, permissions }) => {
            const selectedInModule = permissions.filter((p) =>
              selectedPermissions.has(p.id),
            ).length;
            const allSelectedInModule =
              permissions.length > 0 && selectedInModule === permissions.length;

            return (
              <div
                key={moduleId}
                className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-xs transition-all"
              >
                {/* Cabecera del Módulo */}
                <div className="border-border/60 bg-muted/30 flex flex-col gap-2 border-b px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg">
                      <HugeiconsIcon icon={Layers01Icon} size={15} />
                    </div>
                    <div>
                      <h3 className="text-foreground text-sm font-bold tracking-tight">
                        {moduleName}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {selectedInModule} de {permissions.length} privilegios activos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge
                      tone={
                        allSelectedInModule ? "success" : selectedInModule > 0 ? "brand" : "neutral"
                      }
                    >
                      {selectedInModule} / {permissions.length}
                    </StatusBadge>

                    {!isAdminRole && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleModule(permissions)}
                        className="hover:bg-muted h-8 rounded-full px-3 text-xs font-medium"
                      >
                        {allSelectedInModule ? "Desmarcar módulo" : "Marcar módulo"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Grid de Permisos dentro del Módulo */}
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  {permissions.map((perm) => {
                    const isChecked = isAdminRole || selectedPermissions.has(perm.id);
                    const permInputId = `perm-check-${perm.id}`;
                    const permLabelId = `perm-label-${perm.id}`;
                    const permDescId = perm.descripcion ? `perm-desc-${perm.id}` : undefined;

                    return (
                      <div
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={cn(
                          "group relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all select-none",
                          isChecked
                            ? "border-primary/35 bg-primary/5 dark:bg-primary/10 shadow-2xs"
                            : "border-border/60 bg-background hover:border-border hover:bg-muted/30",
                          isAdminRole && "cursor-default opacity-85",
                        )}
                      >
                        <Checkbox
                          id={permInputId}
                          checked={isChecked}
                          onCheckedChange={() => togglePermission(perm.id)}
                          disabled={isAdminRole}
                          aria-labelledby={permLabelId}
                          aria-describedby={permDescId}
                          className="mt-0.5 shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <label
                              id={permLabelId}
                              htmlFor={permInputId}
                              className="text-foreground cursor-pointer text-xs leading-snug font-bold"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {perm.nombre}
                            </label>
                          </div>
                          <span className="text-muted-foreground bg-muted/60 border-border/40 inline-block rounded border px-1.5 py-0.5 font-mono text-xs">
                            {perm.codigo}
                          </span>
                          {perm.descripcion && (
                            <p
                              id={permDescId}
                              className="text-muted-foreground line-clamp-2 text-xs leading-relaxed"
                            >
                              {perm.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Barra de acción pegajosa (Sticky Footer) */}
      {!isAdminRole && (
        <div className="border-border/80 bg-background/95 sticky bottom-0 z-20 -mx-4 mt-6 -mb-6 border-t p-4 shadow-lg backdrop-blur-md sm:mx-0 sm:mb-0 sm:rounded-2xl sm:border">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {hasChanges ? (
                <>
                  <StatusBadge tone="warning" dot>
                    Cambios pendientes
                  </StatusBadge>
                  <span className="text-foreground text-xs font-medium">
                    Tienes cambios de permisos sin guardar para este rol.
                  </span>
                </>
              ) : (
                <>
                  <StatusBadge tone="success" dot>
                    Sincronizado
                  </StatusBadge>
                  <span className="text-muted-foreground text-xs">
                    Todos los cambios están sincronizados con la base de datos.
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges || mutation.isPending}
                className="h-10 w-full gap-1.5 rounded-full px-4.5 text-xs font-semibold sm:w-auto"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                <span>Descartar cambios</span>
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || mutation.isPending}
                className="shadow-primary/20 h-10 w-full gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md sm:w-auto"
              >
                {mutation.isPending ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                )}
                <span>Guardar matriz de permisos</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación antes de salir con cambios sin guardar */}
      <ConfirmDialog
        open={confirmLeaveOpen}
        onOpenChange={setConfirmLeaveOpen}
        title="¿Salir sin guardar cambios?"
        description="Tienes modificaciones en la matriz de permisos que no han sido guardadas. Si sales ahora, se perderán los cambios."
        confirmText="Salir sin guardar"
        cancelText="Continuar editando"
        variant="warning"
        onConfirm={() => {
          setConfirmLeaveOpen(false);
          router.push("/admin/roles");
        }}
      />
    </div>
  );
}
