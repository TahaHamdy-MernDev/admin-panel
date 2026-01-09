"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { RHFDialogForm } from "@/components/rhf-form/rhf-form-dialog";
import { FieldGroup } from "@/components/ui/field";
import { RHFInputField } from "@/components/rhf-form/fields/rhf-input-field";
import { RHFSelectField } from "@/components/rhf-form/fields/rhf-select-field";

import { PlatformRoles } from "@/types/platform-roles.types";
import { useCreateStaffMutation } from "@/hooks/api/staff/use-staff";
import { RHFDatePickerField } from "@/components/rhf-form/fields/rhf-date-picker-field";
import { RHFPasswordInputField } from "@/components/rhf-form/fields/rhf-password-input-field";
import { isValidPhoneNumber } from "react-phone-number-input";
import { RHFInternationalPhoneField } from "@/components/rhf-form/fields/rhf-international-phone-field";
import { getCountryFromPhone } from "@/lib/international-phone";
export const Gender = {
  MALE: "male",
  FEMALE: "female",
} as const;
export const createPlatformEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),

  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  country: z.string().optional(),
  birthDate: z.date().min(1, "Birth date is required"),

  gender: z.enum(Gender),
  platformRole: z.enum(Object.values(PlatformRoles) as [string, ...string[]]),

  employeeDate: z.date().optional(),
  salary: z.string().optional(),
});

export type CreatePlatformEmployeeFormValues = z.infer<
  typeof createPlatformEmployeeSchema
>;

export default function CreatePlatformEmployeeDialogForm() {
  const t = useTranslations("staff.dialog");
  const mutation = useCreateStaffMutation();

  const form = useForm<CreatePlatformEmployeeFormValues>({
    resolver: zodResolver(createPlatformEmployeeSchema),
    defaultValues: {
      // firstName: "Taha",
      // lastName: "Hamdy",
      // email: "taha.hamdy@egapy.com",
      // password: "12345678",
      // phoneNumber: "+201012345678",
      // country: "",
      // gender: Gender.MALE,
      // platformRole: PlatformRoles.CALL_SERVICE,
      // employeeDate: undefined,
      // salary: "2222",

      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      country: "",
      gender: Gender.MALE,
      platformRole: PlatformRoles.CALL_SERVICE,
      employeeDate: undefined,
      salary: "",
    },
  });

  // In your onSubmit function, add more logging
  async function onSubmit(values: CreatePlatformEmployeeFormValues) {
    const country = getCountryFromPhone(values.phoneNumber);
    try {
      console.log("Submitting form with values:", { ...values, country });
      const result = await mutation.mutateAsync({ ...values, country });
      console.log("Mutation result:", result);
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  }
  return (
    <RHFDialogForm<CreatePlatformEmployeeFormValues>
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
            name="firstName"
            label={t("form.firstName")}
          />
          <RHFInputField
            control={form.control}
            name="lastName"
            label={t("form.lastName")}
          />
          <RHFSelectField
            control={form.control}
            name="gender"
            label={t("form.gender.title")}
            options={[
              { value: Gender.MALE, label: t("form.gender.male") },
              { value: Gender.FEMALE, label: t("form.gender.female") },
            ]}
          />
        </FieldGroup>
        <FieldGroup className="flex flex-col md:flex-row">
          <RHFInputField
            control={form.control}
            name="email"
            label={t("form.email")}
          />
          <RHFInternationalPhoneField
            control={form.control}
            name="phoneNumber"
            label={t("form.phoneNumber")}
          />
        </FieldGroup>
        <FieldGroup className="flex flex-col md:flex-row">
          <RHFDatePickerField
            control={form.control}
            name="birthDate"
            label={t("form.birthDate")}
          />
          <RHFDatePickerField
            control={form.control}
            name="employeeDate"
            label={t("form.employeeDate")}
          />
          <RHFSelectField
            control={form.control}
            name="platformRole"
            label={t("form.role.title")}
            options={[
              {
                value: PlatformRoles.ADMIN.toString(),
                label: t("form.role.admin"),
              },
              {
                value: PlatformRoles.CALL_SERVICE.toString(),
                label: t("form.role.call_service"),
              },
              {
                value: PlatformRoles.ACCOUNTANT.toString(),
                label: t("form.role.accountant"),
              },
            ]}
          />
        </FieldGroup>
        <FieldGroup className="flex flex-col md:flex-row">
          <RHFInputField
            control={form.control}
            name="salary"
            type="number"
            label={t("form.salary")}
            className="basis-1/4"
          />
          <RHFPasswordInputField
            control={form.control}
            name="password"
            label={t("form.password")}
            className="basis-3/4"
          />
        </FieldGroup>
      </FieldGroup>
    </RHFDialogForm>
  );
}
