import { cn } from "@/lib/utils";
import { Spinner, SpinnerSize } from "../spinner";

export interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  size?: SpinnerSize;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingScreen({
  message = "Cargando información...",
  subMessage,
  size = "lg",
  fullScreen = true,
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center",
        fullScreen ? "bg-background/80 fixed inset-0 z-50 backdrop-blur-xs" : "min-h-87.5 w-full",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size={size} />
        {message && <p className="text-foreground text-sm font-medium">{message}</p>}
        {subMessage && <p className="text-muted-foreground text-xs">{subMessage}</p>}
      </div>
    </div>
  );
}
