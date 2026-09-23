# API Client, Mutaciones y Manejo de Errores

## 1. Cliente HTTP Centralizado (`apiClient`)

- **Prohibido `fetch` nativo sin configurar**:
  - Toda llamada al backend SGA debe realizarse exclusivamente a través de la instancia `apiClient` exportada en `@/lib/api-client`.
  - `apiClient` ya incluye configuración de `baseURL`, timeout, `withCredentials: true` (cookies HttpOnly) e interceptores para refresco automático de sesión (`refreshSessionTokens`).

## 2. Manejo de Errores con `ApiClientError`

- Los interceptores de `apiClient` transforman respuestas erróneas en instancias de `ApiClientError` (`@/lib/api-client`):
  ```ts
  export interface ApiErrorPayload {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
    code?: string;
  }
  ```
- **Mapeo a Formularios (React Hook Form)**:
  - Cuando una mutación falle con errores de validación de backend (`error instanceof ApiClientError && error.errors`), mapea cada campo al formulario:
    ```ts
    if (error instanceof ApiClientError && error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        form.setError(field as Path<FormValues>, {
          type: "manual",
          message: messages[0],
        });
      });
    }
    ```

## 3. Notificaciones y Feedback de Usuario (`@/lib/toast`)

- **Prohibido `alert()`, `confirm()` o invocaciones directas a toasts no estandarizados**.
- Usa siempre el helper centralizado `@/lib/toast` (basado en Sonner):
  ```ts
  import { toast } from "@/lib/toast";

  toast.success("Registro creado exitosamente.");
  toast.error(error.message || "Error al procesar la solicitud.");
  ```

## 4. Mutaciones en TanStack Query

- **Invalidación de Cache Estructurada**:
  - En el callback `onSuccess` de `useMutation`, invalida las query keys correspondientes mediante la factoría de claves del feature:
    ```ts
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createItem,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
        toast.success("Elemento creado.");
      },
      onError: (error: ApiClientError) => {
        toast.error(error.message);
      },
    });
    ```
- **Estados de Envío**:
  - Todo botón o formulario que ejecute una mutación DEBE reflejar el estado `isPending`:
    - Deshabilitar el botón de submit (`disabled={isPending}`).
    - Mostrar un spinner o indicador de carga visual.
