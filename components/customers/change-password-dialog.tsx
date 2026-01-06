"use client";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFDialogForm } from "../rhf-form/rhf-form-dialog";
import { FieldGroup } from "../ui/field";
import { toast } from "sonner";
import { RHFPasswordInputField } from "../rhf-form/fields/rhf-password-input-field";

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordDialog({
  trigger,
  customer_id,
}: {
  trigger: React.ReactNode;
  customer_id: string;
}) {
  const t = useTranslations("customers.change_password");
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  async function onSubmit(data: ChangePasswordFormValues) {
    toast("Password changed", {
      description: JSON.stringify({ ...data, customer_id }, null, 2),
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
