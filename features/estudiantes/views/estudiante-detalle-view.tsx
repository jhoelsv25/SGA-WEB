"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Call02Icon,
  Copy01Icon,
  Hospital01Icon,
  IdIcon,
  Key01Icon,
  Location01Icon,
  Mail01Icon,
  PencilEdit01Icon,
  PrinterIcon,
  RefreshIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/common/user-avatar";
import { formatDate } from "@/lib/formatters/date";
import { HistorialCriticoModal } from "@/features/personas";
import { useEstudianteQuery } from "../hooks/use-estudiantes";
import { EditEstudianteModal } from "../components/modals/edit-estudiante-modal";
import { CredentialsModal } from "../components/modals/credentials-modal";
import { CarnetModal } from "../../credenciales/components/modals/carnet-modal";
import { ReemitirCredencialModal } from "../../credenciales/components/modals/reemitir-credencial-modal";
import { calcularEdad } from "../utils/edad.util";
import type { EstadoEstudiante } from "../types/estudiantes.types";
import type { CredencialResponse } from "../../credenciales/types/credenciales.types";

interface EstudianteDetalleViewProps {
  estudianteId: string;
}

const estadoBadges: Record<EstadoEstudiante, { label: string; className: string }> = {
  activo: {
    label: "Activo",
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  retirado: {
    label: "Retirado",
    className: "border-destructive/25 bg-destructive/10 text-destructive",
  },
  trasladado: {
    label: "Trasladado",
    className: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  egresado: {
    label: "Egresado",
    className: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
};

interface CampoDatoProps {
  label: string;
  valor?: React.ReactNode;
  vacio?: string;
  mono?: boolean;
  className?: string;
}

function CampoDato({
  label,
  valor,
  vacio = "Sin registrar",
  mono = false,
  className,
}: CampoDatoProps) {
  const tieneValor = valor !== null && valor !== undefined && valor !== "";
  return (
    <div className={className}>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd
        className={
          tieneValor
            ? `text-foreground mt-1 text-sm font-medium ${mono ? "font-mono" : ""}`
            : "text-muted-foreground/60 mt-1 text-sm italic"
        }
      >
        {tieneValor ? valor : vacio}
      </dd>
    </div>
  );
}

function copiarAlPortapapeles(texto: string, etiqueta: string) {
  void navigator.clipboard.writeText(texto);
  toast.success(`${etiqueta} copiado`, { description: texto });
}

export function EstudianteDetalleView({ estudianteId }: EstudianteDetalleViewProps) {
  const { data: estudiante, isLoading, isError, refetch } = useEstudianteQuery(estudianteId);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [carneModalOpen, setCarneModalOpen] = React.useState(false);
  const [reemitirModalOpen, setReemitirModalOpen] = React.useState(false);
  const [historialModalOpen, setHistorialModalOpen] = React.useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = React.useState(false);
  const [reemitidaData, setReemitidaData] = React.useState<{
    nombreCompleto: string;
    codigoSiagie: string;
    codigoCredencial: string;
    pin: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-52 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
        <div className="border-border/60 flex items-center gap-5 border-b pb-6">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2.5">
            <Skeleton className="h-7 w-72 rounded-md" />
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !estudiante) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-destructive text-base font-semibold">
          No se pudo cargar la información del estudiante.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/estudiantes">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1.5 size-4" />
              Volver al Padrón
            </Link>
          </Button>
          <Button onClick={() => void refetch()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  const p = estudiante.persona;
  const badge = estadoBadges[estudiante.estado] ?? estadoBadges.activo;
  const edad = calcularEdad(p.fechaNacimiento);

  const handleReemitirSuccess = (nuevaCred: CredencialResponse) => {
    setReemitidaData({
      nombreCompleto: p.nombreCompleto,
      codigoSiagie: estudiante.codigo,
      codigoCredencial: nuevaCred.codigo,
      pin: nuevaCred.pin || "----",
    });
    setCredentialsModalOpen(true);
    void refetch();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Barra superior: navegación + acciones */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <nav aria-label="Navegación" className="flex items-center gap-2 text-xs">
          <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 px-2 text-xs">
            <Link href="/admin/estudiantes">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              Padrón de Estudiantes
            </Link>
          </Button>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-muted-foreground font-medium">Expediente</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHistorialModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={ShieldCheckIcon} className="size-4" />
            Bitácora
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCarneModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={PrinterIcon} className="size-4" />
            Imprimir Carné
          </Button>
          <Button
            size="sm"
            onClick={() => setEditModalOpen(true)}
            className="gap-1.5 text-xs font-medium"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
            Editar Ficha
          </Button>
        </div>
      </div>

      {/* Cabecera editorial abierta (sin card) */}
      <header className="border-border/60 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={p.nombreCompleto}
            avatar={p.fotoUrl ?? undefined}
            className="ring-border/60 size-16 text-lg font-bold ring-2"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                {p.nombreCompleto}
              </h1>
              <Badge variant="outline" className={`font-semibold ${badge.className}`}>
                {badge.label}
              </Badge>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => copiarAlPortapapeles(estudiante.codigo, "Código SIAGIE")}
                className="text-primary bg-primary/10 hover:bg-primary/15 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono font-semibold transition-colors"
                title="Copiar código SIAGIE"
              >
                <span>SIAGIE {estudiante.codigo}</span>
                <HugeiconsIcon icon={Copy01Icon} className="size-3 opacity-75" />
              </button>

              <button
                type="button"
                onClick={() => copiarAlPortapapeles(p.numeroDocumento, "Número de documento")}
                className="hover:text-foreground inline-flex items-center gap-1 font-mono transition-colors"
                title="Copiar documento"
              >
                <span className="uppercase">{p.tipoDocumento}:</span>
                <strong className="text-foreground font-semibold">{p.numeroDocumento}</strong>
                <HugeiconsIcon icon={Copy01Icon} className="size-3 opacity-60" />
              </button>

              {p.sexo && (
                <>
                  <span className="text-border">•</span>
                  <span>{p.sexo === "F" ? "Femenino" : "Masculino"}</span>
                </>
              )}

              {p.fechaNacimiento && (
                <>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3.5 opacity-70" />
                    <span>
                      {edad !== null ? `${edad} años` : formatDate(p.fechaNacimiento, "dd/MM/yyyy")}
                    </span>
                    {edad !== null && (
                      <span className="font-mono opacity-75">
                        ({formatDate(p.fechaNacimiento, "dd/MM/yyyy")})
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal asimétrico: 2/3 secciones limpias + 1/3 panel operativo */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Columna izquierda: Expediente en secciones limpias sin cards */}
        <div className="space-y-8 lg:col-span-8">
          {/* 1. Identidad y Datos Personales */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={UserIcon} className="text-primary size-4" />
              <h2 className="text-foreground text-sm font-semibold tracking-tight">
                Identidad y Datos Personales
              </h2>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
              <CampoDato label="Apellido paterno" valor={p.apellidoPaterno} />
              <CampoDato label="Apellido materno" valor={p.apellidoMaterno} />
              <CampoDato label="Nombres" valor={p.nombres} />
              <CampoDato
                label="Documento de identidad"
                valor={`${p.tipoDocumento.toUpperCase()} · ${p.numeroDocumento}`}
                mono
              />
              <CampoDato
                label="Sexo"
                valor={p.sexo ? (p.sexo === "F" ? "Femenino" : "Masculino") : null}
              />
              <CampoDato
                label="Fecha de nacimiento"
                valor={
                  p.fechaNacimiento
                    ? `${formatDate(p.fechaNacimiento, "dd/MM/yyyy")}${edad !== null ? ` (${edad} años)` : ""}`
                    : null
                }
                mono
              />
            </dl>
          </section>

          <Separator className="bg-border/60" />

          {/* 2. Contacto y Residencia */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} className="text-primary size-4" />
              <h2 className="text-foreground text-sm font-semibold tracking-tight">
                Contacto y Residencia
              </h2>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
              <CampoDato
                label="Celular"
                valor={
                  p.celular ? (
                    <span className="inline-flex items-center gap-1.5">
                      <HugeiconsIcon icon={Call02Icon} className="text-muted-foreground size-3.5" />
                      {p.celular}
                    </span>
                  ) : null
                }
                mono
              />
              <CampoDato
                label="Correo electrónico"
                valor={
                  p.correo ? (
                    <span className="inline-flex items-center gap-1.5 break-all">
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        className="text-muted-foreground size-3.5 shrink-0"
                      />
                      {p.correo}
                    </span>
                  ) : null
                }
              />
              <CampoDato label="Distrito" valor={p.distrito} />
              <CampoDato
                label="Dirección domiciliaria"
                valor={p.direccion}
                className="sm:col-span-3"
              />
            </dl>
          </section>

          <Separator className="bg-border/60" />

          {/* 3. Ficha Escolar */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={IdIcon} className="text-primary size-4" />
              <h2 className="text-foreground text-sm font-semibold tracking-tight">
                Ficha Escolar
              </h2>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
              <CampoDato label="Código SIAGIE" valor={estudiante.codigo} mono />
              <CampoDato
                label="Fecha de ingreso"
                valor={
                  estudiante.fechaIngreso ? formatDate(estudiante.fechaIngreso, "dd/MM/yyyy") : null
                }
                mono
              />
              <CampoDato label="Cargo vigente" valor={estudiante.cargoVigente || "Estudiante"} />
              <CampoDato label="Lengua materna" valor={estudiante.lenguaMaterna || "Castellano"} />
              <CampoDato label="Religión" valor={estudiante.religion} />
            </dl>
          </section>

          <Separator className="bg-border/60" />

          {/* 4. Salud y Condiciones Médicas */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Hospital01Icon} className="text-primary size-4" />
                <h2 className="text-foreground text-sm font-semibold tracking-tight">
                  Salud y Condiciones Médicas
                </h2>
              </div>

              {estudiante.tieneDiscapacidad ? (
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-700 dark:text-amber-300"
                >
                  Discapacidad registrada
                </Badge>
              ) : (
                <span className="text-muted-foreground text-xs">Sin discapacidad registrada</span>
              )}
            </div>

            {estudiante.tieneDiscapacidad && estudiante.detalleDiscapacidad && (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-xs text-amber-800 dark:text-amber-200">
                <span className="font-semibold">Detalle de discapacidad: </span>
                {estudiante.detalleDiscapacidad}
              </div>
            )}

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <CampoDato label="Grupo sanguíneo" valor={estudiante.grupoSanguineo} />
              <CampoDato label="Seguro de salud" valor={estudiante.seguroSalud} />
              <CampoDato
                label="Alergias conocidas"
                valor={estudiante.alergias}
                vacio="Ninguna registrada"
              />
              <CampoDato
                label="Condiciones médicas"
                valor={estudiante.condicionesMedicas}
                vacio="Ninguna registrada"
              />
            </dl>
          </section>
        </div>

        {/* Columna derecha: único contenedor sutil para operación (Credencial y Cuenta) */}
        <aside className="lg:col-span-4">
          <div className="border-border/60 bg-muted/20 sticky top-6 space-y-6 rounded-2xl border p-5">
            {/* Credencial de Marcación */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                  <HugeiconsIcon icon={IdIcon} className="text-primary size-3.5" />
                  Credencial Escolar
                </span>
                <Badge
                  variant="outline"
                  className={
                    estudiante.credencial?.activa
                      ? "border-emerald-500/25 bg-emerald-500/10 text-[11px] text-emerald-600 dark:text-emerald-400"
                      : "border-muted text-muted-foreground text-[11px]"
                  }
                >
                  {estudiante.credencial?.activa ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground font-mono text-sm font-bold">
                  {estudiante.credencial?.codigo || "Sin credencial"}
                </span>
                {estudiante.credencial?.codigo && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() =>
                      copiarAlPortapapeles(estudiante.credencial!.codigo, "Código de credencial")
                    }
                    title="Copiar código de credencial"
                  >
                    <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCarneModalOpen(true)}
                  className="h-8 gap-1.5 text-xs"
                >
                  <HugeiconsIcon icon={PrinterIcon} className="size-3.5" />
                  Ver QR
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReemitirModalOpen(true)}
                  className="h-8 gap-1.5 text-xs"
                >
                  <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
                  Reemitir
                </Button>
              </div>
            </div>

            <Separator className="bg-border/60" />

            {/* Cuenta Digital */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                  <HugeiconsIcon icon={Key01Icon} className="text-primary size-3.5" />
                  Aula Virtual
                </span>
                <span className="text-muted-foreground text-[11px] capitalize">
                  {estudiante.usuario?.estado || "Sin cuenta"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Usuario</span>
                  <span className="text-foreground font-mono text-sm font-semibold">
                    {estudiante.usuario?.nombreUsuario || "Sin acceso"}
                  </span>
                </div>
                {estudiante.usuario?.nombreUsuario && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() =>
                      copiarAlPortapapeles(estudiante.usuario!.nombreUsuario, "Usuario")
                    }
                    title="Copiar usuario"
                  >
                    <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>

            <Separator className="bg-border/60" />

            {/* Auditoría rápida */}
            <div className="text-muted-foreground space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span>Inscrito en padrón</span>
                <span className="font-mono">
                  {formatDate(estudiante.creadoEn, "dd/MM/yyyy HH:mm")}
                </span>
              </div>
              {estudiante.actualizadoEn && (
                <div className="flex items-center justify-between">
                  <span>Última actualización</span>
                  <span className="font-mono">
                    {formatDate(estudiante.actualizadoEn, "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Modales integrados */}
      <EditEstudianteModal
        estudiante={estudiante}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <CarnetModal
        open={carneModalOpen}
        onOpenChange={setCarneModalOpen}
        personaId={estudiante.personaId}
      />

      <ReemitirCredencialModal
        personaId={estudiante.personaId}
        nombreCompleto={p.nombreCompleto}
        codigoActual={estudiante.credencial?.codigo}
        open={reemitirModalOpen}
        onOpenChange={setReemitirModalOpen}
        onSuccess={handleReemitirSuccess}
      />

      {reemitidaData && (
        <CredentialsModal
          open={credentialsModalOpen}
          onOpenChange={setCredentialsModalOpen}
          nombreCompleto={reemitidaData.nombreCompleto}
          codigoSiagie={reemitidaData.codigoSiagie}
          nombreUsuario={estudiante.usuario?.nombreUsuario || reemitidaData.codigoSiagie}
          codigoCredencial={reemitidaData.codigoCredencial}
          pin={reemitidaData.pin}
        />
      )}

      <HistorialCriticoModal
        persona={p}
        open={historialModalOpen}
        onOpenChange={setHistorialModalOpen}
      />
    </div>
  );
}
