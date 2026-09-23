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
    <Avatar size="sm" className={cn("size-6", className)}>
      {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
      <AvatarFallback className="text-[10px]">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
