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
import { useMenuItemsCatalogQuery, useRoleDetailQuery } from "../hooks/use-roles-query";
import { useAssignMenusMutation } from "../hooks/use-roles-mutations";
import type { MenuOptionCatalogItem, RoleDetail } from "../types/roles.types";
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
  } = useMenuItemsCatalogQuery();
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
      errorTitle="No se pudo cargar el Roles-Menú"
      errorProps={{
        description:
          "Ocurrió un problema al obtener los datos del rol o el catálogo de menús. Por favor, vuelve a intentarlo.",
      }}
    >
      {!roleDetail ? (
        <div className="space-y-4 p-8 text-center">
          <p className="text-muted-foreground text-sm">
            El rol solicitado no existe o no se pudo cargar.
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/roles">Volver a Roles y Menú</Link>
          </Button>
        </div>
      ) : (
        <RoleMenuEditor key={roleDetail.id} roleDetail={roleDetail} catalog={catalog} />
      )}
    </PageState>
  );
}

interface RoleMenuEditorProps {
  roleDetail: RoleDetail;
  catalog: MenuOptionCatalogItem[];
}

/** Solo las opciones (hojas con ruta) otorgan acceso; los contenedores son agrupadores visuales. */
function RoleMenuEditor({ roleDetail, catalog }: RoleMenuEditorProps) {
  const router = useRouter();
  const mutation = useAssignMenusMutation();

  const opciones = React.useMemo(() => catalog.filter((item) => !item.esContenedor), [catalog]);

  const [selectedMenus, setSelectedMenus] = React.useState<Set<string>>(
    () => new Set(roleDetail.menus ?? []),
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [confirmLeaveOpen, setConfirmLeaveOpen] = React.useState(false);

  const initialMenus = React.useMemo(() => new Set(roleDetail.menus ?? []), [roleDetail.menus]);

  const isAdminRole = roleDetail.nombre === "Administrador";

  const hasChanges = React.useMemo(() => {
    if (isAdminRole) return false;
    if (selectedMenus.size !== initialMenus.size) return true;
    for (const id of selectedMenus) {
      if (!initialMenus.has(id)) return true;
    }
    return false;
  }, [selectedMenus, initialMenus, isAdminRole]);

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

  const handleBackToRoles = () => {
    if (hasChanges) {
      setConfirmLeaveOpen(true);
    } else {
      router.push("/admin/roles");
    }
  };

  // Agrupar opciones por contenedor padre (el "módulo" visual de la pantalla)
  const optionsByContainer = React.useMemo(() => {
    const containers = new Map(
      catalog.filter((item) => item.esContenedor).map((item) => [item.id, item]),
    );
    const map = new Map<
      string,
      { containerId: string; containerName: string; options: MenuOptionCatalogItem[] }
    >();
    opciones.forEach((opt) => {
      const containerId = opt.menuPadreId ?? "sin-contenedor";
      if (!map.has(containerId)) {
        map.set(containerId, {
          containerId,
          containerName: containers.get(containerId)?.nombre ?? "Sin agrupar",
          options: [],
        });
      }
      map.get(containerId)!.options.push(opt);
    });
    return Array.from(map.values());
  }, [opciones, catalog]);

  const filteredContainers = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return optionsByContainer;

    return optionsByContainer
      .map((group) => {
        const matchesContainer = group.containerName.toLowerCase().includes(q);
        const filteredOptions = group.options.filter(
          (opt) => matchesContainer || opt.nombre.toLowerCase().includes(q),
        );

        return {
          ...group,
          options: matchesContainer ? group.options : filteredOptions,
        };
      })
      .filter((group) => group.options.length > 0);
  }, [optionsByContainer, searchQuery]);

  const toggleMenu = (id: string) => {
    if (isAdminRole) return;
    const next = new Set(selectedMenus);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedMenus(next);
  };

  const toggleContainer = (groupOptions: MenuOptionCatalogItem[]) => {
    if (isAdminRole) return;
    const next = new Set(selectedMenus);
    const allSelected = groupOptions.every((o) => next.has(o.id));

    if (allSelected) {
      groupOptions.forEach((o) => next.delete(o.id));
    } else {
      groupOptions.forEach((o) => next.add(o.id));
    }
    setSelectedMenus(next);
  };

  const handleToggleAll = () => {
    if (isAdminRole) return;
    if (selectedMenus.size === opciones.length) {
      setSelectedMenus(new Set());
    } else {
      setSelectedMenus(new Set(opciones.map((o) => o.id)));
    }
  };

  const handleReset = () => {
    setSelectedMenus(new Set(initialMenus));
  };

  const handleSave = async () => {
    if (isAdminRole) return;
    await mutation.mutateAsync({
      id: roleDetail.id,
      menuIds: Array.from(selectedMenus),
    });
  };

  const coveragePercent =
    opciones.length > 0 ? Math.round((selectedMenus.size / opciones.length) * 100) : 0;

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      {/* Cabecera principal de la página */}
      <PageHeader
        title={`Roles-Menú: ${roleDetail.nombre}`}
        description="Asigna las opciones de menú (pantallas) a las que el rol tiene acceso. El cargo no da accesos; solo el menú asignado al rol."
        icon={ShieldCheckIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Administración", href: "/admin/roles" },
          { label: "Roles y Menú", href: "/admin/roles" },
          { label: `Menú: ${roleDetail.nombre}` },
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
              El rol <strong>Administrador</strong> ve todas las opciones del sistema de forma
              obligatoria e inmutable. Por directivas de seguridad institucional, este menú no puede
              ser deshabilitado.
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
              placeholder="Filtrar por nombre de opción o grupo..."
              className="border-border/80 bg-muted/20 focus:bg-background h-9 rounded-full pr-3 pl-9 text-xs"
            />
          </div>
        </div>

        {/* Lado derecho: Cobertura y acción rápida de marcar todos */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="border-border/60 flex items-center gap-2 border-r pr-3">
            <div className="text-right">
              <span className="text-foreground text-xs font-bold">
                {selectedMenus.size} / {opciones.length}
              </span>
              <span className="text-muted-foreground block text-xs font-medium">
                {coveragePercent}% de opciones
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
                {selectedMenus.size === opciones.length ? "Desmarcar todos" : "Marcar todos"}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Contenedores de menú agrupados en tarjetas */}
      <div className="space-y-5">
        {filteredContainers.length === 0 ? (
          <div className="border-border/80 rounded-2xl border border-dashed p-12 text-center">
            <div className="bg-muted/40 text-muted-foreground mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </div>
            <p className="text-foreground text-sm font-bold">
              No se encontraron opciones de menú coincidentes
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Prueba con otro término de búsqueda o limpia el filtro.
            </p>
          </div>
        ) : (
          filteredContainers.map(({ containerId, containerName, options }) => {
            const selectedInContainer = options.filter((o) => selectedMenus.has(o.id)).length;
            const allSelectedInContainer =
              options.length > 0 && selectedInContainer === options.length;

            return (
              <div
                key={containerId}
                className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-xs transition-all"
              >
                {/* Cabecera del contenedor */}
                <div className="border-border/60 bg-muted/30 flex flex-col gap-2 border-b px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg">
                      <HugeiconsIcon icon={Layers01Icon} size={15} />
                    </div>
                    <div>
                      <h3 className="text-foreground text-sm font-bold tracking-tight">
                        {containerName}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {selectedInContainer} de {options.length} opciones activas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge
                      tone={
                        allSelectedInContainer
                          ? "success"
                          : selectedInContainer > 0
                            ? "brand"
                            : "neutral"
                      }
                    >
                      {selectedInContainer} / {options.length}
                    </StatusBadge>

                    {!isAdminRole && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleContainer(options)}
                        className="hover:bg-muted h-8 rounded-full px-3 text-xs font-medium"
                      >
                        {allSelectedInContainer ? "Desmarcar grupo" : "Marcar grupo"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Grid de opciones dentro del contenedor */}
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  {options.map((opt) => {
                    const isChecked = isAdminRole || selectedMenus.has(opt.id);
                    const optInputId = `menu-check-${opt.id}`;
                    const optLabelId = `menu-label-${opt.id}`;
                    const optDescId = opt.ruta ? `menu-desc-${opt.id}` : undefined;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleMenu(opt.id)}
                        className={cn(
                          "group relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all select-none",
                          isChecked
                            ? "border-primary/35 bg-primary/5 dark:bg-primary/10 shadow-2xs"
                            : "border-border/60 bg-background hover:border-border hover:bg-muted/30",
                          isAdminRole && "cursor-default opacity-85",
                        )}
                      >
                        <Checkbox
                          id={optInputId}
                          checked={isChecked}
                          onCheckedChange={() => toggleMenu(opt.id)}
                          disabled={isAdminRole}
                          aria-labelledby={optLabelId}
                          aria-describedby={optDescId}
                          className="mt-0.5 shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <label
                            id={optLabelId}
                            htmlFor={optInputId}
                            className="text-foreground cursor-pointer text-xs leading-snug font-bold"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {opt.nombre}
                          </label>
                          {opt.ruta && (
                            <span
                              id={optDescId}
                              className="text-muted-foreground bg-muted/60 border-border/40 inline-block rounded border px-1.5 py-0.5 font-mono text-xs"
                            >
                              {opt.ruta}
                            </span>
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
        <div className="border-border/80 bg-background sticky bottom-0 z-20 -mx-4 mt-6 -mb-6 border-t p-4 shadow-lg sm:mx-0 sm:mb-0 sm:rounded-2xl sm:border">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {hasChanges ? (
                <>
                  <StatusBadge tone="warning" dot>
                    Cambios pendientes
                  </StatusBadge>
                  <span className="text-foreground text-xs font-medium">
                    Tienes cambios en el menú sin guardar para este rol.
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
                <span>Guardar Roles-Menú</span>
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
        description="Tienes modificaciones en el Roles-Menú que no han sido guardadas. Si sales ahora, se perderán los cambios."
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
