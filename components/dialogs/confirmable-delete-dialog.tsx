"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useConfirmableDelete } from "@/hooks/use-confirm-delete";
import { TableButton } from "../ui/table-button";

export function ConfirmableDeleteDialog({
  trigger = (
    <TableButton variant={"table_icon_danger"}>
      <Trash2 />
    </TableButton>
  ),
  onConfirm,
  feature_key,
  destructive = true,
}: {
  trigger?: React.ReactNode;
  onConfirm: () => Promise<void>;
  feature_key: string;
  destructive?: boolean;
}) {
  const t = useTranslations("alert-dialog");

  const del = useConfirmableDelete({
    onConfirm,
    confirm: {
      title: t(`${feature_key}.title`),
      description: t(`${feature_key}.description`),
    },
    onError: () => {
      console.error("Delete failed");
    },
  });

  return (
    <AlertDialog open={del.open} onOpenChange={del.setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            className={destructive ? "text-destructive" : undefined}
          >
            {del.title}
          </AlertDialogTitle>

          {del.description && (
            <AlertDialogDescription>{del.description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={del.loading}>
            {t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={del.confirmDelete}
            disabled={del.loading}
            className={
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : undefined
            }
          >
            {del.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
