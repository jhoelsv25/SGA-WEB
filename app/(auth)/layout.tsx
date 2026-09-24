import * as React from "react";
import type { Metadata } from "next";
import { AuthSlider } from "@/features/auth";

export const metadata: Metadata = {
  title: "Acceso Institucional | I.E. Carmelitas",
  description:
    "Portal de Acceso Institucional para la Institución Educativa Carmelitas de Lircay, Huancavelica.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background text-foreground grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-12">
      {/* Panel Izquierdo Persistente: Slider con Motion y Arte Institucional */}
      <section className="relative hidden lg:col-span-7 lg:flex">
        <AuthSlider />
      </section>

      {/* Panel Derecho Dinámico: Login, Recover u otros flujos de autenticación */}
      <section className="border-border/50 bg-background flex flex-col justify-center border-l shadow-xs lg:col-span-5">
        {children}
      </section>
    </main>
  );
}
