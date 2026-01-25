"use client"
import MainCard from "@/components/cards/main-card";
import MetricCard from "@/components/cards/metric-card";
import { ChartArea } from "@/components/charts/area-cahart";
import ChartMultipleBar from "@/components/charts/bar-multiple";
import { ChartLineMultiple } from "@/components/charts/line-multiple";
import { ChartPieDonut } from "@/components/charts/pie-donut";
import PageHeader from "@/components/page-header";
import { User } from "lucide-react";
import { OverviewDTO } from "@/features/overview/types";
import { useOverviewQuery } from "@/features/overview/api/use-overview-query";

interface Data {
  title: string;
  value: string;
}

export default function Page() {
  const { data } = useOverviewQuery();
  if (!data) return null;
  const { metrics, orders, income_expenses, plan_mix, pay_health } = data;
  // const data: Data[] = [
  //   { title: "total_customers", value: "100" },
  //   { title: "total_customers_pay_as_you_go", value: "50" },
  //   { title: "total_customers_monthly", value: "30" },
  //   { title: "total_customers_yearly", value: "20" },
  //   { title: "total_customers_active", value: "150" },
  //   { title: "total_customers_suspended", value: "10" },
  //   { title: "total_customers_expired", value: "5" },
  //   { title: "total_customers_sessions", value: "1000" },
  //   { title: "total_customers_activity", value: "750" },
  //   { title: "total_customers_trials", value: "10" },
  //   { title: "total_employees", value: "100" },
  //   { title: "total_coupons", value: "50" },
  // ];
  // const orders = [
  //   { d: "14", orders: 980 },
  //   { d: "13", orders: 1040 },
  //   { d: "12", orders: 1120 },
  //   { d: "11", orders: 1090 },
  //   { d: "10", orders: 1210 },
  //   { d: "9", orders: 1180 },
  //   { d: "8", orders: 1340 },
  //   { d: "7", orders: 1420 },
  //   { d: "6", orders: 1390 },
  //   { d: "5", orders: 1510 },
  //   { d: "4", orders: 1620 },
  //   { d: "3", orders: 1580 },
  //   { d: "2", orders: 1710 },
  //   { d: "1", orders: 1932 },
  // ];

  // const income_expenses = [
  //   { m: "11-01-2026", income: 32200, expenses: 640 },
  //   { m: "10-02-2026", income: 35800, expenses: 70105 },
  //   { m: "09-03-2026", income: 40100, expenses: 780 },
  //   { m: "08-04-2026", income: 44750, expenses: 860 },
  //   { m: "07-05-2026", income: 48900, expenses: 920 },
  //   { m: "06-06-2026", income: 52400, expenses: 980 },
  // ];

  const pie_chart_config = {
    plan_one: {
      label: "دفع حسب الاستخدام",
      color: "var(--chart-1)",
    },
    plan_two: {
      label: "الباقة الأولى",
      color: "var(--chart-2)",
    },
    plan_three: {
      label: "الباقة الثانية",
      color: "var(--chart-3)",
    },
  };
  // const plan_mix = [
  //   { name: "دفع حسب الاستخدام", value: 46 },
  //   { name: "الباقة الأولى", value: 34 },
  //   { name: "الباقة الثانية", value: 20 },
  // ];
  // const pay_health = Array.from({ length: 14 }).map((_, i) => ({
  //   d: `${14 - i}`,
  //   success: 88 + (i % 4) * 1.2,
  //   failed: 12 - (i % 4) * 1.2,
  // }));
  return (
    <div className="page">
      <PageHeader t_key="overview" />
      {/* <MainCard title="Overview" /> */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {metrics.map((item) => (
          <MetricCard
            key={item.title}
            title={`Overview.${item.title}`}
            value={item.value}
            icon={<User className="h-6 w-6" />}
          />
        ))}
      </section>
      <div className="grid lg:grid-cols-3 gap-4">
        <ChartArea
          t_key="Overview"
          label="orders"
          Xdata_key="d"
          Ydata_key="orders"
          data={orders}
        />
        <ChartMultipleBar
          t_key="Overview"
          label="income_expenses"
          label_one="income"
          label_two="expenses"
          data_key="m"
          data={income_expenses}
        />
        <ChartPieDonut
          t_key="Overview"
          label="plans"
          data_key="value"
          name_key="name"
          data={plan_mix}
          config={pie_chart_config}
          innerRadius={52}
          outerRadius={80}
          paddingAngle={2}
        />
        <ChartLineMultiple
          t_key="Overview"
          label="pay_health"
          data={pay_health}
          config={pie_chart_config}
          data_key="d"
          keys={["success", "failed"]}
        />
      </div>
    </div>
  );
}
