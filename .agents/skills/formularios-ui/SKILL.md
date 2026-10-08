---
name: formularios-ui
description: Patrón visual de formularios en modales del SGA. Úsala al crear o editar un formulario dentro de un Modal para que icono, título, detalle y campos coincidan con el formulario de usuario.
---

# Formularios en modal

Referencia viva: `features/users/components/modals/create-user-modal.tsx` y `features/users/components/forms/create-user-form.tsx`.

El icono, el título y el detalle pertenecen al `Modal` de `@/components/common/modal`. El formulario no repite esa cabecera con tarjetas, iconos de sección ni bloques `bg-muted`.

## Modal

```tsx
<Modal
  open={open}
  onOpenChange={onOpenChange}
  title="Crear cuenta de usuario"
  description="Vincula una persona del padrón a un rol y genera su cuenta de acceso."
  icon={UserAdd01Icon}
  size="lg"
>
  <CreateUserForm
    onSubmit={handleSubmit}
    isLoading={isPending}
    onCancel={() => onOpenChange(false)}
  />
</Modal>
```

- `icon` es un icono de `@hugeicons/core-free-icons`.
- `title` nombra la acción.
- `description` es el detalle, una frase de lo que va a pasar.

## Formulario

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
  <div className="space-y-1.5">
    <Label htmlFor="nombreUsuario" className="text-sm font-medium">
      Nombre de usuario *
    </Label>
    <Input
      id="nombreUsuario"
      placeholder="Ej. 12345678"
      disabled={isLoading}
      aria-invalid={!!errors.nombreUsuario}
      {...register("nombreUsuario")}
    />
    <p className="text-muted-foreground text-xs">
      Por defecto se sugiere el DNI. Puedes personalizarlo antes de guardar.
    </p>
    {errors.nombreUsuario && (
      <p className="text-destructive text-xs font-medium">{errors.nombreUsuario.message}</p>
    )}
  </div>

  <div className="flex justify-end gap-2.5 pt-3">
    <Button
      type="button"
      variant="outline"
      onClick={onCancel}
      disabled={isLoading}
      className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
    >
      <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
      <span>Cancelar</span>
    </Button>
    <Button
      type="submit"
      disabled={isLoading}
      className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
    >
      {isLoading ? (
        <Spinner className="size-3.5" />
      ) : (
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
      )}
      <span>Guardar cuenta</span>
    </Button>
  </div>
</form>
```

- Cada campo es `space-y-1.5`: etiqueta `text-sm font-medium`, control, detalle opcional `text-muted-foreground text-xs`, error `text-destructive text-xs font-medium`.
- Los campos obligatorios marcan `*` en la etiqueta. Los opcionales dicen `(Opcional)`.
- El pie lleva iconos: `Cancel01Icon` en Cancelar y `CheckmarkCircle02Icon` en guardar. Mientras guarda, el icono de guardar se reemplaza por `Spinner`.
- Las fechas usan `@/components/common/date-picker`, no `input type="date"`.
- Selects con búsqueda usan `@/components/common/select` (`SelectOption`).
