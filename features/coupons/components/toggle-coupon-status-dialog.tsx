import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import { useToggleCouponStatusMutation } from "../api/use-coupon-mutation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function ToggleCouponStatus({
  status,
  id,
}: {
  status: boolean;
  id: string;
}) {
  const t = useTranslations("coupons.toast");

  const mutation = useToggleCouponStatusMutation();
  if (!id) return "-";
  async function handleToggle() {
    await mutation
      .mutateAsync(id)
      .then(() => {
        toast.success(t("toggle.title"), {
          description: t("toggle.description"),
        });
      })
      .catch((error) => {
        toast.error(t("error.title"), {
          description: error.message ?? t("error.description"),
        });
      });
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={handleToggle}
      feature_key="coupons.toggle"
    />
  );
}
