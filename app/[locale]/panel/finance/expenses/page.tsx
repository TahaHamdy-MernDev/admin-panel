import TransactionsDataTable from "@/components/finance/transactions/data-table";
import PageHeader from "@/components/page-header";
import AddExpenseDialog from "./form";

export default function ExpensesPage() {
  return (
    <div className="page">
      <PageHeader t_key="expenses" right={<AddExpenseDialog />} />
      <TransactionsDataTable type="expenses" />
    </div>
  );
}
