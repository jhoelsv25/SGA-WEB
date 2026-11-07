---
name: barra-listados
description: Patrón de la barra de herramientas de los listados del SGA (buscador, Filtros, acción principal y menú ⋯). Úsala al crear o modificar cualquier listado o tabla con ListToolbar, o al agregar un botón a esa barra.
---

# Barra de herramientas de listados

Referencia viva: `features/personas/personas-page.tsx` y `features/docentes/docentes-page.tsx`.
Componente: `@/components/common/list-toolbar` (`<ListToolbar />`) con `useListFilters`.

## Estructura

La barra tiene como máximo 4 controles:

1. **Buscador**: siempre visible, ocupa el ancho libre. Se declara como `type: "search"` en `filterDefs`.
2. **Botón `Filtros`**: agrupa todos los demás filtros en un popover con contador de filtros activos. Es el comportamiento por defecto (`MAX_INLINE_FILTERS = 0`). No declares `inline` salvo que haya una razón fuerte.
3. **Acción principal**: un solo botón de color, el que crea algo (`Registrar docente`, `Crear cuenta`, `Matricular estudiante`). Va en `actions`.
4. **Menú `⋯`**: acciones ocasionales (Importar Excel, Exportar Excel, Matrícula masiva, Buscar persona existente). Va en `secondaryActions`.

## Reglas

- **Una sola acción destacada.** Prohibido más de un botón con relleno en la barra. Prohibido dejar botones `outline` sueltos de Importar o Exportar junto al principal.
- **Actualizar lista** va dentro del menú `⋯`. `ListToolbar` lo mueve solo cuando recibes `secondaryActions` y `onRefresh`. Sin `secondaryActions`, se muestra el icono de recarga suelto.
- **`secondaryActions` recibe `DropdownMenuItem`s** (`@/components/ui/dropdown-menu`). No pases `Button`s ni envuelvas en otro `DropdownMenu`: el menú ya lo pone el toolbar.
- **Alturas**: los botones de la barra usan `h-10` (igual que el buscador y el icono ⋯). No uses `h-8` ni `h-9`.
- **Etiquetas**: la acción principal nombra lo que crea y va en minúscula tras la primera palabra ("Registrar persona", no "Registrar Persona").
- **Listados de personas** (docentes, estudiantes, apoderados): usa `RegistroPersonaAcciones`. Ya trae el botón principal `Registrar <destino>` y el menú ⋯ con Buscar persona existente, Cargar masivo y Actualizar. Agrega Exportar con `extraMenuItems`.
- Los filtros siguen sincronizados con la URL vía `useListFilters`. No crees `Select` sueltos fuera de `filterDefs`.

## Ejemplo

```tsx
<ListToolbar
  filterDefs={cosaFilterDefs}
  listFilters={listFilters}
  onRefresh={() => void refetch()}
  isRefreshing={isFetching}
  actions={
    <Button size="sm" onClick={abrirCrear} className="h-10 gap-2">
      <HugeiconsIcon icon={Add01Icon} className="size-4" />
      Crear cosa
    </Button>
  }
  secondaryActions={
    <DropdownMenuItem
      disabled={isExporting || cosas.length === 0}
      onSelect={() => exportToExcel(cosas)}
    >
      <HugeiconsIcon icon={FileExportIcon} className="size-4" />
      Exportar Excel
    </DropdownMenuItem>
  }
/>
```

## Antes de terminar

- Cuenta los controles de la barra: si pasan de 4, mueve el sobrante al menú ⋯ o al popover.
- Confirma que no quedó ningún `ImportarButton` ni `Button variant="outline"` de Exportar suelto en `actions`.
- Si la acción importa Excel, abre `ImportarModal` desde un `DropdownMenuItem` con estado local.
