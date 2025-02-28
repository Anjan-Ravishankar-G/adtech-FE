import React, { useState } from "react";
import Sidebar from "./mainsidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex ">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 p-6 ${
          collapsed ? "ml-4" : "ml-40"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
