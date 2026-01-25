import PageHeader from "@/components/page-header";
import TermsDataTable from "@/features/finance/components/terms/terms-data-table";
import TermDialogForm from "@/features/finance/components/terms/term-form";

export default function FinanceTermsPage() {
  return (
    <div className="page">
      <PageHeader t_key="terms" right={<TermDialogForm />} />
      <TermsDataTable />
    </div>
  );
}
