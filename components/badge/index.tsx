import type { BadgeKey } from "./badge.types";
import { roleBadgeVariants } from "./role-badge.cva";
import { useBadgeText } from "./badge.i18n";
import Text from "../typography";

export function TranslatedBadge({
  badgeKey,
  size = "md",
}: {
  badgeKey: BadgeKey;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const getBadgeText = useBadgeText();
  const label = getBadgeText(badgeKey);

  return (
    <span className={roleBadgeVariants({ variant: badgeKey, size })}>
      <Text as="small" className="text-center">
        {label}
      </Text>
    </span>
  );
}
