import { UserRolesEnum } from "@/features/customers/constants";
import {
  BillingTypeEnum,
  PlanIntervalEnum,
  SubscriptionsStatus,
} from "../constants";
import { PlatformEnum } from "@/features/integrations/constants";
import { PaginatedResult } from "@/types/api-types";

export type PlanRow = {
  code: string;
  name: string;
  billing_type: BillingTypeEnum;
  trial_days: number;
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
type Plan = {
  id: number;
  code: string;
  name: string;
  billing_type: BillingTypeEnum;
  trial_days?: number;
  is_active: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  prices: Price[];
  order_limit: OrderLimit;
  product_limit: ProductLimit;
  role_limits: RoleLimit[];
  store_limits: StoreLimit[];
  usage_price: UsagePrice;
};

type Price = {
  id: number;
  plan_id: number;
  interval: PlanIntervalEnum;
  amount: string;
  price_egp: number;
  price_usd: number;
};

type OrderLimit = {
  id: number;
  plan_id: number;
  max_orders_daily: number;
  max_orders_total: number;
};

type ProductLimit = {
  id: number;
  plan_id: number;
  max_products: number;
  max_products_stock_logs: number;
};

type RoleLimit = {
  id: number;
  plan_id: number;
  role: UserRolesEnum;
  max_users: number;
};

type StoreLimit = {
  id: number;
  plan_id: number;
  platform: PlatformEnum;
  max_stores: number;
};

type UsagePrice = {
  id: number;
  plan_id: number;
  amount_per_confirmed_order: string;
  is_active: boolean;
};

export type PlanSubscriptionRow = {
  id: number;
  start_at: string;
  end_at: string;
  note: string;
  status: SubscriptionsStatus;
  wallet_tx: {
    amount: number;
  };
  tenant: {
    owner: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      code: string;
    };
  };
};
export const PLAN_QUERY_KEY = "plans";
export const PLAN_SUBSCRIPTIONS_QUERY_KEY = "plan-subscriptions";
export type GetPlanRes = Plan;
export type GetPlanSubscriptionRes = PaginatedResult<PlanSubscriptionRow>;
