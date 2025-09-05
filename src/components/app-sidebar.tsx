import { Home, Package, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

const data = [
  {
    title: "الصفحة الرئيسية",
    url: "/home",
    icon: Home,
  },
  {
    title: "المنتجات",
    url: "/products",
    icon: Package,
  },
  {
    title: "الاعدادات",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfile();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarGroupLabel className="block pb-2 text-2xl font-bold text-black my-4 text-center">
        <div className="pb-3 text-2xl font-bold text-black mb-5 text-center border-b">
          {profile?.company}
        </div>
      </SidebarGroupLabel>
      <SidebarContent className="mt-5">
        <SidebarGroup className="space-y-5">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
