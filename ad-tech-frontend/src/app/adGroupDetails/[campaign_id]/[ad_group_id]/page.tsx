"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import Header from "@/app/components/ui/header";
import Sidebar from "@/app/components/ui/sidebar"; // Import the Sidebar component

type AsinData = {
  SN: string;
  advertisedAsin: string;
  advertisedSku: string;
  campaignStatus: string;
  impressions: number;
  clicks: number;
  clickThroughRate: string;
  cost: number;
  sales1d: number;
  ACoS: string;
  ROAS: string;
  adGroupId: string;
  campaignId: string;
};

type KeywordData = {
  keyword: string;
  matchTypes: string[];
  bids: number[];
  rank: number;
  theme: string;
};

type KeywordPerformanceData = {
  id: string;
  keyword: string;
  matchType: string;
  searchTerm: string;
  cost: string;
  clicks: number;
  impressions: number;
  sales30d: string;
  purchases30d: number;
  topOfSearchImpressionShare: string;
  Source: string;
  adGroupId: string;
};

async function fetchAsinData(adGroupId: string) {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/asin_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch ASIN data");
    const data = await res.json();
    return data.filter((asin: AsinData) =>
      String(asin.adGroupId).trim().toLowerCase() === String(adGroupId).trim().toLowerCase()
    );
  } catch (error) {
    console.error("Error fetching ASIN data:", error);
    throw error;
  }
}

async function fetchKeywordData(campaignId: string, adGroupId: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/keyword/recommendation/${campaignId}/${adGroupId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch keyword recommendations");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching keyword data:", error);
    throw error;
  }
}

