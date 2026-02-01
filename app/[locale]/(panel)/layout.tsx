import { AppSidebar } from "@/components/sidebar/app-sidebar";
import AppHeader from "@/components/sidebar/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sa_access_token")?.value;
  const refreshToken = cookieStore.get("sa_refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    redirect({ href: "/login", locale });
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="container mx-auto px-4 py-6 transition-all duration-200 ease-in">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
