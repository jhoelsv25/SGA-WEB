import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

function Input({ className, type, startIcon, endIcon, ...props }: InputProps) {
  const inputElement = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-background/90 text-foreground placeholder:text-muted-foreground/60 h-11 w-full min-w-0 rounded-full border px-4 py-2 text-sm transition-all outline-none",
        "focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-2",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-1",
        "dark:bg-input/30 dark:disabled:bg-input/80",
        startIcon && "pl-10.5",
        endIcon && "pr-10.5",
        className,
      )}
      {...props}
    />
  );

  if (startIcon || endIcon) {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 flex -translate-y-1/2 items-center justify-center [&_svg]:size-4">
            {startIcon}
          </div>
        )}
        {inputElement}
        {endIcon && (
          <div className="text-muted-foreground absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center justify-center [&_svg]:size-4">
            {endIcon}
          </div>
        )}
      </div>
    );
  }

  return inputElement;
}

export { Input };
