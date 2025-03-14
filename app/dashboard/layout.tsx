import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-between">
            <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center px-4">
                <SidebarTrigger className="-ml-1" />
              </div>
            </header>

            <div className="p-4">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
