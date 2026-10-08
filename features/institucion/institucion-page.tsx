"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { School01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { useInstitucionQuery, useUpdateInstitucionMutation, useUploadLogoMutation } from "./hooks";
import { InstitucionForm } from "./components/forms/institucion-form";
import type { UpdateInstitucionFormValues } from "./schemas";

export function InstitucionPage() {
  const { data: institucion, isLoading, isError, error, refetch } = useInstitucionQuery();

  const updateMutation = useUpdateInstitucionMutation();
  const uploadLogoMutation = useUploadLogoMutation();

  const handleSubmit = async (values: UpdateInstitucionFormValues) => {
    await updateMutation.mutateAsync(values);
  };

  const handleUploadLogo = async (file: File) => {
    await uploadLogoMutation.mutateAsync(file);
  };

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Datos Institucionales"
        description="Gestiona la información legal, canales de contacto y el logo oficial de la institución educativa."
        icon={School01Icon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Configuración" },
          { label: "Institución" },
        ]}
      />

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Spinner className="text-primary h-8 w-8" />
          <p className="text-muted-foreground text-xs">Cargando datos institucionales...</p>
        </div>
      ) : isError || !institucion ? (
        <div className="border-destructive/20 bg-destructive/5 flex h-64 flex-col items-center justify-center gap-4 rounded-xl border p-8 text-center">
          <HugeiconsIcon icon={AlertCircleIcon} className="text-destructive h-10 w-10" />
          <div className="space-y-1">
            <h3 className="text-destructive text-sm font-semibold">
              Error al cargar datos institucionales
            </h3>
            <p className="text-muted-foreground text-xs">
              {(error as Error)?.message ||
                "No se pudo obtener la configuración de la institución."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : (
        <InstitucionForm
          institucion={institucion}
          onSubmit={handleSubmit}
          onUploadLogo={handleUploadLogo}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
