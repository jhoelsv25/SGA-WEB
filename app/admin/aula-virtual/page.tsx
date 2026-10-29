import type { Metadata } from "next";
import { AulaVirtualPage } from "@/features/aula-virtual";

export const metadata: Metadata = {
  title: "Aula virtual | SGA",
  description: "Unidades y materiales de reforzamiento del curso.",
};

interface PageProps {
  searchParams: Promise<{
    cursoSeccionId?: string | string[];
    tab?: string | string[];
    tareaId?: string | string[];
  }>;
}

export default async function AulaVirtualRoute({ searchParams }: PageProps) {
  const { cursoSeccionId, tab, tareaId } = await searchParams;
  return (
    <AulaVirtualPage
      cursoSeccionId={typeof cursoSeccionId === "string" ? cursoSeccionId : undefined}
      initialTab={typeof tab === "string" ? tab : undefined}
      initialTareaId={typeof tareaId === "string" ? tareaId : undefined}
    />
  );
}
