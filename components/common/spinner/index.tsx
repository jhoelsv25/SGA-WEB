import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 28,
  xl: 36,
};

export function Spinner({ size = "md", label, className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      className={cn("text-primary inline-flex items-center justify-center gap-2", className)}
      {...props}
    >
      <HugeiconsIcon
        icon={Loading03Icon}
        size={sizeMap[size]}
        strokeWidth={2}
        className="animate-spin"
        aria-hidden="true"
      />
      {label ? (
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
      ) : (
        <span className="sr-only">Cargando...</span>
      )}
    </span>
  );
}
