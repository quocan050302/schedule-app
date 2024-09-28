import React from "react";
import SideNavBar from "./_components/SideNavBar";
import DashboardHeader from "./_components/DashboardHeader";
import { Toaster } from "sonner";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="hidden md:block md:w-96 bg-slate-50 h-screen fixed">
        <SideNavBar />
      </div>
      <div className="md:ml-96">
        <DashboardHeader />
        <Toaster />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
