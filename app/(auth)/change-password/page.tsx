import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { AuthPageShell, CerrarSesionEnlace, ChangePasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Cambiar Contraseña",
  description: `Actualización de contraseña institucional en ${siteConfig.institution.shortName}.`,
  alternates: {
    canonical: siteConfig.routes.changePassword,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChangePasswordPage() {
  return (
    <AuthPageShell
      topBarLeft={<CerrarSesionEnlace />}
      badge={`Seguridad · ${siteConfig.institution.badge}`}
      title="Cambiar contraseña"
      description="Por tu seguridad, actualiza tu contraseña para continuar en el sistema."
      supportText={`¿Tienes dudas con tu contraseña? Soporte: ${siteConfig.institution.contact.supportEmail}`}
    >
      <ChangePasswordForm />
    </AuthPageShell>
  );
}
