"use client";

import * as z from "zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { FieldGroup } from "@/components/ui/field";
import { RHFCardForm } from "@/components/rhf-form/rhf-form-card";
import { FormSection } from "@/components/rhf-form/rhf-form-section";
import { RHFCreatableSelectField } from "@/components/rhf-form/fields/rhf-select-with-input-field";
import { useCreatePlanMutation } from "../api/use-create-plan-mutation"; 
/* ------------------------------------------------------------------ */
/* Enums */
/* ------------------------------------------------------------------ */

const BillingTypeEnum = z.enum([
  "FREE_TRIAL",
  "MONTHLY_FIXED",
  "QUARTERLY_FIXED",
  "HALF_YEARLY_FIXED",
  "YEARLY_FIXED",
  "PAY_AS_YOU_GO",
]);

const PlanIntervalEnum = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "HALF_YEARLY",
  "YEARLY",
  "PAY_AS_YOU_GO",
]);

const UserRoleEnum = z.enum([
  "admin",
  "financial_employee",
  "confirmation_employee",
  "operations_employee",
  "warehouse_employee",
  "products_employee",
]);

const StorePlatformEnum = z.enum(["SHOPIFY", "WOO_COMMERCE", "EASY_ORDERS"]);

const ROLE_KEYS = [
  "admin",
  "financial_employee",
  "confirmation_employee",
  "operations_employee",
  "warehouse_employee",
  "products_employee",
] as const;

const PLATFORM_KEYS = ["SHOPIFY", "WOO_COMMERCE", "EASY_ORDERS"] as const;


export const createPlanPriceSchema = z.object({
  interval: PlanIntervalEnum,
  price_egp: z.string().optional(),
  price_usd: z.string().optional(),
});

export const createPlanUsagePriceSchema = z.object({
  amount_per_confirmed_order: z.string().optional(),
});

export const createPlanRoleLimitSchema = z.object({
  role: UserRoleEnum,
  max_users: z.string().optional(),
});

export const createPlanStoreLimitSchema = z.object({
  platform: StorePlatformEnum,
  max_stores: z.string().optional(),
});

