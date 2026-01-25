import TransactionsDataTable from "@/features/finance/components/transactions/transactions-data-table";
import PageHeader from "@/components/page-header";
import ExpenseDialog from "@/features/finance/components/expenses/expenses-form";
import { TermType } from "@/features/finance/types";

export default function ExpensesPage() {
  return (
    <div className="page">
      <PageHeader t_key="expenses" right={<ExpenseDialog />} />
      <TransactionsDataTable type={TermType.EXPENSE} />
    </div>
  );
}
