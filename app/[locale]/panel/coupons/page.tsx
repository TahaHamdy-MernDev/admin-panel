import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import CouponsDataTable from "./data-table";
import { CreateCouponDialogForm } from "./form";

export default function CouponsPage() {
  return (
    <div className="page">
      <PageHeader t_key="coupons" right={<CreateCouponDialogForm />} />
      <CouponsDataTable />
    </div>
  );
}
