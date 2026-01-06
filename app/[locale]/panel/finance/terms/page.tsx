import PageHeader from "@/components/page-header";
import TermsDataTable from "@/components/finance/terms/data-table";
import AddTermDialogForm from "./form";

export default function FinanceTermsPage() {
  return (
    <div className="page">
      <PageHeader t_key="terms" right={<AddTermDialogForm />} />
      <TermsDataTable />
    </div>
  );
}
