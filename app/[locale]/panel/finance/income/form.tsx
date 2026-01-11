"use client";
import { RHFDatePickerField } from "@/components/rhf-form/fields/rhf-date-picker-field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { RHFTextareaField } from "@/components/rhf-form/fields/rhf-textarea-field";
import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { TermType } from "@/hooks/api/finance/use-terms";
import {
  useCreateTransactionMutation,
  useTransactionHelperQuery,
} from "@/hooks/api/finance/use-transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const addIncomeSchema = z.object({
  account_id: z.string("Bank is required"),
  term_id: z.string("Term is required"),
  amount: z.string().min(1, "Amount is required"),
  date: z.date({ message: "Receive date is required" }),
  note: z.string().optional(),
});

export type IncomeFormValues = z.infer<typeof addIncomeSchema>;

export function AddIncomeDialog() {
  const t = useTranslations("finance.income");
  const mutation = useCreateTransactionMutation();
  const { data } = useTransactionHelperQuery({ type: TermType.INCOME });
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(addIncomeSchema),
    defaultValues: {
      amount: "",
      account_id: "",
      term_id: "",
      date: undefined,
      note: "",
    },
  });

  async function onSubmit(data: IncomeFormValues) {
    await mutation.mutateAsync(data);
  }

  return (
    <RHFDialogForm<IncomeFormValues>
      form={form}
      trigger={t("add")}
      title={t("dialog.title")}
      description={t("dialog.description")}
      loading={mutation.isPending}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <RHFInputField
          control={form.control}
          name="amount"
          label={t("form.amount")}
        />

        <RHFSelectField
          control={form.control}
          name="account_id"
          label={t("form.bank")}
          options={data?.accounts.map((acc) => ({
            label: acc.name,
            value: acc.id.toString(),
          }))}
        />

        <RHFSelectField
          control={form.control}
          name="term_id"
          label={t("form.term")}
          options={data?.terms.map((acc) => ({
            label: acc.name,
            value: acc.id.toString(),
          }))}
        />

        <RHFDatePickerField
          control={form.control}
          name="date"
          label={t("form.receive_date")}
        />

        <RHFTextareaField
          control={form.control}
          name="note"
          label={t("form.notes")}
          maxLength={200}
          rows={2}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
