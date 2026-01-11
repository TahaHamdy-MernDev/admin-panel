"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { useTranslations } from "next-intl";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { TermType, useCreateTermMutation } from "@/hooks/api/finance/use-terms";
import { RHFCheckboxField } from "@/components/rhf-form/fields/rhf-checkbox-field";

export const addTermSchema = z.object({
  name: z.string().min(2, "Term name must be at least 2 characters"),
  type: z.enum(TermType),
  requires_employee: z.boolean().optional(),
});

export type TermFormValues = z.infer<typeof addTermSchema>;

export default function AddTermDialogForm() {
  const t = useTranslations("finance.terms");
  const mutation = useCreateTermMutation();
  const form = useForm<TermFormValues>({
    resolver: zodResolver(addTermSchema),
    defaultValues: {
      name: "",
      type: TermType.INCOME,
      requires_employee: false,
    },
  });
  async function onSubmit(data: TermFormValues) {
    await mutation.mutateAsync(data);
  }
  return (
    <RHFDialogForm<TermFormValues>
      form={form}
      trigger={t("add")}
      title={t("dialog.title")}
      description={t("dialog.description")}
      onSubmit={onSubmit}
      loading={mutation.isPending}
    >
      <FieldGroup>
        <RHFInputField
          control={form.control}
          name="name"
          label={t("form.term_name")}
        />
        <RHFSelectField
          control={form.control}
          name="type"
          label={t("form.type")}
          options={[
            {
              value: TermType.INCOME,
              label: t("form.labels.income"),
            },
            {
              value: TermType.EXPENSE,
              label: t("form.labels.expense"),
            },
          ]}
        />
        <RHFCheckboxField
          control={form.control}
          name="requires_employee"
          label={t("form.employees_term")}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
