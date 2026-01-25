import PageHeader from "@/components/page-header";
import { IntegrationFormDialog } from "@/features/integrations/components/integration-form";
import IntegrationsDataTable from "@/features/integrations/components/integrations-data-table";

export default function IntegrationSettingsPage() {
  return (
    <div className="page">
      <PageHeader t_key="integrations" right={<IntegrationFormDialog />} />
      <IntegrationsDataTable />
    </div>
  );
}
