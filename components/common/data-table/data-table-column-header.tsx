import { Column } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <span className={cn("text-muted-foreground text-xs font-semibold", className)}>{title}</span>
    );
  }

  const isSorted = column.getIsSorted();

  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        onClick={() => column.toggleSorting(isSorted === "asc")}
        className={cn(
          "group text-muted-foreground hover:bg-muted/70 hover:text-foreground -ml-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-semibold transition-colors select-none",
          isSorted && "text-foreground font-bold",
        )}
      >
        <span>{title}</span>
        {isSorted === "desc" ? (
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={13}
            strokeWidth={2.5}
            className="text-primary shrink-0"
          />
        ) : isSorted === "asc" ? (
          <HugeiconsIcon
            icon={ArrowUp01Icon}
            size={13}
            strokeWidth={2.5}
            className="text-primary shrink-0"
          />
        ) : (
          <HugeiconsIcon
            icon={UnfoldMoreIcon}
            size={13}
            strokeWidth={2}
            className="shrink-0 opacity-35 transition-opacity group-hover:opacity-90"
          />
        )}
      </button>
    </div>
  );
}
