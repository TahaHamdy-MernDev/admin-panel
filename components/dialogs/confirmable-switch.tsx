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
} from "@/components/ui/alert-dialog";
import { useConfirmableSwitch } from "@/hooks/use-confirm-switch";
import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Switch } from "../ui/switch";
import { Fragment } from "react/jsx-runtime";
export function ConfirmableSwitch({
  value,
  defaultValue,
  onConfirm,
  feature_key,
}: {
  value?: boolean;
  defaultValue?: boolean;
  onConfirm: (value: boolean) => Promise<void>;
  feature_key: string;
}) {
  const t = useTranslations("alert-dialog");
  const toggle = useConfirmableSwitch({
    value,
    defaultValue,
    onConfirm,
    confirmOn: {
      title: t(`${feature_key}.on.title`),
      description: t(`${feature_key}.on.description`),
    },
    confirmOff: {
      title: t(`${feature_key}.off.title`),
      description: t(`${feature_key}.off.description`),
    },
    onError: () => {
      // ready for toast
      console.error("Failed to update state");
    },
  });

  return (
    <Fragment>
      <Switch
        checked={toggle.checked}
        onCheckedChange={toggle.requestToggle}
        disabled={toggle.loading}
      />

      <AlertDialog open={toggle.open} onOpenChange={toggle.setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{toggle.title}</AlertDialogTitle>
            {toggle.description && (
              <AlertDialogDescription>
                {toggle.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={toggle.cancel}
              disabled={toggle.loading}
            >
              {t("cancel")}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={toggle.confirm}
              disabled={toggle.loading}
            >
              {toggle.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}
