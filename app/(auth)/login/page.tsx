import * as React from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Iniciar Sesión | I.E. Carmelitas",
  description: "Ingresa con tus credenciales institucionales.",
};

export default function LoginPage() {
  return <LoginForm />;
}
