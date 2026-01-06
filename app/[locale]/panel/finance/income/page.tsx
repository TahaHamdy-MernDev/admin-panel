"use client";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import TransactionsDataTable from "@/components/finance/transations/data-tabel";

export default function IncomePage() {
  return (
    <div className="page">
      <PageHeader t_key="income" right={<Button>Add Income</Button>} />
      <TransactionsDataTable type="income" />
    </div>
  );
}
