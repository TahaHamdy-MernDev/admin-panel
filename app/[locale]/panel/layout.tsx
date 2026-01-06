"use client";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useLocaleDirection } from "@/hooks/use-locale-direction";
import AppHeader from "@/components/sidebar/app-header";
import { Toaster } from "@/components/ui/sonner";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { dir } = useLocaleDirection();
  return (
    <SidebarProvider className="">
      <AppSidebar side={dir === "rtl" ? "right" : "left"} />
      <SidebarInset>
        <AppHeader />
        <div className="container mx-auto px-4 py-6 transition-all duration-200 ease-in">
          {children}
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
