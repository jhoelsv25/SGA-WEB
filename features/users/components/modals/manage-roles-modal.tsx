"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldCheckIcon, StarIcon, Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/common/spinner";
import { SelectOption } from "@/components/common/select";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useRolesQuery } from "../../../roles/hooks/use-roles-query";
import { useUserRolesQuery } from "../../hooks/use-users-query";
import {
  useAddRoleMutation,
  useRetireRoleMutation,
  useSetPrincipalRoleMutation,
} from "../../hooks/use-users-mutations";
import type { UserItem } from "../../types/users.types";

interface ManageRolesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserItem | null;
}

export function ManageRolesModal({ open, onOpenChange, user }: ManageRolesModalProps) {
  const [newRoleId, setNewRoleId] = React.useState<string>("");
  const [roleToRetire, setRoleToRetire] = React.useState<{ id: string; nombre: string } | null>(
    null,
  );

  const { data: assignments = [], isLoading } = useUserRolesQuery(user?.id);
  const { data: roles = [] } = useRolesQuery(true);

  const addMutation = useAddRoleMutation();
  const setPrincipalMutation = useSetPrincipalRoleMutation();
  const retireMutation = useRetireRoleMutation();

  if (!user) return null;

  const assignedRoleIds = new Set(assignments.map((a) => a.rolId));
  const roleOptions = roles
    .filter((r) => r.activo && !assignedRoleIds.has(r.id))
    .map((r) => ({ value: r.id, label: r.nombre }));

  const handleAddRole = async () => {
    if (!newRoleId) return;
    await addMutation.mutateAsync({ id: user.id, input: { rolId: newRoleId } });
    setNewRoleId("");
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Gestionar roles de la cuenta"
        description={`Roles de "${user.nombreUsuario}" (${user.persona.nombres} ${user.persona.apellidoPaterno}). Una cuenta siempre tiene al menos un rol vigente.`}
        icon={ShieldCheckIcon}
        size="md"
      >
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Spinner className="size-5" />
            </div>
          ) : (
            <div className="space-y-2">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className="bg-muted/30 flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{a.rolNombre}</span>
                    {a.esPrincipal && (
                      <Badge className="gap-1 rounded-full px-2 py-0.5 text-[11px]">
                        <HugeiconsIcon icon={StarIcon} className="size-3" />
                        Principal
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!a.esPrincipal && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 rounded-full px-3 text-xs"
                        disabled={setPrincipalMutation.isPending}
                        onClick={() => setPrincipalMutation.mutate({ id: user.id, rolId: a.rolId })}
                      >
                        Marcar principal
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 size-8 rounded-full"
                      disabled={assignments.length <= 1}
                      title={
                        assignments.length <= 1
                          ? "La cuenta debe tener al menos un rol"
                          : "Retirar rol"
                      }
                      onClick={() => setRoleToRetire({ id: a.rolId, nombre: a.rolNombre })}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-border/60 flex items-center gap-2 border-t pt-4">
            <SelectOption
              options={roleOptions}
              value={newRoleId}
              onSelect={(val) => setNewRoleId(val)}
              placeholder="Agregar un rol adicional..."
              disabled={addMutation.isPending}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              disabled={!newRoleId || addMutation.isPending}
              onClick={handleAddRole}
              className="h-11 gap-1.5 rounded-full px-4"
            >
              {addMutation.isPending ? (
                <Spinner className="size-3.5" />
              ) : (
                <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
              )}
              <span>Agregar</span>
            </Button>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(roleToRetire)}
        onOpenChange={(v) => !v && setRoleToRetire(null)}
        title={`¿Retirar el rol "${roleToRetire?.nombre}"?`}
        description="La asignación quedará en el historial de roles con quién y cuándo lo retiró."
        confirmText="Sí, retirar"
        isLoading={retireMutation.isPending}
        onConfirm={async () => {
          if (!roleToRetire) return;
          await retireMutation.mutateAsync({ id: user.id, rolId: roleToRetire.id });
          setRoleToRetire(null);
        }}
      />
    </>
  );
}
