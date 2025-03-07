"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

type SidebarProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

export default function Sidebar({ selectedTab, setSelectedTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state

  return (
    <div className="flex">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-1 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
      >
        {isOpen ? <X size={32} className="bg-[#D1D5DB] text-black rounded-2xl p-1" /> : <Menu size={32} className="text-black rounded-2xl p-1 dark:bg-[#D1D5DB]" />}
      </button>
      {/* Sidebar and Content Wrapper */}
      <div className={`h-screen flex transition-all duration-300 ${isOpen ? "ml-64" : "ml-1"}`}>
        {/* Sidebar */}
        <div
          className={`h-screen bg-[#0D2B45] text-white transition-all duration-300 ${
            isOpen ? "w-64 p-4" : "w-0 overflow-hidden"
          } fixed top-0 left-0 shadow-lg`}
        >
          {isOpen && (
            <ul className="space-y-4 mt-16">
              <li>
                <button
                  onClick={() => setSelectedTab("asin")}
                  className={`w-full text-left py-2 px-4 rounded text-white ${
                    selectedTab === "asin" ? "bg-gray-600" : "hover:bg-[#1B3A57]"
                  }`}
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab("keywordPerformance")}
                  className={`w-full text-left py-2 px-4 rounded text-white ${
                    selectedTab === "keywordPerformance" ? "bg-gray-600" : "hover:bg-[#1B3A57]"
                  }`}
                >
                  Targeting
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab("NegativeKeyword")}
                  className={`w-full text-left py-2 px-4 rounded text-white ${
                    selectedTab === "NegativeKeyword" ? "bg-gray-600" : "hover:bg-[#1B3A57]"
                  }`}
                >
                  Negative Keyword
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab("keywordRecommendation")}
                  className={`w-full text-left py-2 px-4 rounded text-white ${
                    selectedTab === "keywordRecommendation" ? "bg-gray-600" : "hover:bg-[#1B3A57]"
                  }`}
                >
                  Keyword Recommendations
                </button>
              </li>
            </ul>
          )}
        </div>
        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Content goes here */}
        </div>
      </div>
    </div>
  );
}
