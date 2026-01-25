import PageHeader from "@/components/page-header";
import TransactionsDataTable from "@/features/finance/components/transactions/transactions-data-table";
import { IncomeDialog } from "@/features/finance/components/income/income-form";
import { TermType } from "@/features/finance/types";

export default function IncomePage() {
  return (
    <div className="page">
      <PageHeader t_key="income" right={<IncomeDialog />} />
      <TransactionsDataTable type={TermType.INCOME} />
    </div>
  );
}
