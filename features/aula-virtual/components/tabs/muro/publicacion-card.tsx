"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Attachment01Icon,
  Cancel01Icon,
  Comment01Icon,
  Download01Icon,
  FileEditIcon,
  Link01Icon,
  Pin02Icon,
  PinOffIcon,
  ShieldAlertIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { Spinner } from "@/components/common/spinner";
import { toast } from "@/lib/toast";
import { urlDeArchivo } from "../../../api";
import { MENSAJES_VALIDACION } from "../../../consts";
import { sePuedeEditar, esTamanoValido, formatearFechaHora } from "../../../utils";
import { useEditarPublicacionMuro, useFijarPublicacionMuro } from "../../../hooks";
import type { PublicacionMuro } from "../../../types";
import type { OcultarContenidoTarget } from "../../modals/ocultar-contenido-modal";
import { ComentariosSeccion } from "./comentarios-seccion";

interface PublicacionCardProps {
  pub: PublicacionMuro;
  cursoSeccionId: string;
  puedeAdministrar: boolean;
  anioCerrado: boolean;
  usuarioActualId?: string;
  onOcultar: (target: OcultarContenidoTarget) => void;
}

export function PublicacionCard({
  pub,
  cursoSeccionId,
  puedeAdministrar,
  anioCerrado,
  usuarioActualId,
  onOcultar,
}: PublicacionCardProps) {
  const [expandirComentarios, setExpandirComentarios] = React.useState(false);
  const [estaEditando, setEstaEditando] = React.useState(false);
  const [textoEditado, setTextoEditado] = React.useState(pub.contenido);
  const [archivoEditado, setArchivoEditado] = React.useState<File | null>(null);
  const [enlaceEditado, setEnlaceEditado] = React.useState("");
  const [mostrarEnlace, setMostrarEnlace] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const fijar = useFijarPublicacionMuro(cursoSeccionId);
  const editar = useEditarPublicacionMuro(cursoSeccionId);

  const esAutor = Boolean(usuarioActualId && pub.autorId === usuarioActualId);
  const plazoValido = sePuedeEditar(pub.creadoEn);
  const puedeEditar = esAutor && !anioCerrado && plazoValido;

  const handleIniciarEdicion = () => {
    if (!sePuedeEditar(pub.creadoEn)) {
      toast.error(MENSAJES_VALIDACION.EDICION_FUERA_DE_PLAZO);
      return;
    }
    setTextoEditado(pub.contenido);
    setArchivoEditado(null);
    setEnlaceEditado("");
    setMostrarEnlace(false);
    setEstaEditando(true);
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!esTamanoValido(file)) {
      toast.error(MENSAJES_VALIDACION.ADJUNTO_PESADO);
      e.target.value = "";
      return;
    }
    setArchivoEditado(file);
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sePuedeEditar(pub.creadoEn)) {
      toast.error(MENSAJES_VALIDACION.EDICION_FUERA_DE_PLAZO);
      setEstaEditando(false);
      return;
    }
    const texto = textoEditado.trim();
    const enlace = enlaceEditado.trim();
    if (!texto && !archivoEditado && !enlace && !pub.adjuntoUrl) {
      toast.error(MENSAJES_VALIDACION.VACIO);
      return;
    }

    editar.mutate(
      {
        id: pub.id,
        payload: {
          contenido: texto,
          enlaceAdjunto: enlace || undefined,
        },
        archivo: archivoEditado,
      },
      {
        onSuccess: () => {
          setEstaEditando(false);
          setArchivoEditado(null);
          setEnlaceEditado("");
        },
      },
    );
  };

  const handleToggleFijar = () => {
    if (!puedeAdministrar) return;
    fijar.mutate({ id: pub.id, fijada: !pub.fijada });
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        pub.fijada
          ? "border-primary/50 bg-primary/[0.03] shadow-xs"
          : "border-border bg-card shadow-2xs"
      }`}
    >
      {/* Banner de fijado */}
      {pub.fijada && (
        <div className="text-primary mb-3 flex items-center gap-1.5 text-xs font-semibold">
          <HugeiconsIcon icon={Pin02Icon} size={15} />
          <span>Fijada por el docente</span>
        </div>
      )}

      {/* Cabecera del post */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <UserAvatar name={pub.autorNombre} className="size-9" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">{pub.autorNombre}</span>
              {pub.autorRol && (
                <StatusBadge
                  tone={pub.autorRol === "docente" ? "brand" : "neutral"}
                  className="text-xs"
                >
                  {pub.autorRol === "docente" ? "Docente" : "Estudiante"}
                </StatusBadge>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatearFechaHora(pub.creadoEn)}
              {pub.actualizadoEn && pub.actualizadoEn !== pub.creadoEn && " · (editado)"}
            </p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-1.5">
          {puedeAdministrar && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs"
              onClick={handleToggleFijar}
              disabled={fijar.isPending}
            >
              <HugeiconsIcon
                icon={pub.fijada ? PinOffIcon : Pin02Icon}
                size={14}
                className={pub.fijada ? "text-primary" : ""}
              />
              {pub.fijada ? "Desfijar" : "Fijar"}
            </Button>
          )}

          {esAutor && !estaEditando && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 gap-1 px-2.5 text-xs"
              disabled={!puedeEditar}
              onClick={handleIniciarEdicion}
            >
              <HugeiconsIcon icon={FileEditIcon} size={14} />
              Editar
            </Button>
          )}

          {puedeAdministrar && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 h-8 gap-1 px-2 text-xs"
              onClick={() =>
                onOcultar({
                  tipo: "publicacion",
                  id: pub.id,
                  descripcion: pub.contenido || "Publicación con adjunto",
                })
              }
            >
              <HugeiconsIcon icon={ShieldAlertIcon} size={14} />
              Ocultar
            </Button>
          )}
        </div>
      </div>

      {/* Contenido / Edición */}
      {estaEditando ? (
        <form onSubmit={handleGuardarEdicion} className="mt-3 space-y-3">
          <Textarea
            value={textoEditado}
            onChange={(e) => setTextoEditado(e.target.value)}
            rows={3}
            className="text-sm"
            disabled={editar.isPending}
          />

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
              disabled={editar.isPending}
            >
              <HugeiconsIcon icon={Attachment01Icon} size={14} />
              {archivoEditado ? archivoEditado.name : "Cambiar / agregar archivo"}
            </Button>

            {archivoEditado && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive h-8 px-2 text-xs"
                onClick={() => setArchivoEditado(null)}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => setMostrarEnlace(!mostrarEnlace)}
            >
              <HugeiconsIcon icon={Link01Icon} size={14} />
              Enlace
            </Button>
          </div>

          {mostrarEnlace && (
            <Input
              type="url"
              placeholder="https://..."
              value={enlaceEditado}
              onChange={(e) => setEnlaceEditado(e.target.value)}
              className="h-8 text-xs"
            />
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setEstaEditando(false)}
              disabled={editar.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              disabled={editar.isPending}
            >
              {editar.isPending && <Spinner className="size-3" />}
              Guardar cambios
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-3 space-y-3">
          {pub.contenido ? (
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {pub.contenido}
            </p>
          ) : null}

          {pub.adjuntoUrl && (
            <div className="bg-muted/40 flex items-center gap-2 rounded-lg border p-2.5 text-sm">
              <HugeiconsIcon icon={Attachment01Icon} size={18} className="text-primary shrink-0" />
              <div className="min-w-0 flex-1 truncate text-xs font-medium">
                {pub.adjuntoUrl.split("/").pop() || "Archivo adjunto"}
              </div>
              <Button asChild variant="outline" size="sm" className="h-7 gap-1 px-2.5 text-xs">
                <a href={urlDeArchivo(pub.adjuntoUrl)} target="_blank" rel="noreferrer">
                  <HugeiconsIcon icon={Download01Icon} size={13} />
                  Descargar
                </a>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Barra de comentarios */}
      <div className="mt-4 flex items-center justify-between border-t pt-2 text-xs">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-7 gap-1.5 px-2"
          onClick={() => setExpandirComentarios(!expandirComentarios)}
        >
          <HugeiconsIcon icon={Comment01Icon} size={14} />
          <span>
            {expandirComentarios
              ? "Ocultar comentarios"
              : `Comentarios (${pub.comentariosCount ?? 0})`}
          </span>
        </Button>
      </div>

      {/* Sección desplegable de comentarios */}
      {expandirComentarios && (
        <ComentariosSeccion
          publicacionId={pub.id}
          cursoSeccionId={cursoSeccionId}
          puedeAdministrar={puedeAdministrar}
          anioCerrado={anioCerrado}
          usuarioActualId={usuarioActualId}
          onOcultar={onOcultar}
        />
      )}
    </div>
  );
}
