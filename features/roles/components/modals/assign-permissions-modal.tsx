"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/common/spinner";
import {
  ShieldCheckIcon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePermissionsCatalogQuery, useRoleDetailQuery } from "../../hooks/use-roles-query";
import { useAssignPermissionsMutation } from "../../hooks/use-roles-mutations";
import type { PermissionCatalogItem, RoleItem } from "../../types/roles.types";

interface AssignPermissionsFormProps {
  catalog: PermissionCatalogItem[];
  initialPermissions: string[];
  isAdminRole: boolean;
  onSave: (permissionIds: string[]) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

function AssignPermissionsForm({
  catalog,
  initialPermissions,
  isAdminRole,
  onSave,
  onCancel,
  isSaving,
}: AssignPermissionsFormProps) {
  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(
    () => new Set(initialPermissions),
  );

  // Agrupar permisos por módulo
  const permissionsByModule = React.useMemo(() => {
    const map = new Map<string, { moduleName: string; permissions: PermissionCatalogItem[] }>();
    catalog.forEach((perm) => {
      if (!map.has(perm.moduloId)) {
        map.set(perm.moduloId, {
          moduleName: perm.moduloNombre,
          permissions: [],
        });
      }
      map.get(perm.moduloId)!.permissions.push(perm);
    });
    return Array.from(map.values());
  }, [catalog]);

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

  const toggleModulePermissions = (modulePermissions: PermissionCatalogItem[]) => {
    if (isAdminRole) return;
    const next = new Set(selectedPermissions);
    const allModuleSelected = modulePermissions.every((p) => next.has(p.id));

    if (allModuleSelected) {
      modulePermissions.forEach((p) => next.delete(p.id));
    } else {
      modulePermissions.forEach((p) => next.add(p.id));
    }
    setSelectedPermissions(next);
  };

  const handleSelectAll = () => {
    if (isAdminRole) return;
    if (selectedPermissions.size === catalog.length) {
      setSelectedPermissions(new Set());
    } else {
      setSelectedPermissions(new Set(catalog.map((p) => p.id)));
    }
  };

  return (
    <div className="space-y-6">
      {isAdminRole && (
        <div className="border-primary/20 bg-primary/5 flex items-start gap-3 rounded-lg border p-3.5 text-sm">
          <HugeiconsIcon icon={AlertCircleIcon} className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-foreground font-medium">Acceso Total de Administrador</p>
            <p className="text-muted-foreground">
              El rol Administrador siempre tiene asignados todos los permisos del sistema de forma
              protegida.
            </p>
          </div>
        </div>
      )}

      {!isAdminRole && (
        <div className="flex items-center justify-between border-b pb-3">
          <div className="text-muted-foreground text-sm">
            <span className="text-foreground font-semibold">{selectedPermissions.size}</span> de{" "}
            {catalog.length} permisos seleccionados
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedPermissions.size === catalog.length ? "Desmarcar todos" : "Marcar todos"}
          </Button>
        </div>
      )}

      <div className="max-h-[55vh] space-y-6 overflow-y-auto pr-1">
        {permissionsByModule.map(({ moduleName, permissions }) => {
          const allSelected = permissions.every((p) => selectedPermissions.has(p.id));

          return (
            <div key={moduleName} className="bg-card/50 rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-foreground font-semibold">{moduleName}</h4>
                  <Badge variant="outline" className="text-xs">
                    {permissions.filter((p) => selectedPermissions.has(p.id)).length} /{" "}
                    {permissions.length}
                  </Badge>
                </div>

                {!isAdminRole && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => toggleModulePermissions(permissions)}
                  >
                    {allSelected ? "Desmarcar módulo" : "Marcar módulo"}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {permissions.map((perm) => {
                  const isChecked = isAdminRole || selectedPermissions.has(perm.id);

                  return (
                    <label
                      key={perm.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-start gap-2.5 rounded-md p-2 transition-colors"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => togglePermission(perm.id)}
                        disabled={isAdminRole}
                        className="mt-0.5"
                      />
                      <div className="space-y-0.5">
                        <p className="text-foreground text-xs leading-none font-medium">
                          {perm.nombre}
                        </p>
                        <p className="text-muted-foreground font-mono text-[10px]">{perm.codigo}</p>
                        {perm.descripcion && (
                          <p className="text-muted-foreground/80 text-[11px]">{perm.descripcion}</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2.5 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cerrar</span>
        </Button>
        {!isAdminRole && (
          <Button
            type="button"
            onClick={() => onSave(Array.from(selectedPermissions))}
            disabled={isSaving}
            className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
          >
            {isSaving ? (
              <Spinner className="size-3.5" />
            ) : (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
            )}
            <span>Guardar permisos</span>
          </Button>
        )}
      </div>
    </div>
  );
}

interface AssignPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleItem | null;
}

export function AssignPermissionsModal({ open, onOpenChange, role }: AssignPermissionsModalProps) {
  const { data: catalog = [], isLoading: isLoadingCatalog } = usePermissionsCatalogQuery();
  const { data: roleDetail, isLoading: isLoadingRole } = useRoleDetailQuery(role?.id);
  const mutation = useAssignPermissionsMutation(() => onOpenChange(false));

  const isAdminRole = role?.nombre === "Administrador";
  const isLoading = isLoadingCatalog || isLoadingRole;

  const handleSave = async (permissionIds: string[]) => {
    if (!role || isAdminRole) return;
    await mutation.mutateAsync({
      id: role.id,
      permissionIds,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Permisos: ${role?.nombre ?? ""}`}
      description="Selecciona los privilegios de acceso para las acciones del sistema."
      icon={ShieldCheckIcon}
      size="2xl"
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner className="text-primary h-8 w-8" />
        </div>
      ) : (
        <AssignPermissionsForm
          key={roleDetail?.id ?? role?.id}
          catalog={catalog}
          initialPermissions={roleDetail?.permisos ?? []}
          isAdminRole={isAdminRole}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
          isSaving={mutation.isPending}
        />
      )}
    </Modal>
  );
}
