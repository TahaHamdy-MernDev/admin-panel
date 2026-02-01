"use client";

import { useEffect } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { FieldGroup } from "@/components/ui/field";
import { RHFCardForm } from "@/components/rhf-form/rhf-form-card";
import { FormSection } from "@/components/rhf-form/rhf-form-section";
import { RHFCreatableSelectField } from "@/components/rhf-form/fields/rhf-select-with-input-field";

import { BillingTypeEnum, PlanIntervalEnum } from "../../constants";
import { UserRolesEnum } from "@/features/customers/constants";
import { PlatformEnum } from "@/features/integrations/constants";
import { enumValues } from "@/lib/zod-enum";
import type { PlanFormInput } from "../../schema";

const ROLE_KEYS = enumValues(UserRolesEnum);
const PLATFORM_KEYS = enumValues(PlatformEnum);

type PlanFormProps = {
  form: UseFormReturn<PlanFormInput>;
  onSubmit: (values: PlanFormInput) => Promise<void> | void;
  loading?: boolean;
  i18nNamespace?: string;
};

export function PlanForm({
  form,
  onSubmit,
  loading = false,
  i18nNamespace = "plans.create",
}: PlanFormProps) {
  const t = useTranslations(i18nNamespace);

  const billingType = useWatch({
    control: form.control,
    name: "billing_type",
  });

  useEffect(() => {
    const fixedMap: Record<BillingTypeEnum, PlanIntervalEnum> = {
      [BillingTypeEnum.MONTHLY_FIXED]: PlanIntervalEnum.MONTHLY,
      [BillingTypeEnum.QUARTERLY_FIXED]: PlanIntervalEnum.QUARTERLY,
      [BillingTypeEnum.HALF_YEARLY_FIXED]: PlanIntervalEnum.HALF_YEARLY,
      [BillingTypeEnum.YEARLY_FIXED]: PlanIntervalEnum.YEARLY,
      [BillingTypeEnum.PAY_AS_YOU_GO]: PlanIntervalEnum.PAY_AS_YOU_GO,
      [BillingTypeEnum.FREE_TRIAL]: PlanIntervalEnum.PAY_AS_YOU_GO,
    };

    if (!billingType) return;

    const interval = fixedMap[billingType];

    if (!form.getValues("price")) {
      form.setValue(
        "price",
        { interval, price_egp: "", price_usd: "" },
        { shouldDirty: false, shouldValidate: false },
      );
    }

    form.setValue("price.interval", interval, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [billingType, form]);

  return (
    <RHFCardForm<PlanFormInput>
      form={form}
      onSubmit={onSubmit}
      loading={loading}
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
                  value: BillingTypeEnum.FREE_TRIAL,
                },
                {
                  label: t("form.sections.basic.monthly"),
                  value: BillingTypeEnum.MONTHLY_FIXED,
                },
                {
                  label: t("form.sections.basic.quarterly"),
                  value: BillingTypeEnum.QUARTERLY_FIXED,
                },
                {
                  label: t("form.sections.basic.half_yearly"),
                  value: BillingTypeEnum.HALF_YEARLY_FIXED,
                },
                {
                  label: t("form.sections.basic.yearly"),
                  value: BillingTypeEnum.YEARLY_FIXED,
                },
                {
                  label: t("form.sections.basic.pay_as_you_go"),
                  value: BillingTypeEnum.PAY_AS_YOU_GO,
                },
              ]}
            />
          </FieldGroup>
        </FormSection>

        {billingType === BillingTypeEnum.FREE_TRIAL && (
          <FormSection title={t("form.sections.free_trial.title")}>
            <RHFInputField
              control={form.control}
              name="trial_days"
              label={t("form.sections.free_trial.days")}
              type="number"
            />
          </FormSection>
        )}

        {billingType !== BillingTypeEnum.FREE_TRIAL && (
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

        {billingType === BillingTypeEnum.PAY_AS_YOU_GO && (
          <FormSection title="Pay As You Go (per confirmed order)">
            <RHFInputField
              control={form.control}
              name="usage_prices.0.amount_per_confirmed_order"
              label="Amount per confirmed order"
            />
          </FormSection>
        )}

        {/* Products */}
        <FormSection title={t("form.sections.products.title")}>
          <FieldGroup className="flex flex-col md:flex-row">
            <RHFCreatableSelectField
              control={form.control}
              name="product_limits.max_products"
              label={t("form.sections.products.max_products")}
              options={limitOptions(t)}
            />
            <RHFCreatableSelectField
              control={form.control}
              name="product_limits.max_products_stock_logs"
              label={t("form.sections.products.max_products_logs")}
              options={limitOptions(t)}
            />
          </FieldGroup>
        </FormSection>

        {/* Orders */}
        <FormSection title={t("form.sections.orders.title")}>
          <FieldGroup className="flex flex-col md:flex-row">
            <RHFCreatableSelectField
              control={form.control}
              name="order_limits.max_orders_daily"
              label={t("form.sections.orders.max_orders_daily")}
              options={limitOptions(t)}
            />
            <RHFCreatableSelectField
              control={form.control}
              name="order_limits.max_orders_total"
              label={t("form.sections.orders.max_orders_total")}
              options={limitOptions(t)}
            />
          </FieldGroup>
        </FormSection>

        {/* Employees */}
        <FormSection title={t("form.sections.employees.title")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLE_KEYS.map((role, idx) => (
              <div key={role}>
                <RHFCreatableSelectField
                  control={form.control}
                  name={`role_limits.${idx}.max_users`}
                  label={t(`form.sections.employees.${role}`)}
                  options={limitOptions(t)}
                />
                <input
                  type="hidden"
                  value={role}
                  {...form.register(`role_limits.${idx}.role` as const)}
                />
              </div>
            ))}
          </div>
        </FormSection>

        {/* Stores */}
        <FormSection title={t("form.sections.stores.title")}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLATFORM_KEYS.map((platform, idx) => (
              <div key={platform}>
                <RHFCreatableSelectField
                  control={form.control}
                  name={`store_limits.${idx}.max_stores`}
                  label={t(`form.sections.stores.${platform}`)}
                  options={limitOptions(t)}
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

function limitOptions(t: (key: string) => string) {
  return [
    { label: t("form.unlimited"), value: "-1" },
    { label: "0", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
  ];
}
