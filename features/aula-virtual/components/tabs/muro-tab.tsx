"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Attachment01Icon,
  Comment01Icon,
  Delete02Icon,
  Link01Icon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/empty-state";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/lib/toast";
import { useSession } from "@/features/auth";
import { MENSAJES_VALIDACION } from "../../consts";
import { esTamanoValido } from "../../utils";
import { usePublicacionesMuro, useCrearPublicacionMuro } from "../../hooks";
import {
  OcultarContenidoModal,
  type OcultarContenidoTarget,
} from "../modals/ocultar-contenido-modal";
import { PublicacionCard } from "./muro/publicacion-card";

export function MuroTab({
  cursoSeccionId,
  puedeAdministrar,
  anioCerrado,
}: {
  cursoSeccionId: string;
  puedeAdministrar: boolean;
  anioCerrado: boolean;
}) {
  const session = useSession();
  const usuarioActualId = session.data?.user?.id;

  const {
    data: publicaciones = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePublicacionesMuro(cursoSeccionId);

  const crearPub = useCrearPublicacionMuro(cursoSeccionId);

  const [texto, setTexto] = React.useState("");
  const [archivo, setArchivo] = React.useState<File | null>(null);
  const [enlace, setEnlace] = React.useState("");
  const [mostrarEnlace, setMostrarEnlace] = React.useState(false);
  const [targetModeracion, setTargetModeracion] = React.useState<OcultarContenidoTarget | null>(
    null,
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!esTamanoValido(file)) {
      toast.error(MENSAJES_VALIDACION.ADJUNTO_PESADO);
      e.target.value = "";
      return;
    }
    setArchivo(file);
  };

  const handlePublicar = (e: React.FormEvent) => {
    e.preventDefault();
    if (anioCerrado) {
      toast.error(MENSAJES_VALIDACION.ANIO_CERRADO);
      return;
    }

    const contenidoLimpio = texto.trim();
    const enlaceLimpio = enlace.trim();

    if (!contenidoLimpio && !archivo && !enlaceLimpio) {
      toast.error(MENSAJES_VALIDACION.VACIO);
      return;
    }

    crearPub.mutate(
      {
        payload: {
          contenido: contenidoLimpio,
          enlaceAdjunto: enlaceLimpio || undefined,
        },
        archivo,
      },
      {
        onSuccess: () => {
          setTexto("");
          setArchivo(null);
          setEnlace("");
          setMostrarEnlace(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      },
    );
  };

  // Separar y ordenar publicaciones: fijadas primero, luego por fecha descendente
  const publicacionesOrdenadas = React.useMemo(() => {
    return [...publicaciones].sort((a, b) => {
      if (a.fijada && !b.fijada) return -1;
      if (!a.fijada && b.fijada) return 1;
      return new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime();
    });
  }, [publicaciones]);

  return (
    <div className="space-y-6">
      {/* Alerta de Año Escolar Cerrado (CP-RF017-19) */}
      {anioCerrado && (
        <Alert className="border-warning/40 bg-warning/10">
          <HugeiconsIcon icon={LockIcon} size={18} className="text-warning" />
          <AlertTitle className="text-sm font-semibold">Año escolar cerrado</AlertTitle>
          <AlertDescription className="text-xs">
            {MENSAJES_VALIDACION.ANIO_CERRADO}
          </AlertDescription>
        </Alert>
      )}

      {/* Compositor de publicación */}
      {!anioCerrado && (
        <form
          onSubmit={handlePublicar}
          className="bg-card space-y-3 rounded-xl border p-4 shadow-2xs"
        >
          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Comparte una duda, aviso o recurso con el curso..."
            rows={3}
            className="resize-none text-sm"
            disabled={crearPub.isPending}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleArchivoChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={crearPub.isPending}
              >
                <HugeiconsIcon icon={Attachment01Icon} size={14} />
                Adjuntar archivo (máx 10 MB)
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={() => setMostrarEnlace(!mostrarEnlace)}
                disabled={crearPub.isPending}
              >
                <HugeiconsIcon icon={Link01Icon} size={14} />
                {mostrarEnlace ? "Quitar enlace" : "Adjuntar enlace"}
              </Button>

              {archivo && (
                <div className="bg-muted flex items-center gap-1 rounded px-2 py-0.5 text-xs">
                  <span className="max-w-44 truncate">{archivo.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setArchivo(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={12} />
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              className="h-8 gap-1.5 px-4 text-xs"
              disabled={crearPub.isPending}
            >
              {crearPub.isPending && <Spinner className="size-3" />}
              Publicar en el muro
            </Button>
          </div>

          {mostrarEnlace && (
            <Input
              type="url"
              placeholder="https://enlace-externo.com/recurso"
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
              className="h-8 text-xs"
              disabled={crearPub.isPending}
            />
          )}
        </form>
      )}

      {/* Lista de Publicaciones */}
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el muro del curso"
      >
        {publicacionesOrdenadas.length === 0 ? (
          <EmptyState
            title="Aún no hay publicaciones en el muro"
            description="Sé el primero en iniciar una conversación, compartir una duda o publicar un aviso."
            icon={Comment01Icon}
          />
        ) : (
          <div className="space-y-4">
            {publicacionesOrdenadas.map((pub) => (
              <PublicacionCard
                key={pub.id}
                pub={pub}
                cursoSeccionId={cursoSeccionId}
                puedeAdministrar={puedeAdministrar}
                anioCerrado={anioCerrado}
                usuarioActualId={usuarioActualId}
                onOcultar={setTargetModeracion}
              />
            ))}
          </div>
        )}
      </PageState>

      {/* Modal de confirmación con motivo para ocultar por moderación */}
      <OcultarContenidoModal
        open={Boolean(targetModeracion)}
        onOpenChange={(open) => !open && setTargetModeracion(null)}
        target={targetModeracion}
        cursoSeccionId={cursoSeccionId}
      />
    </div>
  );
}
