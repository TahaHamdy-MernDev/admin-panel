import { useTranslations } from "next-intl";
import Text from "./typography";

function PageHeader({
  t_key,
  right,
}: {
  t_key: string;
  right?: React.ReactNode;
}) {
  const t = useTranslations(`page-header.${t_key}`);
  return (
    <nav className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-0">
        <Text as="page_title" className="mb-0">
          {t("title")}
        </Text>
        <Text as="muted" className="-mt-0.5">
          {t("description")}
        </Text>
      </div>
      {right && right}
    </nav>
  );
}

export default PageHeader;
