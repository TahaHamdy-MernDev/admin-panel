"use client";

import { RHFDateRangePickerField } from "@/components/rhf-form/fields/rhf-date-range-picker-field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { useCreateCouponMutation } from "../api/use-coupon-mutation";
import { toast } from "sonner";
import { CouponDiscountType } from "../types";
const useCreateCouponSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    coupon_code: z
      .string()
      .min(3, t("create.form.coupon_code.validation.required")),

    discount_type: z
      .string()
      .min(1, t("create.form.discount_type.validation.required")),

    discount_value: z
      .string()
      .min(1, t("create.form.discount_value.validation.required")),

    usage_limit: z.string().optional(),

    active_range: z
      .object({
        from: z.date({
          error: () => ({
            message: t("create.form.active_range.from.label"),
          }),
        }),
        to: z.date({
          error: () => ({
            message: t("create.form.active_range.to.label"),
          }),
        }),
      })
      .refine((range) => range.from <= range.to, {
        message: t("create.form.active_range.validation.invalid"),
        path: ["to"],
      }),
  });
};

export type AddCouponFormValues = z.infer<
  ReturnType<typeof useCreateCouponSchema>
>;

export function CouponDialogForm() {
  const t = useTranslations("coupons");
  const schema = useCreateCouponSchema(t);
  const mutation = useCreateCouponMutation();

  const form = useForm<AddCouponFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      coupon_code: "",
      discount_type: "",
      discount_value: "",
      usage_limit: "",
      active_range: undefined,
    },
  });

  const discountType = useWatch({
    control: form.control,
    name: "discount_type",
  });

  async function onSubmit(data: AddCouponFormValues) {
    mutation
      .mutateAsync(data)
      .then(() => {
        toast.success(t("toast.success.title"), {
          description: t("toast.success.description"),
        });
      })
      .catch((error) => {
        toast.error(t("toast.error.title"), {
          description: error.message,
        });
      });
  }

  return (
    <RHFDialogForm<AddCouponFormValues>
      form={form}
      trigger={t("create.title")}
      title={t("create.title")}
      description={t("create.description")}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <RHFInputField
          control={form.control}
          name="coupon_code"
          label={t("create.form.coupon_code.label")}
          placeholder={t("create.form.coupon_code.placeholder")}
        />

        <RHFSelectField
          control={form.control}
          name="discount_type"
          label={t("create.form.discount_type.label")}
          options={[
            {
              label: t("create.form.discount_type.options.percentage"),
              value: CouponDiscountType.PERCENT,
            },
            {
              label: t("create.form.discount_type.options.fixed"),
              value: CouponDiscountType.FIXED,
            },
          ]}
        />

        <RHFInputField
          control={form.control}
          name="discount_value"
          label={
            discountType === "percentage"
              ? t("create.form.discount_value.label") + " (%)"
              : t("create.form.discount_value.label")
          }
          placeholder={discountType === "percentage" ? "10" : "25"}
        />

        <RHFInputField
          control={form.control}
          name="usage_limit"
          label={t("create.form.usage_limit.label")}
          placeholder={t("create.form.usage_limit.placeholder")}
        />

        <RHFDateRangePickerField
          control={form.control}
          name="active_range"
          label={t("create.form.active_range.label")}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
