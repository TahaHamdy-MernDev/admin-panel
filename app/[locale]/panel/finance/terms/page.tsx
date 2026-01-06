import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import TransactionsDataTable from "@/components/finance/transations/data-tabel";
import TermsDataTable from "@/components/finance/terms/data-table";

export default function FinanceTermsPage() {
  return (
    <div className="page">
      <PageHeader t_key="terms" right={<Button>Add Income</Button>} />
      <TermsDataTable />
    </div>
  );
}
