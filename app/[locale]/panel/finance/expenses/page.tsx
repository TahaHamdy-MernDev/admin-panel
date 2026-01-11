import TransactionsDataTable from "@/components/finance/transactions/data-table";
import PageHeader from "@/components/page-header";
import AddExpenseDialog from "./form";
import { TermType } from "@/hooks/api/finance/use-terms";

export default function ExpensesPage() {
  return (
    <div className="page">
      <PageHeader t_key="expenses" right={<AddExpenseDialog />} />
      <TransactionsDataTable type={TermType.EXPENSE} />
    </div>
  );
}
