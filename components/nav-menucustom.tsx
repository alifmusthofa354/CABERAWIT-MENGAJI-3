"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMainCustom({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    canCollapse?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const { isMobile, setOpenMobile } = useSidebar();
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false); // Menutup sidebar saat link ditekan pada perangkat mobile
    }
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel className=" text-xl font-bold my-1">
        Caberawit Mengaji
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.canCollapse !== false ? ( // Check for canCollapse before wrapping in Collapsible
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span className="text-xl">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className={`py-5   cursor-pointer ${
                              subItem.url === pathname
                                ? "bg-gray-600 text-white hover:text-black"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                            onClick={handleLinkClick}
                          >
                            <span className="text-xl">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`py-5   cursor-pointer ${
                    item.url === pathname
                      ? "bg-gray-600 text-white hover:text-black"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.icon && <item.icon />}
                  <span className="text-xl">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
