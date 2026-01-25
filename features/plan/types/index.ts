export type PlanRow = {
  code: string;
  name: string;
  billing_type: string;
  is_active: boolean;
  is_visible: boolean;
  prices: {
    price_egp: number;
    price_usd: number;
  };
  created_at: string;
};

export type PlanParams = {
  page: number;
  limit: number;
};
export const PLAN_QUERY_KEY = "plans";
