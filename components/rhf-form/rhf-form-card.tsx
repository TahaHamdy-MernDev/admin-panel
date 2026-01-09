"use client";
import * as React from "react";
import { UseFormReturn, SubmitHandler, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import MainCard from "../cards/main-card";
import { CardFooter } from "../ui/card";

type RHFCardFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  title?: string;
  description?: string;
  children: React.ReactNode;
  show_actions?: boolean;
};

export function RHFCardForm<T extends FieldValues>({
  form,
  title,
  description,
  onSubmit,
  children,
  show_actions = true,
}: RHFCardFormProps<T>) {
  const t = useTranslations();

  function handleCancel() {
    form.reset();
  }

  async function handleSubmit(data: T) {
    await onSubmit(data);
    form.reset();
  }

  return (
    <MainCard
      title={title || ""}
      description={description || ""}
      classes={{ card: "gap-0!", content: "mt-0!" }}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {children}
        {show_actions && (
          <CardFooter className="flex justify-end gap-2 px-0!">
            <Button type="button" variant="ghost" onClick={handleCancel}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </CardFooter>
        )}
      </form>
    </MainCard>
  );
}
