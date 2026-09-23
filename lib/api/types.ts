export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
  statusCode?: number;
}

export interface PaginatedMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor?: string | null;
  hasNextPage: boolean;
  totalCount?: number;
}
