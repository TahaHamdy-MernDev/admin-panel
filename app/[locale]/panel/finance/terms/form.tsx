"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";

export const addTermSchema = z.object({
  term_name: z.string().min(2, "Term name must be at least 2 characters"),
  type: z.string().min(1, "Type is required"),
});

type AddTermFormValues = z.infer<typeof addTermSchema>;

export default function AddTermDialogForm() {
  const t = useTranslations("finance.terms");
  const form = useForm<AddTermFormValues>({
    resolver: zodResolver(addTermSchema),
    defaultValues: {
      term_name: "",
      type: "",
    },
  });
  async function onSubmit(data: AddTermFormValues) {
    toast("Term created", {
      description: JSON.stringify(data, null, 2),
    });
  }
  return (
    <RHFDialogForm<AddTermFormValues>
      form={form}
      trigger={t("add")}
      title={t("dialog.title")}
      description={t("dialog.description")}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <RHFInputField
          control={form.control}
          name="term_name"
          label={t("form.term_name")}
        />
        <RHFSelectField
          control={form.control}
          name="type"
          label={t("form.type")}
          options={[
            { value: "income", label: t("form.labels.income") },
            { value: "expense", label: t("form.labels.expense") },
          ]}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
