"use client";
import "@/css/brand.css";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import DateRangePicker from "../components/ui/datePicker";
import Header from "../components/ui/header";
import BasicRadialBar from "../components/ui/RadialbarChart"; // Updated RadialBar

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type BrandTargetData = {
  Brand: string;
  DateTime: string;
  DailySales: number;
  Target: number;
  TargetAchieved: number;
};

async function fetchFilteredBrandTargetData(startDate: string, endDate: string) {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/get_filtered_brands?start_date=${startDate}&end_date=${endDate}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch filtered brand target data");
    const data = await res.json();
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error("Error fetching brand target data:", error);
    return null;
  }
}

async function fetchUniqueBrandTargetData() {
  try {
    const res = await fetch(
      "http://127.0.0.1:8000/get_unique/brand_level_table",
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch unique brand target data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching unique brand target data:", error);
    return [];
  }
}

export default function BrandTargetTables() {
  const [brandTargetData, setBrandTargetData] = useState<BrandTargetData[] | null>(null);
  const [uniqueBrandTargetData, setUniqueBrandTargetData] = useState<BrandTargetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const uniqueData = await fetchUniqueBrandTargetData();
        setUniqueBrandTargetData(uniqueData);
      } catch (err) {
        console.error("Error loading unique brand data:", err);
      }

      if (startDate && endDate) {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        try {
          const filteredData = await fetchFilteredBrandTargetData(formattedStartDate, formattedEndDate);
          if (filteredData === null) {
            setBrandTargetData([]); 
            setIsDataAvailable(false); 
          } else {
            setBrandTargetData(filteredData);
            setIsDataAvailable(true);
          }
        } catch (err) {
          console.error("Error fetching filtered brand target data:", err);
          setIsDataAvailable(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setBrandTargetData(null);
        setIsDataAvailable(true);
        setIsLoading(false);
      }
    }
    loadData();
  }, [startDate, endDate]);

  if (isLoading) return <div>Loading...</div>;

  // Calculate total target and total target achieved
  const totalTarget = uniqueBrandTargetData.reduce(
    (acc, brand) => acc + (brand.Target || 0),
    0
  );
  
  const totalTargetAchieved = uniqueBrandTargetData.reduce(
    (acc, brand) => acc + (brand.TargetAchieved || 0),
    0
  );

  const topBrands = [...uniqueBrandTargetData]
    .sort((a, b) => b.DailySales - a.DailySales)
    .slice(0, 5);

  const displayData = startDate && endDate ? (brandTargetData || []) : topBrands;

  // Generate the data for the radial charts
  const brandProgressData = uniqueBrandTargetData.map((brand) => {
    const progress = brand.Target > 0 ? (brand.TargetAchieved / brand.Target) * 100 : 0;
    return Math.round(progress); // Round to the nearest integer for simplicity
  });

  // For the combined chart: total progress across all brands
  const combinedProgress = Math.round((totalTargetAchieved / totalTarget) * 100);

  const brandNames = uniqueBrandTargetData.map((brand) => brand.Brand);

  return (
    <div className="p-5 space-y-8">
      <Header />
      <div className="w-full p-4 rounded-lg">
        <div className="flex flex-col items-start">
          <div className="text-white text-4xl font-serif tracking-wider">
            <h2 className="text-4xl font-light p-2">IPG</h2>
          </div>
          <div className="text-white p-2">
            <h2 className="text-2xl font-light">
              Total Accounts: {uniqueBrandTargetData.length}
            </h2>
            <h2 className="text-2xl font-light">Total Active: 25</h2>
            <h2 className="text-2xl font-light">
              Total revenue: INR {totalTargetAchieved.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h1 className="text-xl font-bold mb-7 text-center">Brands</h1>
        <div className="flex justify-start  items-center space-x-4 p-1">
          {/* Combined Radial Chart */}
          <div className="flex-0.6 w-[500px] h-[350px]  text-center bg-white shadow-lg rounded-lg p-4 border">
            <BasicRadialBar
              height={350}
              series={[combinedProgress]} // Combined progress for all brands
              combined={true}
            />
          </div>

          {/* Individual Radial Chart with Multiple Brands */}
          <div className="flex-0.6 w-[500px] h-[350px] text-center bg-white shadow-lg rounded-lg p-4 border">
            <h3>Brand Progress</h3>
            <BasicRadialBar
              height={350}
              series={brandProgressData} // Multiple progress for individual brands
              labels={brandNames} // Add brand names as labels
            />
          </div>   
        </div>
        
        <div className="mt-4 flex">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>

       
        
        {/* Layout for tables and pie chart */}
        <div className="flex space-x-10 p-1">
          {/* Brand Table */}
          <div className="flex-1 overflow-x-auto ">
          <Table className="min-w-full border border-purple-600 text-center">
              <TableHeader className="bg-black text-white  top-0 z-10">
                <TableRow className="cursor-pointer hover:bg-gray-100">
                  <TableHead>Brand</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Spends</TableHead>
                  <TableHead>Sales Achieved</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueBrandTargetData.map((brand) => (
                  <TableRow key={`${brand.Brand}-${brand.DateTime}`}>
                    <TableCell>{brand.Brand}</TableCell>
                    <TableCell>{brand.Target?.toLocaleString() || '-'}</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>{brand.TargetAchieved?.toLocaleString() || '-'}</TableCell>
                    <TableCell>
                      {brand.Target > 0
                        ? ((brand.TargetAchieved / brand.Target) * 100).toFixed(2)
                        : "0.00"}%
                    </TableCell>
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
