"use client";

import { useQuery } from "@tanstack/react-query";
import { auditApi } from "../api/audit.api";
import type { AuditDetail, PaginatedAuditResponse, QueryAuditParams } from "../types/audit.types";
import type { ApiClientError } from "@/lib/api-client";

export function useAuditQuery(params: QueryAuditParams) {
  return useQuery<PaginatedAuditResponse, ApiClientError>({
    queryKey: ["audit", "logs", params],
    queryFn: () => auditApi.getAuditLogs(params),
    staleTime: 30 * 1000,
  });
}

export function useAuditDetailQuery(id: number | null) {
  return useQuery<AuditDetail, ApiClientError>({
    queryKey: ["audit", "detail", id],
    queryFn: () => auditApi.getAuditDetail(id!),
    enabled: typeof id === "number" && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}
