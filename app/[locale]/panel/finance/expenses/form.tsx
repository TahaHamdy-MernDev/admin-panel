"use client";
import { RHFDatePickerField } from "@/components/rhf-form/fields/rhf-date-picker-field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { RHFTextareaField } from "@/components/rhf-form/fields/rhf-textarea-field";
import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const expenseSchema = z
  .object({
    amount: z.string().min(1, "Amount is required"),
    bank: z.string().min(1, "Bank is required"),
    term: z.string().min(1, "Term is required"),
    employee_id: z.string().optional(),
    expense_date: z.date({
      error: "Expense date is required",
    }),
    notes: z.string().optional(),
  })
  .refine((data) => data.term !== "employees" || !!data.employee_id, {
    path: ["employee_id"],
    message: "Employee is required when term is employees",
  });

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function AddExpenseDialog() {
  const t = useTranslations("finance.expenses");
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: "",
      bank: "",
      term: "",
      employee_id: "",
      expense_date: undefined,
      notes: "",
    },
  });
  const term = useWatch({
    control: form.control,
    name: "term",
  });
  async function onSubmit(data: ExpenseFormValues) {
    toast("Expense created", {
      description: JSON.stringify(data, null, 2),
    });
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
          name="bank"
          label={t("form.bank")}
          options={[
            { label: "Bank of America", value: "boa" },
            { label: "Chase", value: "chase" },
            { label: "Wise", value: "wise" },
          ]}
        />

        <RHFSelectField
          control={form.control}
          name="term"
          label={t("form.term")}
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Quarterly", value: "quarterly" },
            { label: "Yearly", value: "yearly" },
            { label: "Employees", value: "employees" },
          ]}
        />

        {term === "employees" && (
          <RHFSelectField
            control={form.control}
            name="employee_id"
            label={t("form.employee")}
            options={[
              { label: "John Doe", value: "1" },
              { label: "Jane Smith", value: "2" },
            ]}
          />
        )}

        <RHFDatePickerField
          control={form.control}
          name="expense_date"
          label={t("form.expense_date")}
        />

        <RHFTextareaField
          control={form.control}
          name="notes"
          label={t("form.notes")}
          maxLength={200}
          rows={2}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
