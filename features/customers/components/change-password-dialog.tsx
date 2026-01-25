"use client";

import React from "react";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFDialogForm } from "../../../components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "../../../components/ui/field";
import { toast } from "sonner";
import { RHFPasswordInputField } from "../../../components/rhf-form/fields/rhf-password-input-field";
import { useChangeCustomerPasswordMutation } from "@/features/customers/api/use-change-customer-password-mutation";

function makeChangePasswordSchema(
  t: ReturnType<typeof useTranslations<"customers.change_password">>,
) {
  return z
    .object({
      password: z
        .string()
        .min(8, t("validation.password_min", { min: 8 }))
        .max(72, t("validation.password_max", { max: 72 })) // bcrypt-safe, also reasonable generally
        .refine((v) => /[a-z]/.test(v), t("validation.password_lower"))
        .refine((v) => /[A-Z]/.test(v), t("validation.password_upper"))
        .refine((v) => /\d/.test(v), t("validation.password_number"))
        .refine((v) => /[^A-Za-z0-9]/.test(v), t("validation.password_symbol")),
      confirm_password: z.string().min(1, t("validation.confirm_required")),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirm_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirm_password"],
          message: t("validation.passwords_mismatch"),
        });
      }
    });
}

type ChangePasswordFormValues = z.infer<
  ReturnType<typeof makeChangePasswordSchema>
>;

export default function ChangePasswordDialog({
  trigger,
  customer_id,
}: {
  trigger: React.ReactNode;
  customer_id: string;
}) {
  const t = useTranslations("customers.change_password");
  const schema = React.useMemo(() => makeChangePasswordSchema(t), [t]);
  const mutation = useChangeCustomerPasswordMutation();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    await mutation
      .mutateAsync({
        customer_id,
        password: data.password,
        confirm_password: data.confirm_password,
      })
      .then(() => {
        toast.success(t("toast.success_title"), {
          description: t("toast.success_desc"),
        });
        form.reset({ password: "", confirm_password: "" });
      });
  }

  return (
    <RHFDialogForm<ChangePasswordFormValues>
      form={form}
      trigger={trigger}
      title={t("title")}
      description={t("description")}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <RHFPasswordInputField
          control={form.control}
          name="password"
          label={t("form.password")}
        />
        <RHFPasswordInputField
          control={form.control}
          name="confirm_password"
          label={t("form.confirm_password")}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
