import { useQuery } from "@tanstack/react-query";
import { getDashboardResumen } from "../api/dashboard.api";
import type { DashboardFiltrosParams, DashboardResponse } from "../types/dashboard.types";

export const DASHBOARD_QUERY_KEY = ["dashboard", "resumen"] as const;

export function useDashboard(params?: DashboardFiltrosParams) {
  return useQuery<DashboardResponse>({
    queryKey: [...DASHBOARD_QUERY_KEY, params],
    queryFn: () => getDashboardResumen(params),
    staleTime: 1000 * 60 * 2, // 2 minutos para evitar refetches excesivos
    refetchOnWindowFocus: false,
  });
}
