# Next.js 16 & React 19 App Router Guidelines

## 1. Server vs. Client Components Boundaries

- **Páginas y Layouts Server-First**:
  - `page.tsx` y `layout.tsx` deben ser Server Components por defecto.
  - No agregues `'use client'` al inicio de una página completa a menos que sea estrictamente necesario.
  - Empuja la directiva `'use client'` hacia los nodos hoja que requieran interactividad (formularios en `components/forms/`, tablas en `views/table/`, modales en `components/modals/`).
- **Composición y Paso de Datos**:
  - Pasa datos serializables o renderiza componentes hijos (`children`) dentro de Server Components para mantener un bundle JS óptimo en el cliente.

## 2. Parámetros Asíncronos en Next.js 16

En Next.js 15 y 16, tanto `params` como `searchParams` en páginas, layouts y route handlers son **Promesas** (`Promise`).

- **Tipado y Desestructuración Correcta**:
  ```tsx
  interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }

  export default async function EntityPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const query = await searchParams;
    // ...
  }
  ```
- No accedas directamente a `params.id` de forma síncrona, ya que causará errores de ejecución o advertencias de Next.js.

## 3. Navegación, Enlaces e Imágenes

- **Next.js Link**: Utiliza siempre `Link` de `next/link` para navegación interna cliente, no utilices etiquetas `<a>` simples.
- **Optimización de Imágenes**:
  - Usa siempre `<Image />` de `next/image` con atributos `width`, `height`, o `fill` con `sizes` apropiados y `alt` descriptivo.
  - Prohibido el uso de `<img>` plano sin justificación explícita.
