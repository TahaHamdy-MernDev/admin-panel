"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useTranslations } from "next-intl";
import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFImageUpload } from "@/components/rhf-form/fields/rhf-image-upload";
import { useCreateIntegrationMutation } from "../api/use-create-integration-mutation";
import { IntegrationProvider } from "../types";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";
import React from "react";

export function createIntegrationSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    name: z.string().min(1, t("validation.name_required")),
    image: z.custom<File>().refine((v) => v instanceof File, {
      error: t("validation.image_required"),
    }),
    provider: z.enum(IntegrationProvider, {
      error: t("validation.provider_required"),
    }),
  });
}

export type IntegrationFormValues = z.infer<
  ReturnType<typeof createIntegrationSchema>
>;

export function IntegrationFormDialog() {
  const t = useTranslations("integrations");
  const schema = React.useMemo(() => createIntegrationSchema(t), [t]);
  const mutation = useCreateIntegrationMutation();
  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: IntegrationFormValues) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("provider", data.provider);
    formData.append("image", data.image);
    await mutation.mutateAsync(formData);
    // toast("Account created", {
    //   description: JSON.stringify(data, null, 2),
    // });
  }
  return (
    <RHFDialogForm<IntegrationFormValues>
      form={form}
      trigger={t("add")}
      title={t("dialog.title")}
      description={t("dialog.description")}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <RHFInputField
          control={form.control}
          name="name"
          label={t("dialog.form.name")}
        />
        <RHFSelectField
          control={form.control}
          name="provider"
          label={t("dialog.form.provider")}
          options={Object.values(IntegrationProvider).map((v) => ({
            value: v.toString(),
            label: t(`provider.${v}`),
          }))}
        />
        <RHFImageUpload
          control={form.control}
          name="image"
          multiple={false}
          label={t("dialog.form.image")}
        />
      </FieldGroup>
    </RHFDialogForm>
  );
}
