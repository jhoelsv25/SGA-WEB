import { useSession } from "@/features/auth";

/** RF-007: solo Soporte TI cambia el PIN de marcación (la API exige el mismo rol). */
export function usePuedeCambiarPin(): boolean {
  const { data: sesion } = useSession();
  return sesion?.user?.activeRoleName === "Soporte TI";
}
