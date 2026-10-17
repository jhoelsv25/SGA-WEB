import type { Metadata } from "next";
import { MisLibretasPage } from "@/features/libretas";

export const metadata: Metadata = {
  title: "Mis libretas | SGA",
  description: "Libretas oficiales del SIAGIE publicadas para el estudiante y su familia",
};

export default function MisLibretasRoute() {
  return <MisLibretasPage />;
}
