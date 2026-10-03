import * as React from "react";
import { PortalNavbar, PortalFooter, AnnouncementModal } from "@/features/portal";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <PortalNavbar />
      <main className="flex-1">{children}</main>
      <PortalFooter />
      <AnnouncementModal />
    </div>
  );
}
