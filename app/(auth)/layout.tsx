import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | I.E. Carmelitas",
  description:
    "Portal de Acceso Institucional para la Institución Educativa Carmelitas de Lircay, Huancavelica.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col justify-center">
      {children}
    </div>
  );
}
