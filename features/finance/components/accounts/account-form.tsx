"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";

import { useTranslations } from "next-intl";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { useCreateAccountMutation } from "../../api/accounts/use-create-account-mutation";

const formSchema = z.object({
  account_name: z.string().min(5).max(32),
  balance: z.string().max(15),
});

export type AccountFormValues = z.infer<typeof formSchema>;

export function AccountDialog() {
  const t = useTranslations("finance.accounts");
  const mutation = useCreateAccountMutation();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_name: "",
      balance: "",
    },
  });

  async function onSubmit(data: AccountFormValues) {
    await mutation.mutateAsync(data);
    // toast("Account created", {
    //   description: JSON.stringify(data, null, 2),
    // });
  }

  return (
    <RHFDialogForm<AccountFormValues>
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
          name="balance"
          label={t("dialog.form.initial_balance")}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
