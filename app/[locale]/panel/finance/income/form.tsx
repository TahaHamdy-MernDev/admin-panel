"use client";
import { RHFDatePickerField } from "@/components/rhf-form/fields/rhf-date-picker-field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { RHFTextareaField } from "@/components/rhf-form/fields/rhf-textarea-field";
import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const addIncomeSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  bank: z.string().min(1, "Bank is required"),
  term: z.string().min(1, "Term is required"),
  receive_date: z.date({ message: "Receive date is required" }),
  notes: z.string().optional(),
});

type AddIncomeFormValues = z.infer<typeof addIncomeSchema>;

export function AddIncomeDialog() {
  const t = useTranslations("finance.income");
  const form = useForm<AddIncomeFormValues>({
    resolver: zodResolver(addIncomeSchema),
    defaultValues: {
      amount: "",
      bank: "",
      term: "",
      receive_date: undefined,
      notes: "",
    },
  });

  async function onSubmit(data: AddIncomeFormValues) {
    toast("Income created", {
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <RHFDialogForm<AddIncomeFormValues>
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
          ]}
        />

        <RHFDatePickerField
          control={form.control}
          name="receive_date"
          label={t("form.receive_date")}
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
