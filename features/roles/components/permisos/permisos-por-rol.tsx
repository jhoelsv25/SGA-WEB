"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignMenusMutation } from "../../hooks/use-roles-mutations";
import {
  useMenuItemsCatalogQuery,
  useRoleDetailQuery,
  useRolesQuery,
} from "../../hooks/use-roles-query";
import type { RoleDetail } from "../../types/roles.types";
import { construirArbolMenu, opcionesDelNodo, type NodoMenu } from "../../utils/arbol-menu";
import { ArbolPermisos } from "./arbol-permisos";

/** RF-002 (Roles-Menú): se elige el rol y se activan sus opciones en el árbol. */
export function PermisosPorRol() {
  const roles = useRolesQuery();
  const catalogo = useMenuItemsCatalogQuery();
  const [rolId, setRolId] = React.useState<string>();
  const [rolPendiente, setRolPendiente] = React.useState<string>();
  const [hayCambios, setHayCambios] = React.useState(false);
  const detalle = useRoleDetailQuery(rolId);
  const arbol = React.useMemo(() => construirArbolMenu(catalogo.data ?? []), [catalogo.data]);

  const elegirRol = (id: string) => {
    if (hayCambios) {
      setRolPendiente(id);
    } else {
      setRolId(id);
    }
  };

  return (
    <PageState
      isLoading={roles.isLoading || catalogo.isLoading}
      isError={roles.isError || catalogo.isError}
      onRetry={() => {
        void roles.refetch();
        void catalogo.refetch();
      }}
      errorTitle="No se pudieron cargar los roles y menús"
    >
      <div className="space-y-4">
        <div className="max-w-sm space-y-1.5">
          <label htmlFor="rol-permisos" className="text-xs font-semibold">
            Rol
          </label>
          <Select value={rolId ?? ""} onValueChange={elegirRol}>
            <SelectTrigger id="rol-permisos" className="w-full">
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              {(roles.data ?? []).map((rol) => (
                <SelectItem key={rol.id} value={rol.id}>
                  {rol.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!rolId ? (
          <p className="border-border/80 text-muted-foreground rounded-2xl border border-dashed p-10 text-center text-sm">
            Seleccione un rol para ver y cambiar sus opciones de menú.
          </p>
        ) : (
          <PageState
            isLoading={detalle.isLoading}
            isError={detalle.isError}
            onRetry={() => void detalle.refetch()}
            errorTitle="No se pudo cargar el rol"
          >
            {detalle.data && (
              <EditorPermisos
                key={detalle.data.id}
                rol={detalle.data}
                arbol={arbol}
                onCambiosPendientes={setHayCambios}
              />
            )}
          </PageState>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(rolPendiente)}
        onOpenChange={(abierto) => !abierto && setRolPendiente(undefined)}
        title="¿Cambiar de rol sin guardar?"
        description="Los cambios sin guardar de este rol se perderán."
        confirmText="Cambiar sin guardar"
        cancelText="Continuar editando"
        variant="warning"
        onConfirm={() => {
          setHayCambios(false);
          setRolId(rolPendiente);
          setRolPendiente(undefined);
        }}
      />
    </PageState>
  );
}

interface EditorPermisosProps {
  rol: RoleDetail;
  arbol: NodoMenu[];
  onCambiosPendientes: (pendientes: boolean) => void;
}

function EditorPermisos({ rol, arbol, onCambiosPendientes }: EditorPermisosProps) {
  const guardar = useAssignMenusMutation();
  const esAdministrador = rol.nombre === "Administrador";
  const todas = React.useMemo(() => arbol.flatMap(opcionesDelNodo), [arbol]);
  // Solo cuentan las opciones del árbol: la API rechaza menús que ya no están vigentes.
  const iniciales = React.useMemo(() => {
    const asignadas = new Set(rol.menus);
    return new Set(todas.filter((id) => asignadas.has(id)));
  }, [rol.menus, todas]);
  const [edicion, setEdicion] = React.useState<Set<string> | null>(null);
  const seleccionados = edicion ?? iniciales;
  const hayCambios =
    !esAdministrador &&
    (seleccionados.size !== iniciales.size || [...seleccionados].some((id) => !iniciales.has(id)));

  React.useEffect(() => {
    onCambiosPendientes(hayCambios);
    if (!hayCambios) return;
    const avisar = (evento: BeforeUnloadEvent) => evento.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [hayCambios, onCambiosPendientes]);

  const cambiar = (ids: string[], activar: boolean) => {
    const siguiente = new Set(seleccionados);
    ids.forEach((id) => (activar ? siguiente.add(id) : siguiente.delete(id)));
    setEdicion(siguiente);
  };

  const guardarCambios = () =>
    guardar.mutate(
      { id: rol.id, menuIds: [...seleccionados] },
      { onSuccess: () => setEdicion(null) },
    );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs">
          {esAdministrador
            ? "El Administrador tiene acceso a todas las opciones; no se pueden desactivar."
            : `${seleccionados.size} de ${todas.length} opciones activas. El usuario verá los cambios al volver a iniciar sesión.`}
        </p>
        {!esAdministrador && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => cambiar(todas, seleccionados.size !== todas.length)}
          >
            {seleccionados.size === todas.length ? "Desmarcar todo" : "Marcar todo"}
          </Button>
        )}
      </div>

      <ArbolPermisos
        nodos={arbol}
        seleccionados={seleccionados}
        bloqueado={esAdministrador}
        onCambiar={cambiar}
      />

      {hayCambios && (
        <div className="border-border/80 bg-background sticky bottom-0 z-20 flex flex-wrap items-center justify-end gap-2 rounded-2xl border p-3 shadow-lg">
          <span className="mr-auto text-xs font-medium">Hay cambios sin guardar.</span>
          <Button
            type="button"
            variant="outline"
            disabled={guardar.isPending}
            onClick={() => setEdicion(null)}
          >
            Descartar
          </Button>
          <Button type="button" disabled={guardar.isPending} onClick={guardarCambios}>
            {guardar.isPending && <Spinner className="size-3.5" />}
            Guardar permisos
          </Button>
        </div>
      )}
    </div>
  );
}
