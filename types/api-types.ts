export type PaginationMeta = {
  current_page: number;
  total_pages: number;
  total_count: number;
  limit: number;
};

export type ApiSuccessSingle<T> = {
  success: true;
  data: T;
  message: string;
  statusCode: number;
};

export type ApiSuccessPaginated<T> = {
  success: true;
  data: {
    items: T[];
    meta: PaginationMeta;
  };
  message: string | null;
  statusCode: number;
};

export type ApiErrorResult = {
  success: false;
  data: null;
  message: string | null;
  errors: Record<string, string[]> | null;
  statusCode: number;
};
export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};
export type ApiResult<T> = {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
};

// | ApiSuccessSingle<T>
// | ApiSuccessPaginated<T>
// | ApiErrorResult;
