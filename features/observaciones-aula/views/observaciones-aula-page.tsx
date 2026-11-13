"use client";

import * as React from "react";
import { Task01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModalProgramar } from "../components";
import { TabCronograma } from "./tab-cronograma";
import { TabHistorial } from "./tab-historial";
import { TabInstrumento } from "./tab-instrumento";
import { TabMatriz } from "./tab-matriz";
import { TabObservaciones } from "./tab-observaciones";
import { TabSeguimientos } from "./tab-seguimientos";

export function ObservacionesAulaPage() {
  const [programar, setProgramar] = React.useState<{ docenteId?: string } | null>(null);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Observaciones de aula"
        description="Cronograma de visitas, toma de notas, calificación por niveles y retroalimentación."
        icon={Task01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Observaciones de aula" },
        ]}
        actions={
          <Button type="button" className="min-h-10" onClick={() => setProgramar({})}>
            Programar observación
          </Button>
        }
      />
      <Tabs defaultValue="cronograma" className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
          <TabsTrigger value="observaciones">Observaciones</TabsTrigger>
          <TabsTrigger value="seguimientos">Seguimientos</TabsTrigger>
          <TabsTrigger value="matriz">Matriz</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="instrumento">Instrumento</TabsTrigger>
        </TabsList>
        <TabsContent value="cronograma">
          <TabCronograma onProgramar={(docenteId) => setProgramar({ docenteId })} />
        </TabsContent>
        <TabsContent value="observaciones">
          <TabObservaciones />
        </TabsContent>
        <TabsContent value="seguimientos">
          <TabSeguimientos />
        </TabsContent>
        <TabsContent value="matriz">
          <TabMatriz />
        </TabsContent>
        <TabsContent value="historial">
          <TabHistorial />
        </TabsContent>
        <TabsContent value="instrumento">
          <TabInstrumento />
        </TabsContent>
      </Tabs>
      <ModalProgramar
        abierto={programar !== null}
        docenteInicial={programar?.docenteId}
        onOpenChange={(abierto) => !abierto && setProgramar(null)}
      />
    </div>
  );
}
