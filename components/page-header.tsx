import { useTranslations } from "next-intl";
import Text from "./typography";

function PageHeader({
  t_key,
  right,
  values,
}: {
  t_key: string;
  right?: React.ReactNode;
  values?: Record<string, never>;
}) {
  const t = useTranslations("page-header");

  return (
    <nav className="flex items-center justify-between gap-2">
      <div>
        <Text as="page_title">{t(`${t_key}.title`, values)}</Text>
        <Text as="muted">{t(`${t_key}.description`, values)}</Text>
      </div>
      {right}
    </nav>
  );
}

export default PageHeader;
