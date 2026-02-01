import type { BadgeKey } from "./badge.types";
import { roleBadgeVariants } from "./role-badge.cva";
import { useBadgeText } from "./badge.i18n";

export function TranslatedBadge({ badgeKey }: { badgeKey: BadgeKey }) {
  const getBadgeText = useBadgeText();
  const label = getBadgeText(badgeKey);

  return (
    <span className={roleBadgeVariants({ variant: badgeKey })}>{label}</span>
  );
}
