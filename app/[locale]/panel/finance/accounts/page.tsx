import PageHeader from "@/components/page-header";
import AccountsDataTable from "./data-table";
import { AccountDialog } from "./form";

export default function AccountsPage() {
  return (
    <div className="page">
      <PageHeader t_key="accounts" right={<AccountDialog />} />
      <AccountsDataTable />
    </div>
  );
}
