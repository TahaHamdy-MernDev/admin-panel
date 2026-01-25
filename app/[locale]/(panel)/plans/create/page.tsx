import PageHeader from "@/components/page-header";
import PlanForm from "@/features/plan/components/plan-form";

export default function CreatePlanPage() {
  return (
    <div className="page">
      <PageHeader t_key="plans.create" />
      <PlanForm />
    </div>
  );
}
