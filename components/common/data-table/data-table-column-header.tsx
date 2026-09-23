import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
    return <div className={cn(className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="data-[state=open]:bg-accent -ml-3 h-8"
        onClick={() => column.toggleSorting(isSorted === "asc")}
      >
        <span>{title}</span>
        {isSorted === "desc" ? (
          <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2} />
        ) : isSorted === "asc" ? (
          <HugeiconsIcon icon={ArrowUp01Icon} size={14} strokeWidth={2} />
        ) : (
          <HugeiconsIcon icon={UnfoldMoreIcon} size={14} strokeWidth={2} className="opacity-50" />
        )}
      </Button>
    </div>
  );
}
