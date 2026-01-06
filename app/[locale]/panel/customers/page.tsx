import PageHeader from "@/components/page-header";
import CustomersDataTable from "./data-table";

export default function CustomersPage() {
  return (
    <div className="page">
      <PageHeader t_key="customers" />
      <CustomersDataTable />
    </div>
  );
}
