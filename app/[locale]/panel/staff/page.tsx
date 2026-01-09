import PageHeader from "@/components/page-header";
import StaffDataTable from "./table-data";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const CreatePlatformEmployeeDialogForm = dynamic(() => import("./form"));
export default function StaffPage() {
  return (
    <div className="page">
      <PageHeader t_key="staff" right={
        <Suspense fallback={<div>Loading...</div>}>
        <CreatePlatformEmployeeDialogForm />
        </Suspense>
        } />
      <StaffDataTable />
    </div>
  );
}
