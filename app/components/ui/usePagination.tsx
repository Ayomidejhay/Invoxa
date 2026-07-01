"use client";

import { useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  // Snap back to a valid page if the underlying list shrinks (e.g. after a
  // delete or a search filter narrows the results).
  const currentPage = Math.min(page, pageCount);
  if (page > pageCount) {
    setPage(pageCount);
  }

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return { page: currentPage, setPage, pageCount, pageItems, totalItems: items.length, pageSize };
}
