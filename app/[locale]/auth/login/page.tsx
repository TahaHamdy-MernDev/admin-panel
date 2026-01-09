"use client";

import ChangeLocalizations from "@/components/localization-changer";
import { RHFInternationalPhoneField } from "@/components/rhf-form/fields/rhf-international-phone-field";
import { RHFPasswordInputField } from "@/components/rhf-form/fields/rhf-password-input-field";
import { RHFCardForm } from "@/components/rhf-form/rhf-form-card";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAuthLoginMutation } from "@/hooks/api/auth/use-auth";
import { useRouter } from "@/i18n/navigation";
import { PlatformRoles } from "@/types/platform-roles.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";

const LoginForm = z.object({
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof LoginForm>;

export default function Page() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const mutation = useAuthLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginForm),
    defaultValues: {
      phoneNumber: "+201114911898",
      password: "sdfgdfsgdsfgdsf",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    const res = await mutation.mutateAsync(data);
    console.log(res);
    if (res?.user) {
      switch (res.user.role) {
        case PlatformRoles.SUPER_ADMIN:
        case PlatformRoles.ACCOUNTANT:
        case PlatformRoles.ADMIN:
        case PlatformRoles.CALL_SERVICE:
          router.push({ pathname: "/panel/overview" });
          break;

        default:
          break;
      }
    }
  }

  return (
    <div className="relative min-h-svh w-screen flex items-center justify-center">
      {/* Language Switch */}
      <div className="absolute top-4 ltr:left-4 rtl:right-4 z-10">
        <ChangeLocalizations />
      </div>

      {/* Card Wrapper */}
      <div className="w-full max-w-md px-4">
        <RHFCardForm<LoginFormValues>
          form={form}
          onSubmit={onSubmit}
          show_actions={false}
          //   className="rounded-2xl border bg-card shadow-xl"
        >
          <div className="space-y-8 p-2 sm:p-2">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/assets/logo.svg"
                width={180}
                height={180}
                alt="logo"
                className="object-contain"
                priority
              />
            </div>

            {/* Form */}
            <FieldGroup className="space-y-5">
              <RHFInternationalPhoneField
                control={form.control}
                name="phoneNumber"
                label={t("phoneNumber")}
              />

              <RHFPasswordInputField
                control={form.control}
                name="password"
                label={t("password")}
              />

              <Button
                is_loading={mutation.isPending}
                size="lg"
                className="w-full"
              >
                {t("submit")}
              </Button>
            </FieldGroup>
          </div>
        </RHFCardForm>
      </div>
    </div>
  );
}
