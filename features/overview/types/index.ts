export type OverviewDTO = {
  metrics: { title: string; value: string }[];
  orders: { d: string; orders: number }[];
  income_expenses: { m: string; income: number; expenses: number }[];
  plan_mix: { name: string; value: number }[];
  pay_health: { d: string; success: number; failed: number }[];
};

export const OVERVIEW_QUERY_KEY = "overview";
