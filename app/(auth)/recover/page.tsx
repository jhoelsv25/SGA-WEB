import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { AuthPageShell, RecoverForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Recuperar Acceso",
  description: `Recuperación segura de contraseña institucional mediante código y fecha de nacimiento en ${siteConfig.institution.shortName}.`,
  alternates: {
    canonical: siteConfig.routes.recover,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecoverPage() {
  return (
    <AuthPageShell
      backHref={siteConfig.routes.login}
      backLabel="Volver al inicio de sesión"
      title="Recuperar acceso"
      description="Valida tu identidad institucional con tu código y fecha de nacimiento."
      supportText="¿Problemas para acceder? Comunícate con la secretaría del colegio."
    >
      <RecoverForm />
    </AuthPageShell>
  );
}
