import PageHeader from "@/components/page-header";
import GovernorateDataTable from "@/features/countries/components/data-table/governorate-data-table";

export default async function CountryGovernoratesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="page">
      <PageHeader t_key="governorate" />
      <GovernorateDataTable slug={slug} />
    </div>
  );
}
