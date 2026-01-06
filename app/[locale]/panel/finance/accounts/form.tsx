"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";

import { useTranslations } from "next-intl";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";

const formSchema = z.object({
  account_name: z.string().min(5).max(32),
  initial_balance: z.string().min(20).max(100),
});

type FormValues = z.infer<typeof formSchema>;

export function AddAccountDialog() {
  const t = useTranslations("finance.accounts");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_name: "",
      initial_balance: "",
    },
  });

  async function onSubmit(data: FormValues) {
    toast("Account created", {
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <RHFDialogForm<FormValues>
      form={form}
      trigger={t("add")}
      title={t("dialog.title")}
      description={t("dialog.description")}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <RHFInputField
          control={form.control}
          name="account_name"
          label={t("dialog.form.name")}
        />
        <RHFInputField
          control={form.control}
          name="initial_balance"
          label={t("dialog.form.initial_balance")}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
