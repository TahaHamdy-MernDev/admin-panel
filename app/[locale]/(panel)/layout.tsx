import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/components/sidebar/app-header";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const access_token = (await cookies()).get("sa_access_token")?.value;
  const refresh_token = (await cookies()).get("sa_refresh_token")?.value;
  console.log({
    refresh_token,
    access_token,
  });

  if (!refresh_token || !access_token) {
    const { locale } = await params;
    return redirect({ href: "/login", locale });
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="container mx-auto px-4 py-6 transition-all duration-200 ease-in">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
