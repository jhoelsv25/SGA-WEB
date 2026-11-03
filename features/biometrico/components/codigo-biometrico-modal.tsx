"use client";

import * as React from "react";
import { FingerPrintIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MENSAJE_CODIGO_BIOMETRICO } from "../consts";
import {
  useAsignarCodigoBiometrico,
  useCodigoBiometrico,
  useQuitarCodigoBiometrico,
} from "../hooks";

interface CodigoBiometricoModalProps {
  personaId: string | null;
  nombreCompleto: string;
  onOpenChange: (open: boolean) => void;
}

const FORMATO_CODIGO = /^[A-Za-z0-9]{1,20}$/;

function Formulario({ personaId, onCerrar }: { personaId: string; onCerrar: () => void }) {
  const { data, isLoading } = useCodigoBiometrico(personaId);
  const asignar = useAsignarCodigoBiometrico();
  const quitar = useQuitarCodigoBiometrico();
  const [codigo, setCodigo] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const valor = codigo ?? data?.codigoBiometrico ?? "";
  const ocupado = asignar.isPending || quitar.isPending;

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!FORMATO_CODIGO.test(valor.trim())) {
      setError(MENSAJE_CODIGO_BIOMETRICO);
      return;
    }
    asignar.mutate({ personaId, codigo: valor.trim() }, { onSuccess: onCerrar });
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="codigo-biometrico" className="text-sm font-medium">
          ID de la persona en el reloj *
        </Label>
        <Input
          id="codigo-biometrico"
          value={valor}
          onChange={(e) => {
            setCodigo(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ej. 152"
          maxLength={20}
          inputMode="numeric"
          disabled={isLoading || ocupado}
          aria-invalid={Boolean(error)}
        />
        {error && <p className="text-destructive text-xs font-medium">{error}</p>}
        <p className="text-muted-foreground text-xs">
          Es el número con el que la persona registró su huella en el reloj.
        </p>
      </div>
      <div className="flex justify-between gap-2.5 pt-3">
        <div>
          {data?.codigoBiometrico && (
            <Button
              type="button"
              variant="outline"
              disabled={ocupado}
              onClick={() => quitar.mutate(personaId, { onSuccess: onCerrar })}
              className="min-h-10"
            >
              Quitar código
            </Button>
          )}
        </div>
        <div className="flex gap-2.5">
          <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={ocupado || isLoading} className="min-h-10 gap-2">
            {asignar.isPending && <Spinner className="size-4" />}
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );
}

/** Asigna o quita el código con el que una persona marca en el reloj biométrico (RF-022). */
export function CodigoBiometricoModal({
  personaId,
  nombreCompleto,
  onOpenChange,
}: CodigoBiometricoModalProps) {
  return (
    <Modal
      open={Boolean(personaId)}
      onOpenChange={onOpenChange}
      title="Código biométrico"
      description={`${nombreCompleto}: vincula su huella del reloj con el sistema.`}
      icon={FingerPrintIcon}
      size="md"
    >
      {personaId && (
        <Formulario key={personaId} personaId={personaId} onCerrar={() => onOpenChange(false)} />
      )}
    </Modal>
  );
}
