import { z } from "zod";
import { useTranslations } from "next-intl";

const kebabLowercase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function createAddCurrencySchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    slug: z
      .string()
      .min(1, t("schema.slug_required"))
      .max(50, t("schema.slug_max"))
      .regex(kebabLowercase, { message: t("schema.slug_kebab") }),

    currency_code: z
      .string()
      .min(1, t("schema.code_required"))
      .max(50, t("schema.code_max"))
      .regex(kebabLowercase, { message: t("schema.code_kebab") }),

    alt_name: z
      .string()
      .min(1, t("schema.alt_required"))
      .max(20, t("schema.alt_max")),

    image: z
      .custom<File>()
      .refine((v) => v instanceof File, { message: "Image is required" }),

    name_en: z.string().max(120, t("schema.name_en_max")).optional(),
    country_en: z.string().max(120, t("schema.country_en_max")).optional(),
    name_ar: z.string().max(120, t("schema.name_ar_max")).optional(),
    country_ar: z.string().max(120, t("schema.country_ar_max")).optional(),
  });
}

export type AddCurrencyFormValues = z.infer<
  ReturnType<typeof createAddCurrencySchema>
>;
