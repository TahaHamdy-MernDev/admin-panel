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
import { useDeletePlanMutation } from "../../api/use-delete-plan-mutation";

type ConfirmDeletePlansDialogProps = {
  trigger: React.ReactNode | string;
  code: string;
};

export default function ConfirmDeletePlansDialog({
  trigger,
  code,
}: ConfirmDeletePlansDialogProps) {
  const t = useTranslations();
  const mutation = useDeletePlanMutation();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleConfirm() {
    try {
      await mutation.mutateAsync(code);

      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {typeof trigger === "string" ? (
          <Button variant="destructive">{trigger}</Button>
        ) : (
          trigger
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {t("plans.delete_plan.title")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t("plans.delete_plan.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t("common.cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
