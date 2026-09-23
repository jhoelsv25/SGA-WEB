---
title: Clean Code & Architecture Guidelines
trigger: always_on
---

# Clean Code, Componentization & Type Safety Rules

## 1. Zero `any` & Strict Typing

- **Prohibido el uso de `any`**: Utiliza tipos explícitos, genéricos, interfaces o `unknown` con type guards.
- **Tipado predictivo**: Valida inputs y payloads externos con **Zod** (`z.infer<typeof schema>`).
- **No type assertions apresurados**: Evita `as Whatever` a menos que sea una frontera con librerías externas sin tipos.

## 2. Arquitectura y Estructura Modular por Feature

Agrupa siempre por dominio en `features/<feature-name>/...` siguiendo la siguiente estructura estándar:

```
features/<feature-name>/
├── api/                  # Endpoints de Supabase / queries y mutations puras
├── components/
│   ├── forms/            # Formulario desacoplado (inputs, Zod, useWatch, SelectOption)
│   ├── modals/           # Modal contenedor liviano (~50-70 líneas)
│   └── ...               # Otros componentes UI (toolbar, stats cards, etc.)
├── config/
│   ├── filters.ts        # Definiciones de filtros de tabla (ListFilterDef[]) y opciones
│   ├── export.ts         # Definiciones de columnas de exportación (ExportColumnDef[])
│   └── index.ts          # Barrel export de configuración
├── consts/
│   └── index.ts          # Constantes de dominio visual (estados, badges, colores, labels)
├── hooks/                # Custom hooks de TanStack Query y estado del feature
├── schemas/              # Esquemas de validación Zod
├── types/                # Tipos TypeScript del dominio (interfaces, enums)
├── views/
│   └── table/
│       ├── columns/
│       │   ├── <name>-actions.tsx  # Celda de acciones usando TableRowActions
│       │   ├── <name>-columns.tsx  # Definición pura de ColumnDef<T>[]
│       │   └── index.ts
│       └── <name>-table.tsx
├── <feature-name>-page.tsx         # Página principal del feature
└── index.ts                        # Barrel export público del feature
```

## 3. Desacoplamiento de Formularios y Modales

- **Formulario en `components/forms/`:**
  - Debe contener la UI de los campos, `useForm`, validaciones con Zod y selectores controlados (`SelectOption`).
  - Si un selector depende de otro (ej: la marca filtra las opciones de audiencia), utiliza `useWatch` para obtener el valor padre y derivar las opciones permitidas con `useMemo`.
  - **Auto-reset preventivo:** Si el valor seleccionado previamente ya no es válido en el nuevo subconjunto permitido, reajústalo automáticamente (ej: a `"all"` o valor por defecto).
- **Modal en `components/modals/`:**
  - Su única responsabilidad es gestionar la apertura/cierre (`open`, `onOpenChange`) y envolver el formulario en el componente `<Modal>` del sistema. No debe superar ~60-80 líneas.

## 4. Tablas y Celda de Acciones Reutilizable

- **Separación de Columnas y Acciones:**
  - En `views/table/columns/`: separa estrictamente la definición de columnas (`<name>-columns.tsx`) de la celda de acciones (`<name>-actions.tsx`).
- **Uso Obligatorio de `TableRowActions`:**
  - Utiliza el componente global `@/components/common/row-actions` (`<TableRowActions />`).
  - Provee de forma declarativa: `header`, `copy`, `onEdit`, `statusPicker` (con popover flotante anclado), `items` y `deleteAction` (con diálogo de confirmación integrado).

## 5. Exportación a Hojas de Cálculo (Excel / CSV)

- **Cero código manual de Blobs o Strings:**
  - Utiliza siempre la utilidad global `@/lib/export-data` (`exportDataToSpreadsheet`) y el custom hook `@/hooks/use-export-excel` (`useExportExcel`).
  - Centraliza el mapeo de cabeceras y formateadores en `config/export.ts` utilizando la interfaz tipada `ExportColumnDef<T>[]`.

## 6. Manejo de Memoria, Ciclo de Vida y Limpieza (Cleanups)

- **Efectos Limpios (`useEffect`)**: Todo listener (`addEventListener`), timer (`setInterval`, `setTimeout`), suscripción a websocket o `AbortController` DEBE tener su función de cleanup de retorno.
- **Prevenir Memory Leaks**:
  - Cancela peticiones HTTP en vuelo usando `signal` de `AbortController` si el componente se desmonta.
  - No guardes referencias a nodos DOM innecesariamente grandes en estados o refs indefinidamente.
  - Evita closures que capturen instancias pesadas cuando no se necesitan.

## 7. TanStack Query & Data Fetching (TTLs & Cache)

- **Stale Time y Cache Time (gcTime) explícitos**:
  - Define siempre `staleTime` según la volatilidad del dato (ej: 1 a 5 minutos para datos estándar, `Infinity` para estáticos).
  - Configura `gcTime` (tiempo que permanece en memoria inactivo antes de ser recolectado por el garbage collector).
- **Query Keys estructuradas**: Usa fábricas o tuplas estandarizadas:
  ```ts
  export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, "detail"] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
  };
  ```
- **Evita refetchs excesivos**: Ajusta `refetchOnWindowFocus: false` si no es crítico tener sincronización continua en tiempo real.

## 8. Rendimiento en Listas y Tablas (React Table / Virtualización)

- **React Table**: Separa la definición de columnas (`columns.tsx`), estados de tabla y renderizado.
- **Memoización inteligente**:
  - Usa `useMemo` para columnas y datos procesados pesados en `@tanstack/react-table`.
  - Si la tabla supera cientos de filas, implementa virtualización (`@tanstack/react-virtual`).

## 9. Manejo de Formularios (React Hook Form + Zod)

- Siempre tipa los formularios usando el esquema de Zod:
  ```ts
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ... }
  });
  ```
- Evita re-renders innecesarios usando `useWatch` o campos controlados aislados en lugar de escuchar todo el estado del formulario en el padre.
- Usa el componente `@/components/common/select` (`SelectOption`) para selectores consistentes con búsqueda integrada.
