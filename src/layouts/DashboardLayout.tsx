import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Main Content */}
          <div className="flex-1">
            <Header />
            <main className="p-4 sm:p-6">
              <Outlet />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
