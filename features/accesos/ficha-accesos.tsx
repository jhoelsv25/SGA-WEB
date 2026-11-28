"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CopyButton } from "@/components/common/copy-button";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth";
import { CodigoBiometricoModal } from "@/features/biometrico";
import {
  CambiarPinModal,
  CarnetModal,
  ReemitirCredencialModal,
  type CredencialResponse,
} from "@/features/credenciales";
import { ResetPasswordModal } from "@/features/users/components/modals/reset-password-modal";
import { TempPasswordModal } from "@/features/users/components/modals/temp-password-modal";
import type { AccesosPersona } from "./api";
import { accesosKeys, useAccesos } from "./hooks";

type Accion = "pin" | "carne" | "ver-carne" | "biometrico" | "clave" | null;

function Fila({
  titulo,
  estado,
  nota,
  children,
}: {
  titulo: string;
  estado: string;
  nota?: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{titulo}</p>
        <p className="text-muted-foreground text-sm">{estado}</p>
        {nota && <p className="text-muted-foreground text-xs">{nota}</p>}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
    </li>
  );
}

/** Todo lo que se puede restablecer de una persona, según el rol activo (RF-007 V7). */
export function FichaAccesos({ personaId }: { personaId: string }) {
  const { data, isLoading, isError, error } = useAccesos(personaId);

  if (isLoading) return <Spinner className="mx-auto size-6" />;
  if (isError || !data) {
    return <p className="text-destructive text-sm">{error?.message}</p>;
  }
  return <Contenido key={data.personaId} p={data} />;
}

function Contenido({ p }: { p: AccesosPersona }) {
  const { data: sesion } = useSession();
  const rol = sesion?.user.activeRoleName;
  const queryClient = useQueryClient();
  const [accion, setAccion] = React.useState<Accion>(null);
  const [nuevaCredencial, setNuevaCredencial] = React.useState<CredencialResponse | null>(null);
  const [clave, setClave] = React.useState<{ usuario: string; temporal: string } | null>(null);

  // Al cerrar una ventana se vuelve a leer lo que tiene la persona
  const cerrar = () => {
    setAccion(null);
    void queryClient.invalidateQueries({ queryKey: accesosKeys });
  };
  const alCerrar = (abierto: boolean) => {
    if (!abierto) cerrar();
  };
  // La API aplica las mismas reglas: aquí solo se ocultan los botones
  const puedePin = rol === "Soporte TI";
  const puedeClave = rol === "Administrador" || !p.cuenta?.esAdministrador;

  return (
    <div>
      <h2 className="text-lg font-bold">{p.nombreCompleto}</h2>
      <p className="text-muted-foreground text-sm">
        Documento {p.documento} · {p.grupos.join(", ") || "Sin grupo"}
      </p>

      <ul className="divide-border mt-2 divide-y">
        <Fila
          titulo="PIN de marcación"
          estado={p.credencial?.tienePin ? "Tiene PIN" : "No tiene PIN"}
          nota={
            !puedePin
              ? "Solo Soporte TI cambia el PIN."
              : !p.credencial
                ? "Primero emita el carné."
                : undefined
          }
        >
          {puedePin && (
            <Button disabled={!p.credencial} onClick={() => setAccion("pin")} className="min-h-10">
              Restablecer PIN
            </Button>
          )}
        </Fila>

        <Fila
          titulo="Carné y código QR"
          estado={p.credencial ? `Código ${p.credencial.codigo}` : "Sin carné activo"}
          nota="Al emitir uno nuevo se anula el anterior y se genera otro PIN."
        >
          {p.credencial && (
            <Button variant="outline" onClick={() => setAccion("ver-carne")} className="min-h-10">
              Ver carné
            </Button>
          )}
          <Button onClick={() => setAccion("carne")} className="min-h-10">
            {p.credencial ? "Emitir nuevo carné" : "Emitir carné"}
          </Button>
        </Fila>

        <Fila
          titulo="Código biométrico"
          estado={p.codigoBiometrico ? `ID en el reloj: ${p.codigoBiometrico}` : "Sin código"}
          nota="La huella se registra en el reloj; aquí se enlaza su número con la persona."
        >
          <Button onClick={() => setAccion("biometrico")} className="min-h-10">
            {p.codigoBiometrico ? "Cambiar o quitar" : "Asignar código"}
          </Button>
        </Fila>

        <Fila
          titulo="Contraseña de la cuenta"
          estado={
            p.cuenta ? `Usuario ${p.cuenta.nombreUsuario} (${p.cuenta.estado})` : "Sin cuenta web"
          }
          nota={
            puedeClave
              ? undefined
              : "Solo un Administrador cambia la contraseña de un Administrador."
          }
        >
          {p.cuenta && puedeClave && (
            <Button onClick={() => setAccion("clave")} className="min-h-10">
              Restablecer contraseña
            </Button>
          )}
        </Fila>
      </ul>

      <CambiarPinModal
        open={accion === "pin"}
        onOpenChange={alCerrar}
        personaId={p.personaId}
        nombreCompleto={p.nombreCompleto}
      />
      <ReemitirCredencialModal
        open={accion === "carne"}
        onOpenChange={alCerrar}
        personaId={p.personaId}
        nombreCompleto={p.nombreCompleto}
        codigoActual={p.credencial?.codigo}
        onSuccess={setNuevaCredencial}
      />
      {accion === "ver-carne" && (
        <CarnetModal open onOpenChange={alCerrar} personaId={p.personaId} />
      )}
      <CodigoBiometricoModal
        personaId={accion === "biometrico" ? p.personaId : null}
        nombreCompleto={p.nombreCompleto}
        onOpenChange={alCerrar}
      />
      <ResetPasswordModal
        open={accion === "clave"}
        onOpenChange={alCerrar}
        currentUserId={sesion?.user.id}
        user={
          p.cuenta
            ? {
                id: p.cuenta.id,
                nombreUsuario: p.cuenta.nombreUsuario,
                // El nombre completo ya viene armado
                persona: { nombres: p.nombreCompleto, apellidoPaterno: "" },
              }
            : null
        }
        onGenerated={(r, usuario) => setClave({ usuario, temporal: r.tempPassword })}
      />
      <TempPasswordModal
        open={Boolean(clave)}
        onOpenChange={(abierto) => !abierto && setClave(null)}
        username={clave?.usuario ?? ""}
        tempPassword={clave?.temporal ?? ""}
      />
      <Modal
        open={Boolean(nuevaCredencial)}
        onOpenChange={(abierto) => !abierto && setNuevaCredencial(null)}
        title="Carné emitido"
        description="El PIN se muestra una sola vez. Entréguelo solo a la persona."
        size="sm"
      >
        {nuevaCredencial && (
          <div className="space-y-3 text-sm">
            <p>
              Código: <span className="font-mono font-semibold">{nuevaCredencial.codigo}</span>
            </p>
            <p>
              PIN: <span className="font-mono font-semibold">{nuevaCredencial.pin}</span>
            </p>
            <CopyButton
              value={`Código: ${nuevaCredencial.codigo}\nPIN: ${nuevaCredencial.pin}`}
              label="Copiar"
              showToast
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
