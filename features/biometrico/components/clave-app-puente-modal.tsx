"use client";

import * as React from "react";
import { Key01Icon } from "@hugeicons/core-free-icons";
import { CopyButton } from "@/components/common/copy-button";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { ApiClientError } from "@/lib/api-client";
import { autorizarEquipo } from "@/features/equipos/api";
import type { Equipo } from "@/features/equipos/types";
import { toast } from "@/lib/toast";

interface ClaveAppPuenteModalProps {
  equipo: Equipo | null;
  onOpenChange: (open: boolean) => void;
}

function Contenido({ equipo, onCerrar }: { equipo: Equipo; onCerrar: () => void }) {
  const [clave, setClave] = React.useState<string | null>(null);
  const [generando, setGenerando] = React.useState(false);

  const generar = async () => {
    setGenerando(true);
    try {
      const respuesta = await autorizarEquipo(equipo.id);
      // El servidor devuelve la clave una sola vez (tokenAutorizacion); no se guarda en el navegador.
      const valor =
        (respuesta as unknown as { tokenAutorizacion?: string }).tokenAutorizacion ??
        respuesta.token;
      setClave(valor);
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "No se pudo generar la clave.");
    } finally {
      setGenerando(false);
    }
  };

  if (clave) {
    return (
      <div className="space-y-4">
        <p className="text-sm">
          Copie la clave y péguela en la <strong>app puente</strong>. Por seguridad, no se volverá a
          mostrar.
        </p>
        <div className="bg-muted/40 flex items-center justify-between gap-3 rounded-xl border p-3">
          <code className="text-foreground text-xs break-all">{clave}</code>
          <CopyButton value={clave} label="Copiar clave" showToast variant="outline" />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" onClick={onCerrar} className="min-h-10">
            Listo, ya la copié
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm">
        Se genera la clave con la que la app puente de <strong>{equipo.nombre}</strong> envía las
        marcaciones al sistema.
        {equipo.autorizado && " Si ya existía una clave, la anterior dejará de funcionar."}
      </p>
      <div className="flex justify-end gap-2.5 pt-2">
        <Button type="button" variant="outline" onClick={onCerrar} className="min-h-10">
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={() => void generar()}
          disabled={generando}
          className="min-h-10 gap-2"
        >
          {generando && <Spinner className="size-4" />}
          {equipo.autorizado ? "Generar una clave nueva" : "Generar clave"}
        </Button>
      </div>
    </div>
  );
}

/** Clave de la app puente del reloj biométrico (RF-022). Distinta de autorizar un kiosko. */
export function ClaveAppPuenteModal({ equipo, onOpenChange }: ClaveAppPuenteModalProps) {
  return (
    <Modal
      open={Boolean(equipo)}
      onOpenChange={onOpenChange}
      title="Clave de la app puente"
      description="Conecta el reloj biométrico con el sistema."
      icon={Key01Icon}
      size="md"
      preventClose
    >
      {equipo && <Contenido key={equipo.id} equipo={equipo} onCerrar={() => onOpenChange(false)} />}
    </Modal>
  );
}
