"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAddCurrencySchema,
  type AddCurrencyFormValues,
} from "../schema/add-currency.schema";

import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFImageUpload } from "@/components/rhf-form/fields/rhf-image-upload";

import { useCreateCountryMutation } from "../api/use-create-country-mutation";
import { toFormData } from "@/lib/api-client";

function CountryForm() {
  const t = useTranslations("countries");
  const schema = createAddCurrencySchema(t);
  const mutation = useCreateCountryMutation();

  const form = useForm<AddCurrencyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: "",
      currency_code: "",
      alt_name: "",
      image: undefined,
      name_en: "",
      country_en: "",
      name_ar: "",
      country_ar: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: AddCurrencyFormValues) {
    const fd = toFormData(values as unknown as Record<string, unknown>);

    // debug properly
    for (const [k, v] of fd.entries()) console.log(k, v);

    await mutation.mutateAsync(fd);
  }

  return (
    <RHFDialogForm<AddCurrencyFormValues>
      form={form}
      trigger={t("add")}
      title={t("title")}
      description={t("description")}
      onSubmit={onSubmit}
      loading={mutation.isPending}
      width="md:max-w-[600px]"
    >
      <FieldGroup>
        <FieldGroup className="flex flex-col md:flex-row">
          <RHFInputField
            control={form.control}
            name="slug"
            label={t("form.slug")}
            placeholder="eg"
          />
          <RHFInputField
            control={form.control}
            name="currency_code"
            label={t("form.currency_code")}
            placeholder="egp"
          />
        </FieldGroup>

        <FieldGroup className="flex flex-col md:flex-row">
          <RHFInputField
            control={form.control}
            name="alt_name"
            label={t("form.alt_name")}
            placeholder="EGP"
          />
        </FieldGroup>

        <FieldGroup className="flex flex-col md:flex-row">
          <RHFInputField
            control={form.control}
            name="name_en"
            label={t("form.name_en")}
            placeholder="Egyptian Pound"
          />
          <RHFInputField
            control={form.control}
            name="country_en"
            label={t("form.country_en")}
            placeholder="Egypt"
          />
        </FieldGroup>

        <FieldGroup className="flex flex-col md:flex-row">
          <RHFInputField
            control={form.control}
            name="name_ar"
            label={t("form.name_ar")}
            placeholder="الجنيه المصري"
          />
          <RHFInputField
            control={form.control}
            name="country_ar"
            label={t("form.country_ar")}
            placeholder="مصر"
          />
        </FieldGroup>

        <FieldGroup>
          <RHFImageUpload
            control={form.control}
            name="image"
            label={t("form.image")}
            multiple={false}
            maxSizeMB={3}
          />
        </FieldGroup>
      </FieldGroup>
    </RHFDialogForm>
  );
}

export default CountryForm;
