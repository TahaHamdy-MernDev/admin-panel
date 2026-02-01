import {
  Building2,
  Globe,
  Link as LinkIcon,
  MoreHorizontal,
  Shield,
  Users,
  Activity,
  ShoppingCart,
  Package,
  Warehouse,
  Ticket,
  CreditCard,
} from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const code = await params;
  return (
    <div>
      <h1>{code.code}</h1>
    </div>
  );
}
