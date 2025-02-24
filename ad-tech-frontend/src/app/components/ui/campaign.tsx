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
} from "@/app/components/ui/table";  // Importing Table components
import DateRangePicker from "./datePicker";
import SplineArea from "./SplineArea";


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

type ChartData = {
  Date: string;
  DailySales: number;
  Spend: number;
};

// Function to fetch campaign data
async function fetchCampaignData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/campaign_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch campaign data");
    const data = await res.json();
    console.log("Fetched Campaign Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    throw error;
  }
}

async function fetchCampaignDataChart() {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/campaign_data", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch chart data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}

export default function PerformanceTable() {
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // State to manage date range picker visibility
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const results = await fetchCampaignData();
        setCampaignData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

// this is for chartdata
  useEffect(() => {
    async function loadChartData() {
      try {
        const results = await fetchCampaignDataChart();
        setChartData(results);
      } catch (err) {
        setChartError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setChartLoading(false);
      }
    }
    loadChartData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!campaignData.length) return <div className="text-red-500">No campaign data available</div>;

  // Sort brands by sales achieved in descending order and get top 5
  // const topBrandsBySales = [...uniqueBrandTargetData]
  // .sort((a, b) => b.TargetAchieved - a.TargetAchieved)
  // .slice(0, 5);

  const topCampaignBySales1d = [...campaignData]
  .sort((a, b) => b.sales1d - a.sales1d)  // Use sales1d for sorting
  .slice(0, 5);  // Get top 5 campaigns

  const handleButtonClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen); // Toggle date picker visibility
  };

  return (
    <div className="p-5">
      <div className="w-full p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="text-white text-4xl">
            <h2 className="text-4xl font-light">IPG</h2>
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-light">Brand: brand 1</h2>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">List of Campaigns</h1>

       {/* AREA CHART SECTION */}
       {chartLoading ? (
        <div>Loading chart...</div>
      ) : chartError ? (
        <div className="text-red-500">{chartError}</div>
      ) : (
        <SplineArea data={chartData} height={350} />
      )}

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

      <div className="p-1">
        <Table className="w-full">
          <TableHeader >
            <TableRow>
              <TableHead className="text-center">SN</TableHead>
              <TableHead className="text-center">Campaign</TableHead>
              <TableHead className="text-center">Campaign Type</TableHead>
              <TableHead className="text-center">Sales</TableHead>
              <TableHead className="text-center">Spend</TableHead>
              <TableHead className="text-center">Goal</TableHead>
              <TableHead className="text-center">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#212830] text-white">
            {campaignData.map((campaign) => (
              <TableRow key={campaign.SN} className="text-center">
                <TableCell className="rounded-l-lg">{campaign.SN}</TableCell>
                <TableCell className="border border-default-300 hover:bg-default-100 transition-colors cursor-pointer p-0">
                  <Link href={`/ad_details/${campaign.campaignId}`} className="text-blue-600 hover:text-blue-800 hover:underline block w-full h-full p-4">
                    {campaign.campaignName}
                  </Link>
                </TableCell>
                <TableCell>SP</TableCell>
                <TableCell>10000</TableCell>
                <TableCell>200</TableCell>
                <TableCell>{campaign.sales1d}</TableCell>
                <TableCell>32%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h2 className="text-lg p-3 mt-7 ">Top 5 Compaign Based on Sales</h2>
        <div className="flex space-x-10 ">
          <div className="flex-1 overflow-x-auto">
            <Table className="min-w-full border border-blue-600 text-center">
              <TableHeader className="bg-black text-white top-0 z-10">
                <TableRow>
                  <TableHead>Campaign</TableHead>
                    <TableHead>Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {topCampaignBySales1d.slice(0, 5).map((campaign) => (
                    <TableRow key={campaign.SN}>
                      <TableCell className="w-1/2">{campaign.campaignName}</TableCell>
                      <TableCell className="w-1/2">{campaign.sales1d}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
      </div>
    </div>       
  );
}
