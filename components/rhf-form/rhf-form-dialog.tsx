"use client";

import * as React from "react";
import { UseFormReturn, SubmitHandler, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

type RHFDialogFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  trigger: string | React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function RHFDialogForm<T extends FieldValues>({
  form,
  trigger,
  title,
  description,
  onSubmit,
  children,
}: RHFDialogFormProps<T>) {
  const t = useTranslations();
  function handleCancel() {
    form.reset();
  }

  async function handleSubmit(data: T) {
    await onSubmit(data);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {typeof trigger === "string" ? (
          <Button>{trigger}</Button>
        ) : (
          trigger
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {children}

          <DialogFooter className="gap-2">
            <DialogClose
              type="button"
              onClick={handleCancel}
              className="cursor-pointer"
            >
              {t("common.cancel")}
            </DialogClose>
            <Button type="submit" variant={"default"}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
