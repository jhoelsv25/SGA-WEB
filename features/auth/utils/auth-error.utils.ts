import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Mapea errores de validación estructurados devueltos por el backend hacia los campos de react-hook-form.
 */
export function handleFormApiErrors<T extends FieldValues>(
  errors: Record<string, string[]> | undefined,
  setError: UseFormSetError<T>,
): void {
  if (!errors) return;

  for (const [field, messages] of Object.entries(errors)) {
    if (messages && messages.length > 0) {
      setError(field as Path<T>, {
        type: "manual",
        message: messages[0],
      });
    }
  }
}
