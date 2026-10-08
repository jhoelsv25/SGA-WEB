"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { ROLE_BADGE_VARIANTS } from "../consts/roles.consts";
import type { PermissionCatalogItem, RoleDetail } from "../types/roles.types";
import { cn } from "@/lib/utils";

export interface RolePermissionsPageProps {
  roleId: string;
}

export function RolePermissionsPage({ roleId }: RolePermissionsPageProps) {
  const { data: catalog = [], isLoading: isLoadingCatalog } = usePermissionsCatalogQuery();
  const { data: roleDetail, isLoading: isLoadingRole } = useRoleDetailQuery(roleId);

  const isLoading = isLoadingCatalog || isLoadingRole;

  if (isLoading) {
    return (
      <div className="animate-in fade-in space-y-6 duration-200">
        <div className="flex items-center gap-3">
          <div className="bg-muted/60 size-10 animate-pulse rounded-xl" />
          <div className="space-y-2">
            <div className="bg-muted/60 h-6 w-64 animate-pulse rounded-md" />
            <div className="bg-muted/40 h-4 w-96 animate-pulse rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border-border/60 bg-card h-56 animate-pulse rounded-2xl border p-5"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!roleDetail) {
    return (
      <div className="space-y-4 p-8 text-center">
        <p className="text-muted-foreground text-sm">
          El rol solicitado no existe o no se pudo cargar.
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/admin/roles">Volver a Roles y Permisos</Link>
        </Button>
      </div>
    );
  }

  return <RolePermissionsEditor key={roleDetail.id} roleDetail={roleDetail} catalog={catalog} />;
}

interface RolePermissionsEditorProps {
  roleDetail: RoleDetail;
  catalog: PermissionCatalogItem[];
}

function RolePermissionsEditor({ roleDetail, catalog }: RolePermissionsEditorProps) {
  const mutation = useAssignPermissionsMutation();

  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(
    () => new Set(roleDetail.permisos ?? []),
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const initialPermissions = React.useMemo(
    () => new Set(roleDetail.permisos ?? []),
    [roleDetail.permisos],
  );

  const isAdminRole = roleDetail.nombre === "Administrador";

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

  // Detección de cambios sin guardar
  const hasChanges = React.useMemo(() => {
    if (isAdminRole) return false;
    if (selectedPermissions.size !== initialPermissions.size) return true;
    for (const p of selectedPermissions) {
      if (!initialPermissions.has(p)) return true;
    }
    return false;
  }, [selectedPermissions, initialPermissions, isAdminRole]);

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

  const roleBadge = roleDetail.esSistema ? ROLE_BADGE_VARIANTS.system : ROLE_BADGE_VARIANTS.custom;

  const coveragePercent =
    catalog.length > 0 ? Math.round((selectedPermissions.size / catalog.length) * 100) : 0;

  return (
    <div className="animate-in fade-in-50 space-y-6 pb-24 duration-300">
      {/* Cabecera principal de la página */}
      <PageHeader
        title={`Matriz de Permisos: ${roleDetail.nombre}`}
        description="Asigna y gestiona los privilegios de acceso y operaciones autorizadas en el sistema."
        icon={ShieldCheckIcon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Administración", href: "/admin/roles" },
          { label: "Roles y Permisos", href: "/admin/roles" },
          { label: `Permisos: ${roleDetail.nombre}` },
        ]}
        actions={
          <Button
            asChild
            variant="outline"
            className="h-9 gap-1.5 rounded-full px-4 text-xs font-semibold"
          >
            <Link href="/admin/roles">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
              <span>Volver a Roles</span>
            </Link>
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
            <Badge variant="outline" className={roleBadge.className}>
              {roleBadge.label}
            </Badge>
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
              <span className="text-muted-foreground block text-[10.5px] font-medium">
                {coveragePercent}% de permisos
              </span>
            </div>
            <div className="bg-primary/10 text-primary relative flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
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
                      <p className="text-muted-foreground text-[11px]">
                        {selectedInModule} de {permissions.length} privilegios activos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        allSelectedInModule
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : selectedInModule > 0
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-muted bg-muted/60 text-muted-foreground",
                      )}
                    >
                      {selectedInModule} / {permissions.length}
                    </Badge>

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
                          checked={isChecked}
                          onCheckedChange={() => togglePermission(perm.id)}
                          disabled={isAdminRole}
                          className="mt-0.5 shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-foreground text-xs leading-snug font-bold">
                              {perm.nombre}
                            </p>
                          </div>
                          <span className="text-muted-foreground/80 bg-muted/70 border-border/40 inline-block rounded border px-1.5 py-0.5 font-mono text-[9.5px]">
                            {perm.codigo}
                          </span>
                          {perm.descripcion && (
                            <p className="text-muted-foreground/90 line-clamp-2 text-[11px] leading-relaxed">
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

      {/* Barra de acción flotante (Sticky Footer) */}
      {!isAdminRole && (
        <div className="border-border/80 bg-background/95 fixed right-0 bottom-0 left-0 z-30 border-t px-4 py-3 shadow-2xl backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              {hasChanges ? (
                <div className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                  <span className="size-2 animate-pulse rounded-full bg-amber-500" />
                  <span>Tienes cambios de permisos sin guardar para este rol.</span>
                </div>
              ) : (
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="size-3.5 text-emerald-500"
                  />
                  <span>Todos los cambios están sincronizados con la base de datos.</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges || mutation.isPending}
                className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                <span>Descartar cambios</span>
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || mutation.isPending}
                className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
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
    </div>
  );
}
