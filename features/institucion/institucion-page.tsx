"use client";

import * as React from "react";
import { School01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { useInstitucionQuery, useUpdateInstitucionMutation, useUploadLogoMutation } from "./hooks";
import { InstitucionForm } from "./components/forms/institucion-form";
import type { UpdateInstitucionFormValues } from "./schemas";

export function InstitucionPage() {
  const { data: institucion, isLoading, isError, error, refetch } = useInstitucionQuery();

  const updateMutation = useUpdateInstitucionMutation();
  const uploadLogoMutation = useUploadLogoMutation();

  const handleSubmit = async (values: UpdateInstitucionFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
    } catch {
      // Error manejado en onError del mutation hook
    }
  };

  const handleUploadLogo = async (file: File) => {
    try {
      await uploadLogoMutation.mutateAsync(file);
    } catch {
      // Error manejado en onError del mutation hook
    }
  };

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Datos institucionales"
        description="Gestiona la información legal, canales de contacto y el logo oficial de la institución educativa."
        icon={School01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Configuración" },
          { label: "Institución" },
        ]}
      />

      <PageState
        isLoading={isLoading}
        isError={isError || (!institucion && !isLoading)}
        error={error}
        onRetry={() => refetch()}
        errorTitle="Error al cargar datos institucionales"
      >
        {institucion && (
          <InstitucionForm
            institucion={institucion}
            onSubmit={handleSubmit}
            onUploadLogo={handleUploadLogo}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </PageState>
    </div>
  );
}
