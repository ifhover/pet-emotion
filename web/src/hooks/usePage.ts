import { PageRequest } from "@/type/common";
import { useState } from "react";

type Options<T extends Record<string, any>> = {
  pageSize?: number;
  pageIndex?: number;
};
export default function usePage<T extends Record<string, any> = {}>(options?: Options<T>) {
  const [page, setPage] = useState<PageRequest>({
    page_index: options?.pageIndex || 1,
    page_size: options?.pageSize || 15,
  });

  return {
    page,
    onChange(pageIndex: number, pageSize: number) {
      setPage({
        page_index: pageIndex,
        page_size: pageSize,
      });
    },
  };
}
