"use client";
import { usePlanQuery } from "@/features/plan/api/use-plan-query";
import UpdatePlanForm from "@/features/plan/components/forms/update-plan-form";

export default function UpdatePlan({ code }: { code: string }) {
  const { data } = usePlanQuery(code);
  if (!data) return null;
  console.log(data);
  return (
    <UpdatePlanForm
      code={code}
      initialValues={{
        name: data.name,
        billing_type: data.billing_type,
        trial_days: data.trial_days?.toString(),
        price: {
          interval: data.prices[0]?.interval,
          price_egp: data.prices[0]?.price_egp.toString(),
          price_usd: data.prices[0]?.price_usd.toString(),
        },
        usage_prices: [
          {
            amount_per_confirmed_order:
              data.usage_price?.amount_per_confirmed_order.toString(),
          },
        ],
        role_limits: data.role_limits.map((role_limit) => ({
          role: role_limit.role,
          max_users: role_limit.max_users.toString(),
        })),
        store_limits: data.store_limits.map((store_limit) => ({
          platform: store_limit.platform,
          max_stores: store_limit.max_stores.toString(),
        })),
        product_limits: {
          max_products: data.product_limit?.max_products.toString(),
          max_products_stock_logs:
            data.product_limit?.max_products_stock_logs.toString(),
        },
        order_limits: {
          max_orders_daily: data.order_limit?.max_orders_daily.toString(),
          max_orders_total: data.order_limit?.max_orders_total.toString(),
        },
      }}
    />
  );
}
// sk-ws-01-G5uiwjstBjencgu1dXadmxbKia8DRxy4-c1kn67AjW3c8oE5_-3hCebNLkP8ASiYoJwlyR34jK2n6fTaHN44_lD0KXlyZg