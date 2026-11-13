"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowTurnBackwardIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { useSession, useStopImpersonate } from "../hooks/use-auth";

export function ImpersonationBanner() {
  const { data: session } = useSession();
  const stopImpersonate = useStopImpersonate();

  const user = session?.user;
  const impersonatedBy = user?.impersonatedBy;

  if (!user || !impersonatedBy) {
    return null;
  }

  const nombreVisible =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username;
  const rolVisible = user.activeRoleName || user.roles?.[0] || "Usuario";

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300/70 bg-amber-50 px-4 py-2 text-xs text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-100"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
          <HugeiconsIcon icon={ViewIcon} size={14} />
        </span>
        <p className="leading-snug">
          <strong className="font-semibold">Vista simulada activa:</strong> estás navegando como{" "}
          <span className="font-semibold underline decoration-amber-400/80 underline-offset-2">
            {nombreVisible}
          </span>{" "}
          <span className="rounded bg-amber-200/70 px-1.5 py-0.5 text-[11px] font-medium text-amber-900 dark:bg-amber-800/60 dark:text-amber-100">
            {rolVisible}
          </span>
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 gap-1.5 border-amber-400/80 bg-white/80 text-xs font-medium text-amber-950 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/50 dark:text-amber-100 dark:hover:bg-amber-900"
        onClick={() => stopImpersonate.mutate()}
        disabled={stopImpersonate.isPending}
      >
        {stopImpersonate.isPending ? (
          <Spinner className="size-3" />
        ) : (
          <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={13} />
        )}
        Volver a mi cuenta ({impersonatedBy.username})
      </Button>
    </div>
  );
}
