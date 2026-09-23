import * as React from "react";
import { PortalNavbar } from "./components/portal-navbar";
import { PortalFooter } from "./components/portal-footer";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <PortalNavbar />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </div>
  );
}
