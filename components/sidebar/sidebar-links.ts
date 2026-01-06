import {
  LayoutDashboard,
  Package,
  Users,
  Wallet,
  Percent,
  Settings,
  BarChart3,
} from "lucide-react";
type SubItem = {
  title: string;
  url: string;
};
export type SidebarData = {
  title: string;
  url: string;
  icon: React.ElementType;
  is_active?: boolean;
  items?: SubItem[];
};

export const SIDEBAR: SidebarData[] = [
  {
    title: "dashboard",
    url: "overview",
    icon: LayoutDashboard,
  },
  {
    title: "plans.title",
    url: "plans",
    icon: Package,
  },
  {
    title: "customers.title",
    url: "customers",
    icon: Users,
  },

  {
    title: "finance.title",
    url: "finance",
    icon: Wallet,
    items: [
      { title: "finance.accounts", url: "finance/accounts" },
      { title: "finance.income", url: "finance/income" },
      { title: "finance.expenses", url: "finance/expenses" },
      { title: "finance.terms", url: "finance/terms" },
    ],
  },

  // {
  //   title: "staff.title",
  //   url: "staff",
  //   icon: UserCog,
  //   items: [
  //     { title: "staff.all", url: "staff" },
  //     { title: "staff.roles", url: "staff/roles" },
  //     { title: "staff.teams", url: "staff/teams" },
  //     { title: "staff.logs", url: "staff/logs" },
  //   ],
  // },

  {
    title: "coupons.title",
    url: "coupons",
    icon: Percent,
    // items: [
    //   { title: "coupons.all", url: "coupons" },
    //   { title: "coupons.create", url: "coupons/create" },
    //   { title: "coupons.active", url: "coupons/active" },
    //   { title: "coupons.expired", url: "coupons/expired" },
    //   { title: "coupons.usage", url: "coupons/usage" },
    // ],
  },

  // {
  //   title: "support.title",
  //   url: "support",
  //   icon: Ticket,
  //   items: [
  //     { title: "support.open", url: "support/open" },
  //     { title: "support.pending", url: "support/pending" },
  //     { title: "support.closed", url: "support/closed" },
  //     { title: "support.chat", url: "support/chat" },
  //   ],
  // },

  {
    title: "reports.title",
    url: "reports",
    icon: BarChart3,
    items: [
      { title: "reports.communications", url: "reports/communications" },
      { title: "reports.customers", url: "reports/customers" },
      { title: "reports.expenses", url: "reports/expenses" },
      { title: "reports.orders", url: "reports/orders" },
      { title: "reports.referrals", url: "reports/referrals" },
      { title: "reports.revenue", url: "reports/revenue" },
      { title: "reports.sales", url: "reports/sales" },
      { title: "reports.shipping", url: "reports/shipping" },
    ],
  },

  {
    title: "settings.title",
    url: "settings",
    icon: Settings,
    items: [
      { title: "settings.countries", url: "settings/countries" },
      { title: "settings.integrations", url: "settings/integrations" },
      // { title: "settings.payment", url: "settings/payment" },
      // {
      //   title: "settings.notifications",
      //   url: "settings/notifications",
      // },
      // { title: "settings.security", url: "settings/security" },
      // { title: "settings.audit_log", url: "settings/audit-log" },
    ],
  },
];
