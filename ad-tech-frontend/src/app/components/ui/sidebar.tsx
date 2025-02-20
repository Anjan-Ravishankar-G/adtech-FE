"use client"; // Ensure this file is treated as a client-side component

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type SidebarProps = {
  campaignId: string;
  adGroupId: string;
};

export default function Sidebar({ campaignId, adGroupId }: SidebarProps) {
  const router = useRouter(); // Hook to handle routing
  const [isOpen, setIsOpen] = useState(true); // State to toggle sidebar

  // Navigate to the ASIN page with the same campaignId and adGroupId
  const navigateToAsin = () => {
    router.push(`/adGroupDetails/${campaignId}/${adGroupId}/asin`);
  };

  // Navigate to the Targeting page with the same campaignId and adGroupId
  const navigateToTargeting = () => {
    router.push(`/adGroupDetails/${campaignId}/${adGroupId}/targeting`);
  };

  // Navigate to the Recommendation page with the same campaignId and adGroupId
  const navigateToRecommendation = () => {
    router.push(`/adGroupDetails/${campaignId}/${adGroupId}/recommendation`);
  };

  return (
    <div className="flex">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-2 bg-gray-800 text-white rounded"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-800 text-white p-4 transition-all duration-300 ${
          isOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isOpen && (
          <ul>
            <li>
              <button
                onClick={navigateToAsin}
                className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              >
                Products
              </button>
            </li>
            <li>
              <button
                onClick={navigateToTargeting}
                className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              >
                Targeting
              </button>
            </li>
            <li>
              <button
                onClick={navigateToRecommendation}
                className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              >
                Keyword Recommendations
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
