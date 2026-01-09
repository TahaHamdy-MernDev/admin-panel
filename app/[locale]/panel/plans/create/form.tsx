"use client";

import * as z from "zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { FieldGroup } from "@/components/ui/field";
import { RHFCardForm } from "@/components/rhf-form/rhf-form-card";
import { FormSection } from "@/components/rhf-form/rhf-form-section";

/* ------------------------------------------------------------------ */
/* Schema helpers */
/* ------------------------------------------------------------------ */

const PlanTypeEnum = z.enum(["pay_as_you_go", "monthly", "free_trial"]);

const moneySchema = z.object({
  egp: z.string(),
  usd: z.string(),
});

const planLimitsSchema = z.object({
  employees: z.object({
    call_centers: z.string(),
    accountants: z.string(),
  }),

  stock: z.object({
    products: z.string(),
    history: z.string(),
  }),

  orders: z.object({
    per_day: z.string(),
    total: z.string(),
  }),

  shops: z.object({
    shopify: z.string(),
    easy_orders: z.string(),
    woo_commerce: z.string(),
  }),

  features: z.object({
    has_shipping: z.boolean().optional(),
    has_reports: z.boolean().optional(),
  }),
});

/* ------------------------------------------------------------------ */
/* Main schema */
/* ------------------------------------------------------------------ */

export const createPlanSchema = z
  .object({
    name: z.string().min(2, "Plan name is required"),
    type: PlanTypeEnum,
    plan_price: moneySchema,
    order_price: moneySchema,
    limits: planLimitsSchema,
  })
  .superRefine((data, ctx) => {
    if (data.type === "pay_as_you_go") {
      if (
        Number(data.order_price.egp) <= 0 &&
        Number(data.order_price.usd) <= 0
      ) {
        ctx.addIssue({
          path: ["order_price", "egp"],
          message: "Please set a price for Pay As You Go",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.type === "monthly") {
      if (
        Number(data.plan_price.egp) <= 0 &&
        Number(data.plan_price.usd) <= 0
      ) {
        ctx.addIssue({
          path: ["plan_price", "egp"],
          message: "Monthly price is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.type === "free_trial") {
      if (data.limits.features.has_reports) {
        ctx.addIssue({
          path: ["limits", "features", "has_reports"],
          message: "Reports are not allowed in Free Trial",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        (Number(data.limits.shops.shopify) ?? 0) > 0 ||
        (Number(data.limits.shops.easy_orders) ?? 0) > 0 ||
        (Number(data.limits.shops.woo_commerce) ?? 0) > 0
      ) {
        ctx.addIssue({
          path: ["limits", "shops"],
          message: "Stores are not allowed in Free Trial",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

type PlanFormValues = z.infer<typeof createPlanSchema>;

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function PlanForm() {
  const t = useTranslations("plans.create");

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: "",
      type: "pay_as_you_go",
      plan_price: { egp: "", usd: "" },
      order_price: { egp: "", usd: "" },
      limits: {
        employees: { accountants: "", call_centers: "" },
        stock: { history: "", products: "" },
        orders: { per_day: "", total: "" },
        shops: { easy_orders: "", shopify: "", woo_commerce: "" },
        features: {
          has_reports: false,
          has_shipping: false,
        },
      },
    },
  });

  useEffect(() => {
    console.log("form errors", form.formState.errors);
  }, [form.formState]);
  const planType = useWatch({
    control: form.control,
    name: "type",
  });

  async function onSubmit(data: PlanFormValues) {
    toast("Plan Added", {
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <RHFCardForm<PlanFormValues> form={form} onSubmit={onSubmit}>
      <FieldGroup>
        {/* Basic info */}
        <FormSection title={t("form.sections.basic.title")}>
          <RHFInputField
            control={form.control}
            name="name"
            label={t("form.sections.basic.name")}
          />

          <RHFSelectField
            control={form.control}
            name="type"
            label={t("form.sections.basic.type")}
            options={[
              { label: "Pay As You Go", value: "pay_as_you_go" },
              { label: "Monthly", value: "monthly" },
              { label: "Free / Trial", value: "free_trial" },
            ]}
          />
        </FormSection>

        {/* PAY AS YOU GO */}
        {planType === "pay_as_you_go" && (
          <>
            <FormSection title={t("form.sections.pricing.title")}>
              <FieldGroup className="flex flex-col md:flex-row">
                <RHFInputField
                  control={form.control}
                  name="order_price.egp"
                  label={t("form.sections.pricing.order_price_egp")}
                  type="number"
                />
                <RHFInputField
                  control={form.control}
                  name="order_price.usd"
                  label={t("form.sections.pricing.order_price_usd")}
                  type="number"
                />
              </FieldGroup>
            </FormSection>

            <FormSection title={t("form.sections.employees.title")}>
              <FieldGroup className="flex flex-col md:flex-row">
                <RHFInputField
                  control={form.control}
                  name="limits.employees.call_centers"
                  label={t("form.sections.employees.call_centers")}
                  type="number"
                />
                <RHFInputField
                  control={form.control}
                  name="limits.employees.accountants"
                  label={t("form.sections.employees.accountants")}
                  type="number"
                />
              </FieldGroup>
            </FormSection>

            <FormSection title={t("form.sections.stores.title")}>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                <RHFInputField
                  control={form.control}
                  name="limits.shops.shopify"
                  label={t("form.sections.stores.shopify")}
                  type="number"
                />
                <RHFInputField
                  control={form.control}
                  name="limits.shops.easy_orders"
                  label={t("form.sections.stores.easy_orders")}
                  type="number"
                />
                <RHFInputField
                  control={form.control}
                  name="limits.shops.woo_commerce"
                  label={t("form.sections.stores.woo_commerce")}
                  className="md:col-span-2"
                  type="number"
                />
              </FieldGroup>
            </FormSection>
          </>
        )}

        {/* MONTHLY */}
        {planType === "monthly" && (
          <FormSection title={t("form.sections.pricing.title")}>
            <RHFInputField
              control={form.control}
              name="plan_price.egp"
              label={t("form.sections.pricing.plan_price_egp")}
              type="number"
            />
            <RHFInputField
              control={form.control}
              name="plan_price.usd"
              label={t("form.sections.pricing.plan_price_usd")}
              type="number"
            />

            <p className="text-xs text-muted-foreground">
              {t("form.all_features_unlocked")}
            </p>
          </FormSection>
        )}

        {/* FREE / TRIAL */}
        {planType === "free_trial" && (
          <FormSection title={t("form.sections.free_trial.title")}>
            <div className="rounded-md border p-3 text-sm text-muted-foreground space-y-1">
              <p>✔ {t("form.sections.free_trial.features.call_center")}</p>
              <p>✔ {t("form.sections.free_trial.features.products")}</p>
              <p>✔ {t("form.sections.free_trial.features.stock_history")}</p>
              <p>✔ {t("form.sections.free_trial.features.orders_limit")}</p>
              <p>✖ {t("form.sections.free_trial.features.no_stores")}</p>
              <p>✖ {t("form.sections.free_trial.features.no_shipping")}</p>
              <p>✖ {t("form.sections.free_trial.features.no_reports")}</p>
            </div>
          </FormSection>
        )}
      </FieldGroup>
    </RHFCardForm>
  );
}
