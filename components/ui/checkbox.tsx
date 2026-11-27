"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground border-input bg-background text-foreground focus-visible:border-primary focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:bg-input/30 dark:data-checked:bg-primary dark:data-[state=indeterminate]:bg-primary relative flex size-4.5 shrink-0 items-center justify-center rounded-[6px] border shadow-2xs transition-all outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={2.5}
          className="group-data-[state=indeterminate]/checkbox:hidden"
        />
        <HugeiconsIcon
          icon={MinusSignIcon}
          strokeWidth={3}
          className="hidden group-data-[state=indeterminate]/checkbox:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
