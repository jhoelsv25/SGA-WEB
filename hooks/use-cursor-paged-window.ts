"use client";

import * as React from "react";
import type { InfiniteData } from "@tanstack/react-query";

export type CursorPagedPage<TItem> = {
  data?: TItem[];
  items?: TItem[];
};

export type CursorPagedInfiniteResult<TItem, TPage extends CursorPagedPage<TItem>> = {
  data?: InfiniteData<TPage>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
};

export interface CursorPagedWindowPagination {
  page: number;
  totalPages: number;
  total: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  isLoadingNextPage: boolean;
}

export interface UseCursorPagedWindowOptions {
  /**
   * When this value changes (e.g. filters), the window resets to the first page.
   */
  resetKey?: string | number | boolean | null;
}

/**
 * Presents a classic page window (first / prev / next / last) over a
 * TanStack `useInfiniteQuery` cursor feed. Only the current page's rows
 * are exposed as `items`.
 */
export function useCursorPagedWindow<
  TItem,
  TPage extends CursorPagedPage<TItem> = CursorPagedPage<TItem>,
>(query: CursorPagedInfiniteResult<TItem, TPage>, options: UseCursorPagedWindowOptions = {}) {
  const { resetKey } = options;
  const [pageIndex, setPageIndex] = React.useState(0);
  const [prevResetKey, setPrevResetKey] = React.useState(resetKey);

  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setPageIndex(0);
  }

  const pages = query.data?.pages ?? [];
  const currentPage = pages[pageIndex];
  const items = currentPage?.data ?? currentPage?.items ?? [];
  const hasNextPage = query.hasNextPage;
  const isFetchingNextPage = query.isFetchingNextPage;
  const fetchNextPage = query.fetchNextPage;

  const totalPages = Math.max(pages.length + (hasNextPage ? 1 : 0), 1);

  const goToFirstPage = React.useCallback(() => {
    setPageIndex(0);
  }, []);

  const goToPreviousPage = React.useCallback(() => {
    setPageIndex((current) => Math.max(current - 1, 0));
  }, []);

  const goToNextPage = React.useCallback(async () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((current) => current + 1);
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
      setPageIndex((current) => current + 1);
    }
  }, [pageIndex, pages.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const goToLastPage = React.useCallback(() => {
    // Cursor APIs have no true last page; jump to the last loaded window.
    setPageIndex(Math.max(pages.length - 1, 0));
  }, [pages.length]);

  const pagination = React.useMemo<CursorPagedWindowPagination>(
    () => ({
      page: pageIndex + 1,
      totalPages,
      total: items.length,
      onNextPage: () => {
        void goToNextPage();
      },
      onPreviousPage: goToPreviousPage,
      onFirstPage: goToFirstPage,
      onLastPage: goToLastPage,
      canNextPage: pageIndex < pages.length - 1 || hasNextPage,
      canPreviousPage: pageIndex > 0,
      isLoadingNextPage: isFetchingNextPage,
    }),
    [
      pageIndex,
      totalPages,
      items.length,
      pages.length,
      hasNextPage,
      isFetchingNextPage,
      goToNextPage,
      goToPreviousPage,
      goToFirstPage,
      goToLastPage,
    ],
  );

  return {
    items,
    pageIndex,
    pages,
    pagination,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
}
