---
name: tanstack-table
description: Best practices for TanStack React Table v9 in Next.js. Covers column definition patterns, action cell decoupling with TableRowActions, type-safety, pagination, filtering, sorting, performance optimization, and memoization.
---

# TanStack Table (React Table v9) Best Practices

## 1. Modular Structure for Table Views

Always organize table features into dedicated subdirectories under `views/table/`:

```
views/table/
├── columns/
│   ├── <name>-actions.tsx  # Celda de acciones de fila usando TableRowActions
│   ├── <name>-columns.tsx  # Definición pura de ColumnDef<TData, TValue>[]
│   └── index.ts            # Barrel export
└── <name>-table.tsx        # Componente de tabla con estados, paginación y useMemo
```

## 2. Decoupled Action Cells with `TableRowActions`

Never embed complex inline dropdowns, popovers, or modal states directly inside `columns.tsx`. Instead:

1. Create `<name>-actions.tsx` rendering the global `@/components/common/row-actions` (`<TableRowActions />`):

```tsx
import { TableRowActions } from "@/components/common/row-actions";

export function ItemActionCell({ item, onEdit, onDelete }: ItemActionCellProps) {
  return (
    <TableRowActions<ItemStatus>
      header={{
        title: "Registro",
        subtitle: item.name,
      }}
      copy={{ text: item.email, label: "Copiar correo" }}
      onEdit={onEdit ? () => onEdit(item) : undefined}
      statusPicker={{
        current: item.status,
        options: STATUS_OPTIONS,
        onSelect: (newStatus) => handleStatusChange(item.id, newStatus),
      }}
      items={[{ label: "Ver detalles", icon: EyeIcon, onClick: () => handleView(item) }]}
      deleteAction={{
        title: "¿Eliminar registro?",
        description: `Se eliminará permanentemente "${item.name}".`,
        onConfirm: () => deleteMutation.mutateAsync(item.id),
        isPending: deleteMutation.isPending,
      }}
    />
  );
}
```

2. In `<name>-columns.tsx`, delegate the action column to the action cell component:

```tsx
{
  id: "actions",
  header: "",
  cell: ({ row }) => (
    <ItemActionCell
      item={row.original}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  ),
}
```

## 3. Type Safety with Columns

Always define strongly typed columns using `ColumnDef<TData, TValue>`:

```tsx
import { ColumnDef } from "@tanstack/react-table";

export type Item = {
  id: string;
  name: string;
  status: "active" | "inactive";
};

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
  },
];
```

## 4. Memory & Performance Optimization

- Always memoize `columns` and `data` with `useMemo` when rendering tables to avoid resetting state on every render:

```tsx
const memoizedColumns = useMemo(() => getColumns({ onEdit, onDelete }), [onEdit, onDelete]);
const memoizedData = useMemo(() => data ?? [], [data]);
```

- Separate UI controls (pagination bar, search filter, column visibility dropdown) into standalone micro-components.
- For datasets > 500 rows, use virtualization (`@tanstack/react-virtual`).
