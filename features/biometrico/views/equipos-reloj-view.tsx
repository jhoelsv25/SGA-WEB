"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/features/auth";
import { EquiposAccesoTable } from "@/features/equipos-acceso";

export function EquiposRelojView() {
  const { data: sesion } = useSession();
  const roles = sesion?.user?.roles ?? [];
  // Mismos roles que exige la API en /equipos-acceso
  const puedeAprobarEquipos = ["Administrador", "Soporte TI"].some(
    (rol) => sesion?.user?.activeRoleName === rol || roles.includes(rol),
  );

  if (!puedeAprobarEquipos) {
    return (
      <p className="text-muted-foreground text-sm">
        Solo el Administrador y Soporte TI pueden aprobar los equipos del reloj.
      </p>
    );
  }

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 border-b pb-4">
        <CardTitle className="text-base font-bold">Equipos del programa del reloj</CardTitle>
        <CardDescription className="text-xs">
          Cuando el programa del reloj se conecta por primera vez desde una computadora, la
          solicitud queda <strong>pendiente</strong> y no envía marcas hasta que un administrador la
          autorice aquí.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <EquiposAccesoTable />
      </CardContent>
    </Card>
  );
}
