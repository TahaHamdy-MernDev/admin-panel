import PageHeader from "@/components/page-header";
import TransactionsDataTable from "@/components/finance/transactions/data-table";
import { AddIncomeDialog } from "./form";

export default function IncomePage() {
  return (
    <div className="page">
      <PageHeader t_key="income" right={<AddIncomeDialog />} />
      <TransactionsDataTable type="income" />
    </div>
  );
}
