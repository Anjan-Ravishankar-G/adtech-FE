"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, Loader2, AlertCircle } from "lucide-react";

type AmazonProductData = {
  asin: string;
  url: string;
  title: string;
  mrp: string | null;
  selling_price: string;
  discount: string | null;
  rating: string;
  review_count: string;
  sellers: string[];
  description: string;
};

async function fetchProductData(asin: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/scrap/${asin}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch product data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error;
  }
}

export default function AmazonProductSearch() {
  const [asin, setAsin] = useState<string>("");
  const [productData, setProductData] = useState<AmazonProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!asin.trim()) {
      setError("Please enter a valid ASIN");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setShowFullDescription(false);
    try {
      const data = await fetchProductData(asin);
      setProductData(data);
    } catch (err) {
      setError("Product not found or error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <form onSubmit={handleSearch}>
          <label htmlFor="asin" className="block font-medium mb-2">Enter Product ASIN:</label>
          <div className="flex">
            <input
              type="text"
              id="asin"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              className="border p-2 rounded-l w-full"
              placeholder="e.g., B07PXGQC1Q"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r flex items-center"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin mr-1" size={16} /> : <Search size={16} className="mr-1" />}
              {isLoading ? "..." : "Search"}
            </button>
          </div>
          
          {error && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm flex items-center">
              <AlertCircle size={16} className="mr-1 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 size={24} className="animate-spin text-blue-600" />
        </div>
      )}

      {!isLoading && productData && (
        <div className="bg-white rounded shadow-sm p-4">
          <h2 className="text-xl font mb-3">Product Title</h2>

          <h2 className="text-xl font-bold mb-3">{productData.title}</h2>
          
          <div className="border-b pb-2 mb-3">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <span className="text-gray-600 text-sm">Price:</span>
                <div className="font-semibold">
                  {productData.selling_price}
                  {productData.mrp && (
                    <span className="ml-2 text-gray-500 text-sm line-through">{productData.mrp}</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Rating:</span>
                <div className="font-semibold">
                  {productData.rating} ({productData.review_count} reviews)
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <h3 className="font-medium mb-1">Description</h3>
            <p 
              className="text-gray-700 text-sm cursor-pointer" 
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? productData.description : `${productData.description.slice(0, 100)}... (click to expand)`}
            </p>
          </div>
          
          <Link 
            href={productData.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
          >
            View on Amazon
          </Link>
        </div>
      )}
    </div>
  );
}