export const createPlanProductLimitSchema = z.object({
  max_products: z.string().optional(),
  max_products_stock_logs: z.string().optional(),
});
// daily as total
export const createPlanOrderLimitSchema = z.object({
  max_orders_daily: z.string().optional(),
  max_orders_total: z.string().optional(),
});
export const createPlanSchema = z
  .object({
    name: z.string().min(1, "Plan name is required"),
    billing_type: BillingTypeEnum,
    trial_days: z.string().optional(),
    price: createPlanPriceSchema.optional(),
    usage_prices: z.array(createPlanUsagePriceSchema).optional(),
    role_limits: z.array(createPlanRoleLimitSchema).optional(),
    store_limits: z.array(createPlanStoreLimitSchema).optional(),
    product_limits: createPlanProductLimitSchema.optional(),
    order_limits: createPlanOrderLimitSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.billing_type === "FREE_TRIAL") {
      const d = Number(data.trial_days ?? "0");
      if (!d || d < 1) {
        ctx.addIssue({
          path: ["trial_days"],
          code: z.ZodIssueCode.custom,
          message: "trial_days is required for FREE_TRIAL",
        });
      }
    }

    const fixedMap: Record<string, z.infer<typeof PlanIntervalEnum>> = {
      MONTHLY_FIXED: "MONTHLY",
      QUARTERLY_FIXED: "QUARTERLY",
      HALF_YEARLY_FIXED: "HALF_YEARLY",
      YEARLY_FIXED: "YEARLY",
      // PAY_AS_YOU_GO: "PAY_AS_YOU_GO",
    };

    if (data.billing_type in fixedMap) {
      if (!data.price) {
        ctx.addIssue({
          path: ["price"],
          code: z.ZodIssueCode.custom,
          message: "price is required for fixed plans",
        });
      } else {
        const expectedInterval = fixedMap[data.billing_type];
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

    if (data.billing_type === "PAY_AS_YOU_GO") {
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

/* ------------------------------------------------------------------ */
/* Component
 * ------------------------------------------------------------------ */

export default function PlanForm() {
  const t = useTranslations("plans.create");
  const mutation = useCreatePlanMutation();
  const form = useForm<PlanFormInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: "",
      billing_type: "PAY_AS_YOU_GO",
      trial_days: "7",

      price: {
        interval: "PAY_AS_YOU_GO",
        price_egp: "",
        price_usd: "",
      },

      usage_prices: [{ amount_per_confirmed_order: "" }],

      role_limits: ROLE_KEYS.map((role) => ({ role, max_users: "0" })),
      store_limits: PLATFORM_KEYS.map((platform) => ({
        platform,
        max_stores: "0",
      })),
      order_limits: { max_orders_daily: "0", max_orders_total: "0" },
      product_limits: { max_products: "0", max_products_stock_logs: "0" },
    },
  });

  useEffect(() => {
    console.log("form errors", form.formState.errors);
  }, [form.formState.errors]);

  const billingType = useWatch({
    control: form.control,
    name: "billing_type",
  });

  useEffect(() => {
    const fixedMap = {
      MONTHLY_FIXED: "MONTHLY" as const,
      QUARTERLY_FIXED: "QUARTERLY" as const,
      HALF_YEARLY_FIXED: "HALF_YEARLY" as const,
      YEARLY_FIXED: "YEARLY" as const,
      PAY_AS_YOU_GO: "PAY_AS_YOU_GO" as const,
    };

    if (billingType in fixedMap) {
      form.setValue(
        "price.interval",
        fixedMap[billingType as keyof typeof fixedMap],
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }
  }, [billingType, form]);

  async function onSubmit(values: PlanFormInput) {
    await mutation.mutateAsync(values);
  }

  return (
    <RHFCardForm<PlanFormInput>
      form={form}
      onSubmit={onSubmit}
      loading={mutation.isPending}
    >
      <FieldGroup>
        {/* Basic info */}
        <FormSection title={t("form.sections.basic.title")}>
          <FieldGroup className="flex flex-col md:flex-row">
            <RHFInputField
              control={form.control}
              name="name"
              label={t("form.sections.basic.name")}
            />
            <RHFSelectField
              control={form.control}
              name="billing_type"
              label={t("form.sections.basic.type")}
              options={[
                {
                  label: t("form.sections.basic.free_trial"),
                  value: "FREE_TRIAL",
                },
                {
                  label: t("form.sections.basic.monthly"),
                  value: "MONTHLY_FIXED",
                },
                {
                  label: t("form.sections.basic.quarterly"),
                  value: "QUARTERLY_FIXED",
                },
                {
                  label: t("form.sections.basic.half_yearly"),
                  value: "HALF_YEARLY_FIXED",
                },
                {
                  label: t("form.sections.basic.yearly"),
                  value: "YEARLY_FIXED",
                },
                {
                  label: t("form.sections.basic.pay_as_you_go"),
                  value: "PAY_AS_YOU_GO",
                },
              ]}
            />
          </FieldGroup>
        </FormSection>
        {/* FREE / TRIAL */}
        {billingType === "FREE_TRIAL" && (
          <FormSection title={t("form.sections.free_trial.title")}>
            <RHFInputField
              control={form.control}
              name="trial_days"
              label={t("form.sections.free_trial.days")}
              type="number"
            />
          </FormSection>
        )}

        {billingType !== "FREE_TRIAL" && (
          <FormSection title={t("form.sections.pricing.title")}>
            <FieldGroup className="flex flex-col md:flex-row">
              <RHFInputField
                control={form.control}
                name="price.price_egp"
                label="Price (EGP)"
                type="number"
              />
              <RHFInputField
                control={form.control}
                name="price.price_usd"
                label="Price (USD)"
                type="number"
              />
            </FieldGroup>
          </FormSection>
        )}

        {billingType === "PAY_AS_YOU_GO" && (
          <FormSection title="Pay As You Go (per confirmed order)">
            <RHFInputField
              control={form.control}
              name="usage_prices.0.amount_per_confirmed_order"
              label="Amount per confirmed order"
            />
          </FormSection>
        )}
        <FormSection title={t("form.sections.products.title")}>
          <FieldGroup className="flex flex-col md:flex-row">
            <RHFCreatableSelectField
              control={form.control}
              name={`product_limits.max_products`}
              label={t(`form.sections.products.max_products`)}
              options={[
                { label: t("form.unlimited"), value: "-1" },
                { label: "0", value: "0" },
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
              ]}
            />
            <RHFCreatableSelectField
              control={form.control}
              name={"product_limits.max_products_stock_logs"}
              label={t(`form.sections.products.max_products_logs`)}
              options={[
                { label: t("form.unlimited"), value: "-1" },
                { label: "0", value: "0" },
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
              ]}
            />
          </FieldGroup>
        </FormSection>
        <FormSection title={t("form.sections.orders.title")}>
          <FieldGroup className="flex flex-col md:flex-row">
            <RHFCreatableSelectField
              control={form.control}
              name={`order_limits.max_orders_daily`}
              label={t(`form.sections.orders.max_orders_daily`)}
              options={[
                { label: t("form.unlimited"), value: "-1" },
                { label: "0", value: "0" },
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
              ]}
            />
            <RHFCreatableSelectField
              control={form.control}
              name={"order_limits.max_orders_total"}
              label={t(`form.sections.orders.max_orders_total`)}
              options={[
                { label: t("form.unlimited"), value: "-1" },
                { label: "0", value: "0" },
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
              ]}
            />
          </FieldGroup>
        </FormSection>
        <FormSection title={t("form.sections.employees.title")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLE_KEYS.map((role, idx) => {
              return (
                <div key={role}>
                  <RHFCreatableSelectField
                    control={form.control}
                    name={`role_limits.${idx}.max_users`}
                    label={t(`form.sections.employees.${role}`)}
                    options={[
                      { label: t("form.unlimited"), value: "-1" },
                      { label: "0", value: "0" },
                      { label: "1", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "5", value: "5" },
                    ]}
                  />
                  <input
                    type="hidden"
                    value={role}
                    className="h-0"
                    {...form.register(`role_limits.${idx}.role` as const)}
                  />
                </div>
              );
            })}
          </div>
        </FormSection>

        <FormSection title={t("form.sections.stores.title")}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLATFORM_KEYS.map((platform, idx) => (
              <div key={platform}>
                <RHFCreatableSelectField
                  control={form.control}
                  name={`store_limits.${idx}.max_stores`}
                  label={t(`form.sections.stores.${platform}`)}
                  options={[
                    { label: t("form.unlimited"), value: "-1" },
                    { label: "0", value: "0" },
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                    { label: "5", value: "5" },
                  ]}
                />
                <input
                  type="hidden"
                  value={platform}
                  {...form.register(`store_limits.${idx}.platform` as const)}
                />
              </div>
            ))}
          </div>
        </FormSection>
      </FieldGroup>
    </RHFCardForm>
  );
}
