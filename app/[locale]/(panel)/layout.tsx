import { AppSidebar } from "@/components/sidebar/app-sidebar";
import AppHeader from "@/components/sidebar/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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
