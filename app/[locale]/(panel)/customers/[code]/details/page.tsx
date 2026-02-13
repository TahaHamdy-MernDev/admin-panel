import MainCard from "@/components/cards/main-card";
import MetricCard from "@/components/cards/metric-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Layers,
  Package,
  ShieldAlert,
  ShoppingCart,
  UserCheck,
  Users,
} from "lucide-react";
export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs < 1000) return `${value}`;
  if (abs < 1_000_000)
    return `${(value / 1000).toFixed(abs < 10_000 ? 1 : 0)}k`;
  if (abs < 1_000_000_000)
    return `${(value / 1_000_000).toFixed(abs < 10_000_000 ? 1 : 0)}m`;
  return `${(value / 1_000_000_000).toFixed(1)}b`;
}
// function StatCard({
//   label,
//   value,
//   icon: Icon,
// }: {
//   label: string;
//   value: number;
//   icon: React.ComponentType<any>;
// }) {
//   return (
//     <Card className="h-full">
//       <CardContent className="flex items-center justify-between p-4">
//         <div className="space-y-1">
//           <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
//             {label}
//           </p>
//           <p className="text-2xl font-semibold tabular-nums">

//           </p>
//         </div>
//         <Icon className="h-5 w-5 text-muted-foreground" />
//       </CardContent>
//     </Card>
//   );
// }

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const code = await params;
  console.log(code);
  const kpis = {
    teamMembers: 12,
    products: 248,
    variants: 1420,
    orders: 9832,
    customers: 4123,
    activeSessions: 17,
  };

  return (
    <div className="page">
      <section>
        <MainCard title={"Merchant Details"}>
          {/* Left */}
          <div     className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">tenant.name</h1>
              <Badge variant="outline" className="text-xs">
                active
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-mono">
                tenant.slug
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Copy className="h-3 w-3" />
                </Button>
              </span>

              <span className="inline-flex items-center gap-1 font-mono">
                tenant.id
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Copy className="h-3 w-3" />
                </Button>
              </span>

              <span>• Created 2 days ago</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="tenant.owner.avatarUrl" />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">tenant.owner.name</p>
              <p className="text-xs text-muted-foreground">a@gmail.com</p>
            </div>
          </div>
        </MainCard>
      </section>
      <section title="Key metrics">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard
            title="Team members"
            value={formatCompactNumber(Number(kpis.teamMembers))}
            icon={<Users />}
          />
          <MetricCard
            title="Products"
            value={formatCompactNumber(Number(kpis.products))}
            icon={<Package />}
          />
          <MetricCard
            title="Variants"
            value={formatCompactNumber(Number(kpis.variants))}
            icon={<Layers />}
          />
          <MetricCard
            title="Orders"
            value={formatCompactNumber(Number(kpis.orders))}
            icon={<ShoppingCart />}
          />
          <MetricCard
            title="Customers"
            value={formatCompactNumber(Number(kpis.customers))}
            icon={<UserCheck />}
          />
          <MetricCard
            title="Active sessions"
            value={formatCompactNumber(Number(kpis.activeSessions))}
            icon={<ShieldAlert />}
          />
        </div>
      </section>
    </div>
  );
}
