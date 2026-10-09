import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { AuthPageShell, LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: `Acceso seguro a la plataforma del ${siteConfig.name} para estudiantes, docentes y directivos de la ${siteConfig.institution.shortName}.`,
  alternates: {
    canonical: siteConfig.routes.login,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <AuthPageShell
      backHref={siteConfig.routes.home}
      backLabel="Volver al portal"
      backHideOnLg
      topBarCenter={`${siteConfig.acronym} · Acceso institucional`}
      title="Inicia sesión"
      description="Ingresa tus credenciales institucionales para continuar."
      supportText={`¿Necesitas ayuda? Central de soporte: ${siteConfig.institution.contact.schedule}`}
    >
      <LoginForm />
    </AuthPageShell>
  );
}
