"use client";

import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { SidebarData } from "./sidebar-links";
import Text from "../typography";

export default function SidebarNavMenu({ items }: { items: SidebarData[] }) {
  const t = useTranslations("app-sidebar");
  const pathname = usePathname();
  const [openItem, setOpenItem] = useState<string | null>(null);
  return (
    <SidebarMenu className="transition-all duration-200">
      {items.map((item) => {
        const has_children = !!item.items?.length;
        const is_sub_item_active = item.items?.some(
          (sub) => `/${sub.url}` === pathname
        );
        const is_item_active = has_children
          ? is_sub_item_active
          : `/${item.url}` === pathname;
        const is_open = openItem === item.title;
        return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={has_children ? is_open : undefined}
            open={has_children ? is_open : undefined}
            onOpenChange={(open) => {
              if (open) {
                setOpenItem(item.title);
              } else {
                setOpenItem(null);
              }
            }}
            className="group/collapsible"
          >
            {item.items?.length ? (
              <MenuItemWithSub
                item={item}
                t={t}
                is_item_active={!!is_item_active}
                pathname={pathname}
              />
            ) : (
              <MenuItem is_item_active={!!is_item_active} item={item} t={t} />
            )}
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}
function MenuItem({
  item,
  t,
  is_item_active,
}: {
  item: SidebarData;
  t: ReturnType<typeof useTranslations>;
  is_item_active: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        size={"lg"}
        variant="parent"
        asChild
        isActive={is_item_active}
        tooltip={item.title}
        data-active={is_item_active}
        className="group/trigger"
      >
        <Link href={`/${item.url}`}>
          <item.icon className="transition-all duration-200 size-5.5! text-primary/70 data-[active=true]:text-primary group-hover/trigger:text-primary group-hover/trigger:scale-110" />
          <Text
            as="p"
            className="
          text-base font-medium transition-colors duration-200 data-[active=true]:text-primary! group-hover/trigger:text-primary!"
          >
            {t(item.title)}
          </Text>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
function MenuItemWithSub({
  item,
  t,
  is_item_active,
  pathname,
}: {
  item: SidebarData;
  t: ReturnType<typeof useTranslations>;
  is_item_active: boolean;
  pathname: string;
}) {
  return (
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton
          size={"lg"}
          variant="parent"
          tooltip={item.title}
          isActive={is_item_active}
          className="group/trigger"
        >
          <item.icon className="transition-all duration-200 size-5.5! text-primary/70 data-[active=true]:text-primary group-hover/trigger:text-primary group-hover/trigger:scale-110" />
          <Text
            as="p"
            className="text-base font-medium transition-colors duration-200 data-[active=true]:text-primary! group-hover/trigger:text-primary!"
          >
            {t(item.title)}
          </Text>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      {item.items?.length ? (
        <>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction className="data-[state=open]:rotate-90 rtl:rotate-180">
              <ChevronRight />
              <span className="sr-only">Toggle</span>
            </SidebarMenuAction>
          </CollapsibleTrigger>
          <CollapsibleContent className="collapsible_content">
            <SidebarMenuSub>
              {item.items?.map((subItem) => {
                const is_sub_item_active = item.items?.some(
                  () => `/${subItem.url}` === pathname,
                );
                return (
                  <SidebarMenuSubItem
                    key={subItem.title}
                    data-active={is_sub_item_active}
                  >
                    <SidebarMenuSubButton
                      className="transition-all duration-200 ease-out hover:bg-primary/10! hover:translate-x-1 data-[active=true]:bg-primary/10!"
                      asChild
                      isActive={is_sub_item_active}
                    >
                      <Link href={`/${subItem.url}`}>
                        <Text
                          as="small"
                          className="data-[sub-item-active=true]:text-primary!"
                        >
                          {t(subItem.title)}
                        </Text>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </>
      ) : null}
    </SidebarMenuItem>
  );
}
