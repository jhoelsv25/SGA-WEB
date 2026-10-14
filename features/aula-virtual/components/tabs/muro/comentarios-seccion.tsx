"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileEditIcon, Sent02Icon, ShieldAlertIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { Spinner } from "@/components/common/spinner";
import { toast } from "@/lib/toast";
import { MENSAJES_VALIDACION } from "../../../consts";
import { sePuedeEditar, formatearFechaHora } from "../../../utils";
import {
  useComentariosMuro,
  useCrearComentarioMuro,
  useEditarComentarioMuro,
} from "../../../hooks";
import type { ComentarioMuro } from "../../../types";
import type { OcultarContenidoTarget } from "../../modals/ocultar-contenido-modal";

interface ComentariosSeccionProps {
  publicacionId: string;
  cursoSeccionId: string;
  puedeAdministrar: boolean;
  anioCerrado: boolean;
  usuarioActualId?: string;
  onOcultar: (target: OcultarContenidoTarget) => void;
}

export function ComentariosSeccion({
  publicacionId,
  cursoSeccionId,
  puedeAdministrar,
  anioCerrado,
  usuarioActualId,
  onOcultar,
}: ComentariosSeccionProps) {
  const { data: comentarios = [], isLoading } = useComentariosMuro(publicacionId);
  const crearComentario = useCrearComentarioMuro(publicacionId, cursoSeccionId);
  const editarComentario = useEditarComentarioMuro(publicacionId);

  const [nuevoTexto, setNuevoTexto] = React.useState("");
  const [comentarioEditandoId, setComentarioEditandoId] = React.useState<string | null>(null);
  const [textoEditando, setTextoEditando] = React.useState("");

  const handleCrear = (e: React.FormEvent) => {
    e.preventDefault();
    if (anioCerrado) {
      toast.error(MENSAJES_VALIDACION.ANIO_CERRADO);
      return;
    }
    const texto = nuevoTexto.trim();
    if (!texto) {
      toast.error(MENSAJES_VALIDACION.VACIO);
      return;
    }
    crearComentario.mutate(texto, {
      onSuccess: () => setNuevoTexto(""),
    });
  };

  const handleIniciarEdicion = (c: ComentarioMuro) => {
    if (!sePuedeEditar(c.creadoEn)) {
      toast.error(MENSAJES_VALIDACION.EDICION_FUERA_DE_PLAZO);
      return;
    }
    setComentarioEditandoId(c.id);
    setTextoEditando(c.contenido);
  };

  const handleGuardarEdicion = (id: string, creadoEn: string) => {
    if (!sePuedeEditar(creadoEn)) {
      toast.error(MENSAJES_VALIDACION.EDICION_FUERA_DE_PLAZO);
      setComentarioEditandoId(null);
      return;
    }
    const texto = textoEditando.trim();
    if (!texto) {
      toast.error(MENSAJES_VALIDACION.VACIO);
      return;
    }
    editarComentario.mutate(
      { id, contenido: texto },
      {
        onSuccess: () => {
          setComentarioEditandoId(null);
          setTextoEditando("");
        },
      },
    );
  };

  return (
    <div className="mt-4 space-y-3 border-t pt-3">
      {isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 py-2 text-xs">
          <Spinner className="size-3" />
          <span>Cargando comentarios...</span>
        </div>
      ) : comentarios.length > 0 ? (
        <div className="space-y-2.5">
          {comentarios.map((c) => {
            const esAutor = Boolean(usuarioActualId && c.autorId === usuarioActualId);
            const puedeModificar = esAutor && !anioCerrado && sePuedeEditar(c.creadoEn);
            const estaEditando = comentarioEditandoId === c.id;

            return (
              <div
                key={c.id}
                className="group bg-muted/40 flex items-start gap-2.5 rounded-lg p-2.5 text-sm"
              >
                <UserAvatar name={c.autorNombre} className="size-7 text-[11px]" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground text-xs font-medium">{c.autorNombre}</span>
                      {c.autorRol && (
                        <StatusBadge
                          tone={c.autorRol === "docente" ? "brand" : "neutral"}
                          className="px-1 py-0 text-[10px]"
                        >
                          {c.autorRol === "docente" ? "Docente" : "Estudiante"}
                        </StatusBadge>
                      )}
                      <span className="text-muted-foreground text-[11px]">
                        {formatearFechaHora(c.creadoEn)}
                        {c.actualizadoEn && c.actualizadoEn !== c.creadoEn && " (editado)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {esAutor && !estaEditando && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground h-6 px-1.5 text-xs"
                          disabled={!puedeModificar}
                          onClick={() => handleIniciarEdicion(c)}
                        >
                          <HugeiconsIcon icon={FileEditIcon} size={12} className="mr-1" />
                          Editar
                        </Button>
                      )}
                      {puedeAdministrar && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 h-6 px-1.5 text-xs"
                          onClick={() =>
                            onOcultar({
                              tipo: "comentario",
                              id: c.id,
                              descripcion: c.contenido,
                            })
                          }
                        >
                          <HugeiconsIcon icon={ShieldAlertIcon} size={12} className="mr-1" />
                          Ocultar
                        </Button>
                      )}
                    </div>
                  </div>

                  {estaEditando ? (
                    <div className="mt-1 space-y-2">
                      <Textarea
                        value={textoEditando}
                        onChange={(e) => setTextoEditando(e.target.value)}
                        className="text-xs"
                        rows={2}
                        disabled={editarComentario.isPending}
                      />
                      <div className="flex justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setComentarioEditandoId(null)}
                          disabled={editarComentario.isPending}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          disabled={editarComentario.isPending}
                          onClick={() => handleGuardarEdicion(c.id, c.creadoEn)}
                        >
                          {editarComentario.isPending && <Spinner className="mr-1 size-3" />}
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground/90 text-xs whitespace-pre-wrap">{c.contenido}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {!anioCerrado && (
        <form onSubmit={handleCrear} className="flex items-center gap-2 pt-1">
          <Input
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            placeholder="Escribe un comentario..."
            className="h-8 text-xs"
            disabled={crearComentario.isPending}
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 gap-1 px-3 text-xs"
            disabled={crearComentario.isPending}
          >
            {crearComentario.isPending ? (
              <Spinner className="size-3" />
            ) : (
              <HugeiconsIcon icon={Sent02Icon} size={14} />
            )}
            Comentar
          </Button>
        </form>
      )}
    </div>
  );
}
