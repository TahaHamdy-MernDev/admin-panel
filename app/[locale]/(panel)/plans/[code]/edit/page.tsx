import UpdatePlan from "@/features/plan/components/update-plan";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <UpdatePlan code={code} />;
}

