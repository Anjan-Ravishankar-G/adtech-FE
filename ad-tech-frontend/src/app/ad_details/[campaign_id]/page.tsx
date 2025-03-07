"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import DateRangePicker from "@/app/components/ui/datePicker";
import BasicPieChart from "@/app/components/ui/bargraph";
import Footer from "@/app/components/ui/footer";
import Layout from "@/app/components/ui/Layout";

type CampaignData = {
  SN: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  cost: number;
  costPerClick: number;
  clickThroughRate: string;
  clicks: number;
  sales1d: number;
  ACoS: string;
  ROAS: string;
  campaign_type: string;
  impression: number;
};

async function fetchCampaignData(startDate: string | null, endDate: string | null) {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/campaign_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch campaign data");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    throw error;
  }
}

export default function PerformanceTable() {
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date Range Picker State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // State to manage date range picker visibility
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const startStr = startDate ? startDate.toISOString().split('T')[0] : null;
        const endStr = endDate ? endDate.toISOString().split('T')[0] : null;

        const results = await fetchCampaignData(startStr, endStr);
        setCampaignData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [startDate, endDate]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!campaignData.length) return <div className="text-red-500">No campaign data available</div>;

  // Sort by sales and pick top 5
  const topSales = [...campaignData]
    .sort((a, b) => b.sales1d - a.sales1d)
    .slice(0, 5);

    const handleButtonClick = () => {
      setIsDatePickerOpen(!isDatePickerOpen); // Toggle date picker visibility
    };

  return (
    <Layout>
    <div className="p-5">
      {/* <Sidebar campaignId="yourCampaignId" adGroupId="yourAdGroupId" /> */}

      <div className="w-full p-3 rounded-lg">
        <div className="flex justify-between items-center ">
          <div className="text-white text-4xl">
            <h2 className="text-2xl font-light">IPG</h2>
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-light">Brand: brand 1</h2>
            <h2 className="text-2xl font-light">Campaign: </h2>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-center ">Ad Groups</h1>

      {/* Button to open the Date Range Picker */}
      <button 
        onClick={handleButtonClick}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 font-medium rounded-lg text-sm p-5 py-2 m-2 dark:hover:bg-gray-700 "
      >
        {isDatePickerOpen ? "Close Date Picker" : "Select Date Range"}
      </button>

      {isDatePickerOpen && (
        <DateRangePicker onDateRangeChange={(startDate, endDate) => {
          console.log("Selected range:", startDate, endDate);
        }} />
      )}
      
      <div className="overflow-x-auto max-h-96 p-1">
        <Table className="border border-default-100 rounded-lg">
          <TableHeader className="bg-black text-white  top-0 z-10">
            <TableRow>
              <TableHead className="border border-default-300 text-center">Ad Group</TableHead>
              <TableHead className="border border-default-300 text-center">Ad format</TableHead>
              <TableHead className="border border-default-300 text-center">SKU</TableHead>
              <TableHead className="border border-default-300 text-center">Spends</TableHead>
              <TableHead className="border border-default-300 text-center">Sales</TableHead>
              <TableHead className="border border-default-300 text-center">ACOS</TableHead>
              <TableHead className="border border-default-300 text-center">ROAS</TableHead>
              <TableHead className="border border-default-300 text-center">Impression</TableHead>
              <TableHead className="border border-default-300 text-center">CTR</TableHead>
              <TableHead className="border border-default-300 text-center">Clicks</TableHead>
              <TableHead className="border border-default-300 text-center rounded-tr-lg">DRR</TableHead>
            </TableRow>
          </TableHeader>
        
          <TableBody className="text-white">
            {campaignData.map((campaign) => (
              <TableRow key={campaign.SN} className="text-center">
              <TableCell className="border border-default-300 hover:bg-default-100 transition-colors cursor-pointer p-0">
                <Link href={`/adGroupDetails/${campaign.campaignId}/${campaign.adGroupId}/`} className="text-black hover:bg-gray-300 block w-full h-full p-4 dark:text-white dark:hover:bg-blue-900">
                {campaign.adGroupName}
                </Link>
              </TableCell>

              <TableCell className="border border-default-300">SP</TableCell>
              <TableCell className="border border-default-300">list sku for the ad group</TableCell>
              <TableCell className="border border-default-300">{campaign.cost}</TableCell>
              <TableCell className="border border-default-300">{campaign.sales1d}</TableCell>
              <TableCell className="border border-default-300">{campaign.ACoS}</TableCell>
              <TableCell className="border border-default-300">{campaign.ROAS}</TableCell>
              <TableCell className="border border-default-300">{campaign.clickThroughRate}</TableCell>
              <TableCell className="border border-default-300">{campaign.clicks}</TableCell>
              <TableCell className="border border-default-300">{campaign.impression}</TableCell>
              <TableCell className="border border-default-300">{campaign.costPerClick}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
        {/* Second Table: Top 5 Ad Groups by Sales (Showing Only 2 Rows) */}
      <h1 className="text-2xl font-bold mb-4 mt-8 text-center">Top 5 Ad Groups by Sales</h1>
      <div className="overflow-x-auto max-h-96 p-1">
        <Table className="border border-default-100 rounded-lg">
          <TableHeader className="bg-black text-white top-0 z-10">
            <TableRow>
              <TableHead>Ad Group</TableHead>
              <TableHead>Sales</TableHead>
            </TableRow>
          </TableHeader>
        
          <TableBody className="text-white">
            {topSales.slice(0, 2).map((campaign) => (
              <TableRow key={campaign.SN} className="text-center">
                <TableCell className="w-1/2">{campaign.adGroupName}</TableCell>
                <TableCell className="w-1/2">{campaign.sales1d}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </Layout>
  );
}
