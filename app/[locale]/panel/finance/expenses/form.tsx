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
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const expenseSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  account_id: z.string().min(1, "Bank is required"),
  term_id: z.string().min(1, "Term is required"),
  employee_id: z.string().optional(),
  date: z.date({
    error: "Expense date is required",
  }),
  note: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function AddExpenseDialog() {
  const t = useTranslations("finance.expenses");
  const mutation = useCreateTransactionMutation();
  const { data } = useTransactionHelperQuery({ type: TermType.EXPENSE });
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: "",
      account_id: "",
      term_id: "",
      employee_id: "",
      date: undefined,
      note: "",
    },
  });
  const termField = useWatch({
    control: form.control,
    name: "term_id",
  });
  const selectedTermId = data?.terms?.find((t) => t.id === Number(termField));

  const requiresEmployee = selectedTermId?.requires_employee === true;
  async function onSubmit(data: ExpenseFormValues) {
    await mutation.mutateAsync(data);
  }
  return (
    <RHFDialogForm<ExpenseFormValues>
      form={form}
      trigger={t("add")}
      title={t("dialog.title")}
      description={t("dialog.description")}
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
        {requiresEmployee && (
          <RHFSelectField
            control={form.control}
            name="employee_id"
            label={t("form.employee")}
            options={data?.staff?.map((acc) => ({
              label: `${acc.firstName} ${acc.lastName}`,
              value: acc.id.toString(),
            }))}
          />
        )}

        <RHFDatePickerField
          control={form.control}
          name="date"
          label={t("form.expense_date")}
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
