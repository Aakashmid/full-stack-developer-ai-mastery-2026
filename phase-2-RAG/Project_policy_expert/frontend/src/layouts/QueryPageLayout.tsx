import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import UploadDocumentBar from "@/components/UploadDocumentBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const QueryPageLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="h-dvh w-full flex flex-col bg-bg overflow-hidden">
      {/* Fixed Sidebar (overlay) */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Header */}
      <Header />

      {/* Main 3-column layout */}
      <div className="flex flex-1 min-h-0 w-full">
        {/* spacer for sidebar */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "w-80" : "w-16"
          } shrink-0`}
        />

        {/* MIDDLE (main content - FLEX GROW) */}
        <main className="flex-1 min-w-0 min-h-0 flex flex-col py-4 px-4 md:px-8  lg:px-12 xl:px-32">
          <Outlet />
        </main>

        {/* right panel - fixed*/}
        <aside className="w-80 shrink-0 border-l p-3 border-textMuted flex flex-col">
          <UploadDocumentBar />
        </aside>
      </div>
    </div>
  );
};

export default QueryPageLayout;
