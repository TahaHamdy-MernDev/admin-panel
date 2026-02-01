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
import { useDeleteCustomerMutation } from "@/features/customers/api/use-delete-customer-mutation";

type ConfirmDeleteCustomerDialogProps = {
  trigger: React.ReactNode | string;
  customerName?: string;
  ownerId: string;
};

export default function ConfirmDeleteCustomerDialog({
  trigger,
  customerName,
  ownerId,
}: ConfirmDeleteCustomerDialogProps) {
  const t = useTranslations();
  const mutation = useDeleteCustomerMutation({
    page: 1,
    limit: 10,
  });
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleConfirm() {
    try {
      await mutation.mutateAsync(ownerId);
      // setLoading(true);
      // toast.success(t("customers.delete_customer_account.success"));

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
            {t("customers.delete_customer_account.title")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {customerName
              ? t("customers.delete_customer_account.description", {
                  name: customerName,
                })
              : t("customers.delete_customer_account.description")}
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
