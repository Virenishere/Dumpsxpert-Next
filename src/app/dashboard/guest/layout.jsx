import { AppSidebar } from "@/components/guest/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function GuestDashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex mt-27 w-full relative">
        <div className="z-[-1]">
          <AppSidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
}
