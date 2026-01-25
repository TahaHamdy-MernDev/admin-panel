import PageHeader from "@/components/page-header";
import CreatePlatformEmployeeDialogForm from "@/features/staff/components/create-staff-form";
import StaffDataTable from "@/features/staff/components/staff-table-data";

export default function StaffPage() {
  return (
    <div className="page">
      <PageHeader t_key="staff" right={<CreatePlatformEmployeeDialogForm />} />
      <StaffDataTable />
    </div>
  );
}
