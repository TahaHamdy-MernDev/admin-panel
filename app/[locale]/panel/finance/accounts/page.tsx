import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import AccountsDataTable from "./data-table";

export default function AccountsPage() {
  return (
    <div className="page">
      <PageHeader t_key="accounts" right={<Button>Add Plan</Button>} />
      <AccountsDataTable />
    </div>
  );
}
