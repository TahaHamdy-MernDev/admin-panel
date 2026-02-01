import { useTogglePlanVisibilityMutation } from "../../api/use-toggle-plan-visibility-mutation";
import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";

export function ToggleVisibilityDialog({
  status,
  code,
}: {
  status: boolean;
  code: string;
}) {
  const mutation = useTogglePlanVisibilityMutation();
  async function onConfirm() {
    await mutation.mutateAsync(code);
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={onConfirm}
      feature_key="plans-visibility"
    />
  );
}
