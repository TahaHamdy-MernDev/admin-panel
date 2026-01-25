import PageHeader from "@/components/page-header";
import CountryDataTable from "@/features/countries/components/country-data-table";
import CountryForm from "@/features/countries/components/country-form";

export default function CountriesSettingsPage() {
  return (
    <div className="page">
      <PageHeader t_key="countries" right={<CountryForm />} />
      <CountryDataTable />
    </div>
  );
}
