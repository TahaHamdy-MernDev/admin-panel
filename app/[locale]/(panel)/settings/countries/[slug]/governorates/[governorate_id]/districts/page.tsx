import PageHeader from "@/components/page-header";
import DistrictDataTable from "@/features/countries/components/data-table/district-data-table";

export default async function Page({
  params,
}: {
  params: Promise<{  governorate_id: string }>;
}) {
  const {  governorate_id } = await params;
  return (
    <div className="page">
      <PageHeader t_key="districts" />
      <DistrictDataTable governorate_id={Number(governorate_id)} />
    </div>
  );
}
