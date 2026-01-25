"use client";

import { RHFDateRangePickerField } from "@/components/rhf-form/fields/rhf-date-range-picker-field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const createCouponSchema = z.object({
  coupon_code: z.string().min(3, "Coupon code must be at least 3 characters"),

  discount_type: z.string().min(1, "Discount type is required"),

  discount_value: z.string().min(1, "Discount value is required"),

  usage_limit: z.string().optional(),

  active_range: z
    .object({
      from: z.date({
        error: "Start date is required",
      }),
      to: z.date({
        error: "End date is required",
      }),
    })
    .refine((range) => range.from <= range.to, {
      message: "End date must be after start date",
      path: ["to"],
    }),
});

type CreateCouponFormValues = z.infer<typeof createCouponSchema>;

export function CouponDialogForm() {
  const form = useForm<CreateCouponFormValues>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      coupon_code: "",
      discount_type: "",
      discount_value: "",
      usage_limit: "",
      active_range: undefined,
    },
  });
  const discount_type = useWatch({
    control: form.control,
    name: "discount_type",
  });
  async function onSubmit(data: CreateCouponFormValues) {
    toast("Coupon created", {
      description: JSON.stringify(data, null, 2),
    });
  }
  return (
    <RHFDialogForm<CreateCouponFormValues>
      form={form}
      trigger="Create coupon"
      title="Create coupon"
      description="Create a new discount coupon."
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <RHFInputField
          control={form.control}
          name="coupon_code"
          label="Coupon code"
          placeholder="SAVE20"
        />
        <RHFSelectField
          control={form.control}
          name="discount_type"
          label="Discount type"
          options={[
            { label: "Percentage (%)", value: "percentage" },
            { label: "Fixed amount", value: "fixed" },
          ]}
        />
        <RHFInputField
          control={form.control}
          name="discount_value"
          label={
            discount_type === "percentage"
              ? "Discount percentage"
              : "Discount amount"
          }
          placeholder={discount_type === "percentage" ? "10" : "25.00"}
        />
        <RHFInputField
          control={form.control}
          name="usage_limit"
          label="Usage limit"
          placeholder="Unlimited"
        />
        <RHFDateRangePickerField
          control={form.control}
          name="active_range"
          label="Active range"
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