async function fetchKeywordPerformance() {
  const res = await fetch("http://127.0.0.1:8000/get_report/keyword_report", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
  return res.json();
}

export default function AdGroupPage({ params }: { params: Promise<{ campaign_id: string, ad_group_id: string }> }) {
  const router = useRouter();
  const [asinData, setAsinData] = useState<AsinData[]>([]);
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [keywordPerformanceData, setKeywordPerformanceData] = useState<KeywordPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('asin'); // 'asin', 'keywordPerformance', 'keywordRecommendation'

  useEffect(() => {
    const loadData = async () => {
      try {
        const unwrappedParams = await params;
        const { ad_group_id } = unwrappedParams;
        if (!ad_group_id) {
          setError("Ad Group ID is missing");
          setIsLoading(false);
          return;
        }

        const [asinResults, keywordPerformance] = await Promise.all([
          fetchAsinData(ad_group_id),
          fetchKeywordPerformance()
        ]);

        setAsinData(asinResults);

        const filteredKeywordPerformance = Array.isArray(keywordPerformance)
          ? keywordPerformance.filter(item => item.Source === "spKeyword")
          : [];
        setKeywordPerformanceData(filteredKeywordPerformance);

        if (asinResults.length > 0) {
          const campaignId = asinResults[0].campaignId;
          const keywordResults = await fetchKeywordData(campaignId, ad_group_id);
          setKeywordData(keywordResults);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params]);

  if (isLoading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5 text-red-500">Error: {error}</div>;
  if (!asinData.length) return <div className="p-5 text-red-500">No ASIN data available for this ad group</div>;

  // Sort by sales1d to get top ASINs by sales
  const topAsinBySales = [...asinData]
    .sort((a, b) => b.sales1d - a.sales1d)  // Sort in descending order by sales
    .slice(0, 5);  // Get top 5


  return (
    <div className="flex h-screen">
      {/* Use the Sidebar component */}
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="flex-1 p-5 overflow-auto">
        {selectedTab === 'asin' && (
          <div>
            <h2 className="text-lg font-bold mt-6">ASIN Performance</h2>
            <Table className="border border-default-300">
              <TableHeader className="bg-black text-white sticky top-0 z-10">
                <TableRow>
                  <TableHead className="border border-default-300">ASIN</TableHead>
                  <TableHead className="border border-default-300">SKU</TableHead>
                  <TableHead className="border border-default-300 relative ">

                      Ad format
                      <select 
                      className="ml-3 bg-black text-white  rounded">
                        <option className="py-3" value="SP">SP</option>
                        <option value="SB">SB</option>
                        <option value="SD">SD</option>
                      </select>
                    
                  </TableHead>
                  <TableHead className="border border-default-300">Campaign Status</TableHead>
                  <TableHead className="border border-default-300">Daily Spend</TableHead>
                  <TableHead className="border border-default-300">Daily sales</TableHead>
                  <TableHead className="border border-default-300">ACOS</TableHead>
                  <TableHead className="border border-default-300">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asinData.map((asin) => (
                  <TableRow key={asin.SN} className="text-center">
                    <TableCell className="border border-default-300">{asin.advertisedAsin}</TableCell>
                    <TableCell className="border border-default-300">{asin.advertisedSku}</TableCell>
                    <TableCell className="border border-default-300">Sp</TableCell>
                    <TableCell className="border border-default-300">{asin.campaignStatus}</TableCell>
                    <TableCell className="border border-default-300">{asin.clickThroughRate}</TableCell>
                    <TableCell className="border border-default-300">{asin.clicks}</TableCell>
                    <TableCell className="border border-default-300">{asin.cost}</TableCell>
                    <TableCell className="border border-default-300">{asin.ROAS}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex gap-4">
              <div className="w-1/2">
              <h2 className="text-lg p-4 mt-8 ">Top 5 Asin Based on Spends</h2>
              <div className="flex space-x-10 ">
                <div className="flex-1 overflow-x-auto">
                  <Table className="min-w-full border border-blue-600 text-center">
                    <TableHeader className="bg-black text-white top-0 z-10">
                      <TableRow>
                        <TableHead>ASIN</TableHead>
                        <TableHead>Daily Spends</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topAsinBySales.map((asin) => (
                        <TableRow key={asin.advertisedAsin}>
                          <TableCell className="w-1/3">{asin.advertisedAsin}</TableCell>
                          <TableCell className="w-1/3">{asin.clickThroughRate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              </div>

              <div className="w-1/2">
              <h2 className="text-lg p-4 mt-8 ">Top 5 Asin Based on Sales</h2>
              <div className="flex space-x-10 ">
                <div className="flex-1 overflow-x-auto">
                  <Table className="min-w-full border border-blue-600 text-center">
                    <TableHeader className="bg-black text-white top-0 z-10">
                      <TableRow>
                        <TableHead>ASIN</TableHead>
                        <TableHead>Daily Sales</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topAsinBySales.map((asin) => (
                        <TableRow key={asin.advertisedAsin}>
                          <TableCell className="w-1/3">{asin.advertisedAsin}</TableCell>
                          <TableCell className="w-1/3">{asin.clicks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              </div>

            </div>
          </div>
        )}
        {selectedTab === 'keywordPerformance' && (
          <div>
            <h2 className="text-lg font-bold mt-6">Keyword Performance</h2>
            <Table className="border border-default-300">
              <TableHeader className="bg-black text-white sticky top-0 z-10">
                <TableRow>
                  <TableHead className="border border-default-300">Keyword</TableHead>
                  <TableHead className="border border-default-300">Match Type</TableHead>
                  <TableHead className="border border-default-300">Revenue</TableHead>
                  <TableHead className="border border-default-300">Spend</TableHead>
                  <TableHead className="border border-default-300">ACOS</TableHead>
                  <TableHead className="border border-default-300">ROAS</TableHead>
                  <TableHead className="border border-default-300">Clicks</TableHead>
                  <TableHead className="border border-default-300">Impressions</TableHead>
                  <TableHead className="border border-default-300">Bid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywordPerformanceData.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="border border-default-300">{item.keyword}</TableCell>
                    <TableCell className="border border-default-300">{item.matchType}</TableCell>
                    <TableCell className="border border-default-300">{item.clicks}</TableCell>
                    <TableCell className="border border-default-300">100</TableCell>
                    <TableCell className="border border-default-300">--</TableCell>
                    <TableCell className="border border-default-300">--</TableCell>
                    <TableCell className="border border-default-300">{item.impressions}</TableCell>
                    <TableCell className="border border-default-300">{item.impressions}</TableCell>
                    <TableCell className="border border-default-300">{item.impressions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {selectedTab === 'keywordRecommendation' && (
          <div>
            <h2 className="text-lg font-bold mt-6">Keyword Recommendations</h2>
            <Table className="border border-default-300">
              <TableHeader className="bg-black text-white sticky top-0 z-10">
                <TableRow>
                  <TableHead className="border border-default-300">Keyword</TableHead>
                  <TableHead className="border border-default-300">Match Types</TableHead>
                  <TableHead className="border border-default-300">Rank</TableHead>
                  <TableHead className="border border-default-300">Fro</TableHead>
                  <TableHead className="border border-default-300">Bids</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywordData.map((keyword, index) => (
                  <TableRow key={index} className="text-center">
                    <TableCell className="border border-default-300">{keyword.keyword}</TableCell>
                    <TableCell className="border border-default-300">{keyword.matchTypes.join(", ")}</TableCell>
                    <TableCell className="border border-default-300">{keyword.rank}</TableCell>
                    <TableCell className="border border-default-300">{keyword.theme}</TableCell>
                    <TableCell className="border border-default-300">{keyword.bids.map(bid => Math.ceil(bid)).join(" | ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}