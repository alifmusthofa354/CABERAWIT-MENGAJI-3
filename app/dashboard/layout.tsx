"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import {
  SidebarInset,
  SidebarProvider,
  //SidebarTrigger,
} from "@/components/ui/sidebar";
const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {children}
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </QueryClientProvider>
    </>
  );
}
