"use client";

import type * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatar?: string | null;
  className?: string;
}

/**
 * Round avatar that falls back to the person's initials.
 */
export function UserAvatar({ name, avatar, className }: UserAvatarProps): React.JSX.Element {
  return (
    <Avatar
      className={cn(
        "border-primary/20 bg-primary/10 text-primary size-8.5 shrink-0 border font-bold shadow-2xs",
        className,
      )}
    >
      {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
      <AvatarFallback className="text-primary bg-primary/10 text-[11px] font-bold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
