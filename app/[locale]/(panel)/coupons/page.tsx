import PageHeader from "@/components/page-header";
import CouponsDataTable from "@/features/coupons/components/coupon-data-table";
import { CouponDialogForm } from "@/features/coupons/components/coupon-form";

export default function CouponsPage() {
  return (
    <div className="page">
      <PageHeader t_key="coupons" right={<CouponDialogForm />} />
      <CouponsDataTable />
    </div>
  );
}
