
export type PaginationMeta = {
  current_page: number;
  total_pages: number;
  total_count: number;
  limit: number;
};
export interface ApiResult<T> {
  success: boolean;
  data: {
    items: T;
    meta: PaginationMeta;
  };
  message: string | null;
  errors: Record<string, string[]> | null;
  statusCode: number;
}
