import { PaginatedResult } from "@/types/api-types";

export const COUPONS_QUERY_KEY = "coupons";
export type Params = {
  page: number;
  limit: number;
};
export enum CouponDiscountType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}
export type CouponRow = {
  id: number;
  created_at: Date;
  code: string;
  discount: number;
  discountType: CouponDiscountType;

  usage_limit: number;
  usage_count: number;

  valid_from: Date;
  valid_to: Date;

  is_active: boolean;
};
export type CouponPaginatedRes = PaginatedResult<CouponRow>;
