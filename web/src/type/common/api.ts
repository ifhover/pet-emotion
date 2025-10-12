export enum Status {
  Success = 0,
  Unauthorized = 401,
  Business = -1,
}

export type PageRequest<T extends Record<string, unknown> = {}> = T & {
  page_size: number;
  page_index: number;
};

export type PageData<T = {}> = {
  data: T[];
  page_size: number;
  page_index: number;
  total: number;
};
