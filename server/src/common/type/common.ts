export type PageData<T> = {
  page_index: number;
  page_size: number;
  total: number;
  list: T[];
};
