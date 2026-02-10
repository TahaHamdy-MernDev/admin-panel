"use client";
import { ConfirmableDeleteDialog } from "@/components/dialogs/confirmable-delete-dialog";
import { useTranslations } from "next-intl";
import { useDeleteCouponMutation } from "../api/use-coupon-mutation";
import { toast } from "sonner";

export default function DeleteCouponDialog({ id }: { id: string }) {
  const t = useTranslations("coupons.toast");
  const { mutateAsync } = useDeleteCouponMutation();
  async function deleteCoupon() {
    await mutateAsync(id)
      .then(() => {
        toast.success(t("delete.title"), {
          description: t("delete.description"),
        });
      })
      .catch((error) => {
        toast.success(t("error.title"), {
          description: error?.message ?? t("error.description"),
        });
      });
  }
  return (
    <ConfirmableDeleteDialog
      feature_key="coupons.alert.delete"
      onConfirm={() => deleteCoupon()}
    />
  );
}
