import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import { useTogglePlanStatusMutation } from "../../api/use-toggle-plan-status-mutation";

export function ToggleStatusDialog({
  status,
  code,
}: {
  status: boolean;
  code: string;
}) {
  const mutation = useTogglePlanStatusMutation();
  async function onConfirm() {
    await mutation.mutateAsync(code);
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={onConfirm}
      feature_key="plans"
    />
  );
}
