"use client";

import * as z from "zod";
import { enumValues } from "@/lib/zod-enum";

import { BillingTypeEnum, PlanIntervalEnum } from "../constants";
import { UserRolesEnum } from "@/features/customers/constants";
import { PlatformEnum } from "@/features/integrations/constants";

export const ZodBillingTypeEnum = z.enum(enumValues(BillingTypeEnum));
export const ZodPlanIntervalEnum = z.enum(enumValues(PlanIntervalEnum));
export const ZodUserRoleEnum = z.enum(enumValues(UserRolesEnum));
export const ZodPlatformEnum = z.enum(enumValues(PlatformEnum));

export const createPlanPriceSchema = z.object({
  interval: ZodPlanIntervalEnum,
  price_egp: z.string().optional(),
  price_usd: z.string().optional(),
});

export const createPlanUsagePriceSchema = z.object({
  amount_per_confirmed_order: z.string().optional(),
});

export const createPlanRoleLimitSchema = z.object({
  role: ZodUserRoleEnum,
  max_users: z.string().optional(),
});

export const createPlanStoreLimitSchema = z.object({
  platform: ZodPlatformEnum,
  max_stores: z.string().optional(),
});

export const createPlanProductLimitSchema = z.object({
  max_products: z.string().optional(),
  max_products_stock_logs: z.string().optional(),
});

export const createPlanOrderLimitSchema = z.object({
  max_orders_daily: z.string().optional(),
  max_orders_total: z.string().optional(),
});

export const createPlanSchema = z
  .object({
    name: z.string().min(1, "Plan name is required"),
    billing_type: ZodBillingTypeEnum,
    trial_days: z.string().optional(),
    price: createPlanPriceSchema.optional(),
    usage_prices: z.array(createPlanUsagePriceSchema).optional(),
    role_limits: z.array(createPlanRoleLimitSchema).optional(),
    store_limits: z.array(createPlanStoreLimitSchema).optional(),
    product_limits: createPlanProductLimitSchema.optional(),
    order_limits: createPlanOrderLimitSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.billing_type === BillingTypeEnum.FREE_TRIAL) {
      const d = Number(data.trial_days ?? "0");
      if (!d || d < 1) {
        ctx.addIssue({
          path: ["trial_days"],
          code: z.ZodIssueCode.custom,
          message: "trial_days is required for FREE_TRIAL",
        });
      }
    }

    const fixedMap: Partial<Record<BillingTypeEnum, PlanIntervalEnum>> = {
      [BillingTypeEnum.MONTHLY_FIXED]: PlanIntervalEnum.MONTHLY,
      [BillingTypeEnum.QUARTERLY_FIXED]: PlanIntervalEnum.QUARTERLY,
      [BillingTypeEnum.HALF_YEARLY_FIXED]: PlanIntervalEnum.HALF_YEARLY,
      [BillingTypeEnum.YEARLY_FIXED]: PlanIntervalEnum.YEARLY,
    };

    const expectedInterval = fixedMap[data.billing_type];
    if (expectedInterval) {
      if (!data.price) {
        ctx.addIssue({
          path: ["price"],
          code: z.ZodIssueCode.custom,
          message: "price is required for fixed plans",
        });
      } else {
        if (data.price.interval !== expectedInterval) {
          ctx.addIssue({
            path: ["price", "interval"],
            code: z.ZodIssueCode.custom,
            message: `Interval must be ${expectedInterval} for ${data.billing_type}`,
          });
        }

        const egp = Number(data.price.price_egp || "0");
        const usd = Number(data.price.price_usd || "0");
        if (egp <= 0 && usd <= 0) {
          ctx.addIssue({
            path: ["price", "price_egp"],
            code: z.ZodIssueCode.custom,
            message: "Set at least one price (EGP or USD)",
          });
        }
      }
    }

    if (data.billing_type === BillingTypeEnum.PAY_AS_YOU_GO) {
      if (!data.usage_prices || data.usage_prices.length === 0) {
        ctx.addIssue({
          path: ["usage_prices"],
          code: z.ZodIssueCode.custom,
          message: "usage_prices is required for PAY_AS_YOU_GO",
        });
      } else {
        const amt = Number(
          data.usage_prices[0]?.amount_per_confirmed_order || "0",
        );
        if (amt <= 0) {
          ctx.addIssue({
            path: ["usage_prices", 0, "amount_per_confirmed_order"],
            code: z.ZodIssueCode.custom,
            message: "Amount per confirmed order must be > 0",
          });
        }
      }
    }
  });

export type PlanFormInput = z.infer<typeof createPlanSchema>;
