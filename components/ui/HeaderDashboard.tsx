import { SidebarTrigger } from "@/components/ui/sidebar";
export default function HeaderDashboard() {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center px-4">
          <SidebarTrigger className="-ml-1" />
          <h3 className="text-base">Kelas</h3>
        </div>
      </header>
    </>
  );
}
