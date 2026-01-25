import PageHeader from "@/components/page-header";
import { AccountDialog } from "@/features/finance/components/accounts/account-form";
import AccountsDataTable from "@/features/finance/components/accounts/account-data-table";

export default function AccountsPage() {
  return (
    <div className="page">
      <PageHeader t_key="accounts" right={<AccountDialog />} />
      <AccountsDataTable />
    </div>
  );
}
