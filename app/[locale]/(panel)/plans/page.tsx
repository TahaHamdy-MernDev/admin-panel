import PageHeader from "@/components/page-header";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import PlansDataTable from "@/features/plan/components/plan-data-table";

export default async function Page() {
  const t = await getTranslations();
  return (
    <div className="page">
      <PageHeader
        t_key="plans"
        right={
          <Link href="plans/create">
            <Button>{t("common.create")}</Button>
          </Link>
        }
      />
      <PlansDataTable />
    </div>
  );
}
