import Image from "next/image";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import SidebarNavMenu from "./sidebar-navmenu";
import { SIDEBAR } from "./sidebar-links";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-36 flex items-center justify-center">
        <Image
          src="/assets/logo.svg"
          alt="Logo"
          width={120}
          height={120}
          className="object-contain my-5"
        />
      </SidebarHeader>
      <SidebarContent className="py-2 flex flex-col p-2">
        <SidebarNavMenu items={SIDEBAR} />
      </SidebarContent>
    </Sidebar>
  );
}
