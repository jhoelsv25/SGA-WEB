"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { resolveBackendUrl } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  CheckmarkCircle02Icon,
  ImageUploadIcon,
  Location01Icon,
  Mail01Icon,
  School01Icon,
  UserCheck01Icon,
  CallIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { StatusBadge } from "@/components/common/status-badge";
import { FileDropzone } from "@/components/common/file-dropzone";
import { toast } from "@/lib/toast";
import { updateInstitucionSchema, type UpdateInstitucionFormValues } from "../../schemas";
import type { Institucion } from "../../types";

const TIPO_GESTION_OPTIONS = [
  { value: "publica", label: "Pública (Estatal)" },
  { value: "privada", label: "Privada (Particular)" },
  { value: "convenio", label: "Convenio" },
];

interface InstitucionFormProps {
  institucion: Institucion;
  onSubmit: (values: UpdateInstitucionFormValues) => Promise<void>;
  onUploadLogo: (file: File) => Promise<void>;
  isSubmitting?: boolean;
}

export function InstitucionForm({
  institucion,
  onSubmit,
  onUploadLogo,
  isSubmitting = false,
}: InstitucionFormProps) {
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [logoError, setLogoError] = React.useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateInstitucionFormValues>({
    resolver: zodResolver(updateInstitucionSchema),
    defaultValues: {
      nombre: institucion.nombre || "",
      codigoModular: institucion.codigoModular || "",
      codigoLocal: institucion.codigoLocal || "",
      tipoGestion: institucion.tipoGestion || "publica",
      ugelDre: institucion.ugelDre || "",
      director: institucion.director || "",
      direccion: institucion.direccion || "",
      departamento: institucion.departamento || "",
      provincia: institucion.provincia || "",
      distrito: institucion.distrito || "",
      telefono: institucion.telefono || "",
      correo: institucion.correo || "",
      logoUrl: institucion.logoUrl || "",
    },
  });

  // Sincronizar formulario si cambia la entidad
  React.useEffect(() => {
    reset({
      nombre: institucion.nombre || "",
      codigoModular: institucion.codigoModular || "",
      codigoLocal: institucion.codigoLocal || "",
      tipoGestion: institucion.tipoGestion || "publica",
      ugelDre: institucion.ugelDre || "",
      director: institucion.director || "",
      direccion: institucion.direccion || "",
      departamento: institucion.departamento || "",
      provincia: institucion.provincia || "",
      distrito: institucion.distrito || "",
      telefono: institucion.telefono || "",
      correo: institucion.correo || "",
      logoUrl: institucion.logoUrl || "",
    });
  }, [institucion, reset]);

  const handleFileSelect = async (file: File | null) => {
    setLogoFile(file);
    setLogoError(undefined);

    if (!file) return;

    // Validación Gherkin: PNG o JPG de hasta 1 MB
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setLogoError("El logo debe ser una imagen PNG o JPG de hasta 1 MB.");
      toast.error("El logo debe ser una imagen PNG o JPG de hasta 1 MB.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setLogoError("El logo debe ser una imagen PNG o JPG de hasta 1 MB.");
      toast.error("El logo debe ser una imagen PNG o JPG de hasta 1 MB.");
      return;
    }

    try {
      setIsUploadingLogo(true);
      await onUploadLogo(file);
      setLogoFile(null);
    } catch {
      // El hook ya maneja el toast de error
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const logoDisplayUrl = institucion.logoUrl ? resolveBackendUrl(institucion.logoUrl) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Logo y Resumen */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <HugeiconsIcon icon={ImageUploadIcon} className="text-primary h-5 w-5" />
                Logo institucional
              </CardTitle>
              <CardDescription>
                Aparece en la cabecera, documentos oficiales y reportes del colegio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vista previa del logo */}
              <div className="bg-muted/40 border-border/70 flex flex-col items-center justify-center rounded-xl border border-dashed p-4">
                {logoDisplayUrl ? (
                  <div className="bg-background relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border p-2 shadow-xs">
                    <Image
                      src={logoDisplayUrl}
                      alt={`Logo de ${institucion.nombre}`}
                      width={128}
                      height={128}
                      className="max-h-full max-w-full object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="bg-muted/70 text-muted-foreground flex h-32 w-32 flex-col items-center justify-center rounded-lg border">
                    <HugeiconsIcon icon={School01Icon} className="h-12 w-12 stroke-[1.5]" />
                    <span className="mt-2 text-xs font-medium">Sin logo oficial</span>
                  </div>
                )}
                <p className="text-muted-foreground mt-3 text-center text-xs font-medium">
                  {institucion.nombre}
                </p>
              </div>

              {/* File Dropzone */}
              <div className="space-y-2">
                <FileDropzone
                  file={logoFile}
                  onFileSelect={handleFileSelect}
                  accept="image/png, image/jpeg, image/jpg"
                  acceptedFormats={["PNG", "JPG"]}
                  maxSizeBytes={1024 * 1024}
                  title="Cambiar logo"
                  description="Arrastra o selecciona PNG o JPG (máx. 1 MB)"
                  disabled={isUploadingLogo || isSubmitting}
                  error={logoError}
                />
                {isUploadingLogo && (
                  <div className="text-primary flex items-center justify-center gap-2 py-2 text-xs font-medium">
                    <Spinner className="h-4 w-4" />
                    Subiendo y procesando logo...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información rápida */}
          <Card className="border-border/60 bg-muted/20 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <HugeiconsIcon icon={Building03Icon} className="text-muted-foreground h-4 w-4" />
                Resumen de identificación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="border-border/40 flex justify-between border-b py-1">
                <span className="text-muted-foreground">Cód. Modular:</span>
                <span className="text-foreground font-semibold">{institucion.codigoModular}</span>
              </div>
              <div className="border-border/40 flex justify-between border-b py-1">
                <span className="text-muted-foreground">Gestión:</span>
                <span className="text-foreground font-semibold capitalize">
                  {institucion.tipoGestion}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Estado:</span>
                <StatusBadge tone="success" dot size="sm">
                  Operativo
                </StatusBadge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Formulario Completo */}
        <div className="space-y-6 lg:col-span-2">
          {/* Sección 1: Datos de Identidad Institucional */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <HugeiconsIcon icon={School01Icon} className="text-primary h-5 w-5" />
                Datos de la institución
              </CardTitle>
              <CardDescription>
                Información básica y registro modular ante el Ministerio de Educación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="nombre" className="text-xs font-semibold">
                    Nombre de la institución <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Ej. I.E. Nuestra Señora de las Mercedes"
                    {...register("nombre")}
                    disabled={isSubmitting}
                  />
                  {errors.nombre && (
                    <p className="text-destructive text-xs">{errors.nombre.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="codigoModular" className="text-xs font-semibold">
                    Código modular <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="codigoModular"
                    placeholder="Ej. 0456789"
                    {...register("codigoModular")}
                    disabled={isSubmitting}
                  />
                  {errors.codigoModular && (
                    <p className="text-destructive text-xs">{errors.codigoModular.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="codigoLocal" className="text-xs font-semibold">
                    Código de local (Opcional)
                  </Label>
                  <Input
                    id="codigoLocal"
                    placeholder="Ej. 123456"
                    {...register("codigoLocal")}
                    disabled={isSubmitting}
                  />
                  {errors.codigoLocal && (
                    <p className="text-destructive text-xs">{errors.codigoLocal.message}</p>
                  )}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="tipoGestion" className="text-xs font-semibold">
                    Tipo de gestión <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="tipoGestion"
                    render={({ field }) => (
                      <SelectOption
                        value={field.value}
                        onSelect={field.onChange}
                        options={TIPO_GESTION_OPTIONS}
                        placeholder="Seleccione tipo de gestión"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                  {errors.tipoGestion && (
                    <p className="text-destructive text-xs">{errors.tipoGestion.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección 2: Dirección y Ubicación */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <HugeiconsIcon icon={Location01Icon} className="text-primary h-5 w-5" />
                Ubicación geográfica
              </CardTitle>
              <CardDescription>
                Domicilio legal y jurisdicción administrativa de la institución educativa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="direccion" className="text-xs font-semibold">
                  Dirección <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="direccion"
                  placeholder="Ej. Jr. Los Rosales 450, Barrio Centro"
                  {...register("direccion")}
                  disabled={isSubmitting}
                />
                {errors.direccion && (
                  <p className="text-destructive text-xs">{errors.direccion.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="departamento" className="text-xs font-semibold">
                    Departamento (Opcional)
                  </Label>
                  <Input
                    id="departamento"
                    placeholder="Ej. Huancavelica"
                    {...register("departamento")}
                    disabled={isSubmitting}
                  />
                  {errors.departamento && (
                    <p className="text-destructive text-xs">{errors.departamento.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="provincia" className="text-xs font-semibold">
                    Provincia (Opcional)
                  </Label>
                  <Input
                    id="provincia"
                    placeholder="Ej. Angaraes"
                    {...register("provincia")}
                    disabled={isSubmitting}
                  />
                  {errors.provincia && (
                    <p className="text-destructive text-xs">{errors.provincia.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="distrito" className="text-xs font-semibold">
                    Distrito (Opcional)
                  </Label>
                  <Input
                    id="distrito"
                    placeholder="Ej. Lircay"
                    {...register("distrito")}
                    disabled={isSubmitting}
                  />
                  {errors.distrito && (
                    <p className="text-destructive text-xs">{errors.distrito.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección 3: Autoridad y Canales de Contacto */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <HugeiconsIcon icon={UserCheck01Icon} className="text-primary h-5 w-5" />
                Autoridad y canales de contacto
              </CardTitle>
              <CardDescription>
                Representante legal que firma los reportes y medios de comunicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="director" className="text-xs font-semibold">
                    Director (nombre para reportes) (Opcional)
                  </Label>
                  <Input
                    id="director"
                    placeholder="Ej. Mg. Juan Pérez Rodríguez"
                    {...register("director")}
                    disabled={isSubmitting}
                  />
                  {errors.director && (
                    <p className="text-destructive text-xs">{errors.director.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ugelDre" className="text-xs font-semibold">
                    UGEL / DRE (Opcional)
                  </Label>
                  <Input
                    id="ugelDre"
                    placeholder="Ej. UGEL Angaraes / DRE Huancavelica"
                    {...register("ugelDre")}
                    disabled={isSubmitting}
                  />
                  {errors.ugelDre && (
                    <p className="text-destructive text-xs">{errors.ugelDre.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="telefono"
                    className="flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <HugeiconsIcon icon={CallIcon} className="text-muted-foreground h-3.5 w-3.5" />
                    Teléfono (Opcional)
                  </Label>
                  <Input
                    id="telefono"
                    placeholder="Ej. 067-456789 o 987654321"
                    {...register("telefono")}
                    disabled={isSubmitting}
                  />
                  {errors.telefono && (
                    <p className="text-destructive text-xs">{errors.telefono.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="correo"
                    className="flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      className="text-muted-foreground h-3.5 w-3.5"
                    />
                    Correo electrónico institucional (Opcional)
                  </Label>
                  <Input
                    id="correo"
                    type="email"
                    placeholder="Ej. contacto@colegio.edu.pe"
                    {...register("correo")}
                    disabled={isSubmitting}
                  />
                  {errors.correo && (
                    <p className="text-destructive text-xs">{errors.correo.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
            >
              {isSubmitting ? (
                <Spinner className="size-3.5" />
              ) : (
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
              )}
              <span>Guardar datos</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
