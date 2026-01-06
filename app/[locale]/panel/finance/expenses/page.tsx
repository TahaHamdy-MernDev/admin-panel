import TransactionsDataTable from "@/components/finance/transations/data-tabel";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function ExpensesPage() {
  return (
    <div className="page">
      <PageHeader
        t_key="expenses"
        right={<Button>Add Expense</Button>}
      />
      <TransactionsDataTable type="expenses" />
    </div>
  );
}
