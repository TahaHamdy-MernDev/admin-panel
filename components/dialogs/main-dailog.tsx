"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";

type ConfirmFormDialogProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  trigger: React.ReactNode | string;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmFormDialog<T extends FieldValues>({
  trigger,
  title,
  description,
  form,
  onSubmit,
  confirmText,
  cancelText,
}: ConfirmFormDialogProps<T>) {
  const t = useTranslations("common");
  const [open, setOpen] = React.useState(false);

  function handleCancel() {
    form.reset();
    setOpen(false);
  }

  async function handleConfirm(data: T) {
    await onSubmit(data);
    form.reset();
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {typeof trigger === "string" ? (
          <Button variant="outline">{trigger}</Button>
        ) : (
          trigger
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText ?? t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={form.handleSubmit(handleConfirm)}
            disabled={form.formState.isSubmitting}
          >
            {confirmText ?? t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
