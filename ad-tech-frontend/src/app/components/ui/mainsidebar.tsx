import React, { useState } from "react";
import { Bell, CircleHelp, Home, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  return (
    <div
      className={`transition-all duration-300 fixed left-0 top-0 h-screen bg-white shadow-lg ${
        collapsed ? "w-15" : "w-48"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-white rounded-full p-1 shadow-md border border-gray-200 z-20"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-grow p-4">
        <ul className="space-y-6">
          <li>
            <a href="/" className={`flex items-center gap-3 text-gray-700 hover:text-black ${collapsed ? "justify-center" : ""}`}>
              <Home size={20} />
              {!collapsed && <span>Home</span>}
            </a>
          </li>
          <li>
            <a href="/notifications" className={`flex items-center gap-3 text-gray-700 hover:text-black ${collapsed ? "justify-center" : ""}`}>
              <Bell  size={20} />
              {!collapsed && <span>Teams</span>}
            </a>
           
          </li>
          <li>
            <a href="/help" className={`flex items-center gap-3 text-gray-700 hover:text-black ${collapsed ? "justify-center" : ""}`}>
              <CircleHelp size={20} />
              {!collapsed && <span>Help</span>}
            </a>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className={`p-4 border-t border-gray-200 overflow-auto ${collapsed ? "flex justify-center" : ""}`}>
        <a href="/logout" className={`flex items-center  text-gray-700 hover:text-black ${collapsed ? "justify-center" : ""}`}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
