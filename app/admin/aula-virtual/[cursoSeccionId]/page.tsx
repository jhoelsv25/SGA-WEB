import type { Metadata } from "next";
import { AulaVirtualPage } from "@/features/aula-virtual";

export const metadata: Metadata = {
  title: "Aula virtual | SGA",
  description: "Unidades y materiales de reforzamiento del curso.",
};

interface PageProps {
  params: Promise<{ cursoSeccionId: string }>;
  searchParams: Promise<{
    tab?: string | string[];
    tareaId?: string | string[];
  }>;
}

export default async function AulaVirtualCursoRoute({ params, searchParams }: PageProps) {
  const { cursoSeccionId } = await params;
  const { tab, tareaId } = await searchParams;
  return (
    <AulaVirtualPage
      cursoSeccionId={cursoSeccionId}
      initialTab={typeof tab === "string" ? tab : undefined}
      initialTareaId={typeof tareaId === "string" ? tareaId : undefined}
    />
  );
}
