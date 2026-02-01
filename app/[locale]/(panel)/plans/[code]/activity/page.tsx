import PageHeader from "@/components/page-header";
import PlanSubscriptionsDataTable from "@/features/plan/components/table/plan-subscriptions-table";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <div className="page">
      <PageHeader t_key="plans.subscriptions-activity" />
      <PlanSubscriptionsDataTable code={code} />
    </div>
  );
}
