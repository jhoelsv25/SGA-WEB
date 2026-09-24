import * as React from "react";
import type { Metadata } from "next";
import { RecoverForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | I.E. Carmelitas",
  description:
    "Recupera el acceso a tu cuenta mediante tu código o usuario institucional y fecha de nacimiento.",
};

export default function RecoverPage() {
  return <RecoverForm />;
}
