import { Metadata } from "next";
import { ApoderadosPage } from "@/features/apoderados";

export const metadata: Metadata = {
  title: "Padrón de Apoderados | SGA",
  description:
    "Ficha de apoderados, vínculos familiares y responsabilidades escolares según RF-007 V3.",
};

export default function ApoderadosRoute() {
  return <ApoderadosPage />;
}
