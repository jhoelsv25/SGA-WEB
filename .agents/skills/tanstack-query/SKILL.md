---
name: tanstack-query
description: Best practices for TanStack React Query v5 in Next.js. Covers query key factories, staleTime/gcTime (TTLs), memory leak prevention, prefetching, mutations, and optimistic updates.
---

# TanStack Query (React Query v5) Best Practices

## 1. Query Keys Factory Pattern

Always group query keys in a predictable factory object:

```ts
export const entityKeys = {
  all: ["entity"] as const,
  lists: () => [...entityKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...entityKeys.lists(), filters] as const,
  details: () => [...entityKeys.all, "detail"] as const,
  detail: (id: string) => [...entityKeys.details(), id] as const,
};
```

## 2. TTLs, Stale Time & Garbage Collection (Memory)

- **`staleTime`**: Duration (ms) before data is considered stale and re-fetched in the background. Default is 0.
  - Set a realistic staleTime (e.g. `5 * 60 * 1000` = 5 mins) for data that doesn't change frequently.
- **`gcTime` (formerly cacheTime)**: Duration (ms) unused/inactive query data stays in memory before being garbage-collected.
  - Default is 5 minutes. Lower it for large objects/media payloads to avoid memory leaks.
- Always configure an `AbortSignal` with fetch/axios so unmounted queries abort:

```ts
export const useGetEntity = (id: string) => {
  return useQuery({
    queryKey: entityKeys.detail(id),
    queryFn: ({ signal }) => fetch(`/api/entity/${id}`, { signal }).then((res) => res.json()),
    staleTime: 1000 * 60 * 2, // 2 min TTL
    gcTime: 1000 * 60 * 10, // 10 min in memory
  });
};
```

## 3. QueryClient Setup in Next.js App Router

Ensure QueryClient is instantiated with `useState` or a singleton client per request to avoid cross-request memory sharing on the server side.
