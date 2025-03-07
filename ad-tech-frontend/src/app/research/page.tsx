"use client";
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, Tag, ShoppingCart, Percent, Star } from "lucide-react";
import Layout from "../components/ui/Layout";

type AmazonProductData = {
  title: string;
  reviews_count: number;
  seller_name: string;
  initial_price: number;
  currency: string;
  categories: string[];
  asin: string;
  buybox_seller: string;
  discount: string;
  description: string;
  number_of_sellers: number;
  variation_details: {
    name: string;
    price: number;
  };
  rating: string;
};

async function fetchProductDetails(url: string) {
  try {
    const res = await fetch("http://127.0.0.1:8000/amazon/url", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: url })
    });
    
    if (!res.ok) throw new Error("Failed to get the snapshot ID!");
    return res.json();
  } catch (error) {
    console.error("Error fetching snapshot ID:", error);
=======
import React, { useState } from "react";
import Link from "next/link";
import { Search, Loader2, AlertCircle } from "lucide-react";
import Layout from "../components/ui/Layout";

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
>>>>>>> nabin
    throw error;
  }
}

export default function AmazonProductSearch() {
<<<<<<< HEAD
  const [url, setUrl] = useState<string>("");
=======
  const [asin, setAsin] = useState<string>("");
>>>>>>> nabin
  const [productData, setProductData] = useState<AmazonProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
<<<<<<< HEAD
  
  // Progress bar states
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);

  // Progress bar effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showProgressBar && progress < 100) {
      timer = setInterval(() => {
        setProgress(prevProgress => {
          // Calculate the increment needed to reach 100 in 30 seconds
          // 100% / (30 seconds * 1000ms / interval time)
          const increment = 100 / (40 * (1000 / 100)); // Update every 100ms
          const newProgress = prevProgress + increment;
          
          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
      }, 100); // Update every 100ms for smoother animation
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showProgressBar, progress]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Reset states
    setIsLoading(true);
    setError(null);
    setShowFullDescription(false);
    
    // Show progress bar and reset progress
    setShowProgressBar(true);
    setProgress(0);
    
    try {
      // Simulate the search taking 30 seconds
      const data = await fetchProductDetails(url);
      setProductData(data);
      
      // Hide progress bar after successful search
      setTimeout(() => {
        setShowProgressBar(false);
      }, 500);
    } catch (err) {
      setError("Product not found or error occurred");
      // Hide progress bar on error
      setShowProgressBar(false);
=======

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
>>>>>>> nabin
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR'
    });
  };

  return (
    <Layout>
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-900">
        <form onSubmit={handleSearch}>
          <label htmlFor="url" className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
            Enter Amazon Product URL:
          </label>
          <div className="flex">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border p-3 rounded-l w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
              placeholder="https://www.amazon.in/dp/B0XXXXXXXX"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-r flex items-center transition-colors"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Search size={20} className="mr-2" />}
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
          
          {/* Progress Bar */}
          {showProgressBar && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-100 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">
                {Math.round(progress)}% complete - Searching product details...
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md flex items-center">
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
=======
  return (
    <Layout>
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white  p-4 rounded shadow-sm mb-4  dark:bg-black">
        <form onSubmit={handleSearch}>
          <label htmlFor="asin" className="block font-medium mb-2 text-gray-800 dark:text-gray-200">Enter Product ASIN:</label>
          <div className="flex">
            <input
              type="text"
              id="asin"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              className="border p-2 rounded-l w-full dark:bg-gray-900 dark:text-white"
              placeholder="e.g., B07PXGQC1Q"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r flex items-center "
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin mr-1" size={16} /> : <Search size={16} className="mr-1" />}
              {isLoading ? "..." : "Search"}
            </button>
          </div>
          {error && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-sm flex items-center">
              <AlertCircle size={16} className="mr-1 flex-shrink-0" />
>>>>>>> nabin
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {!isLoading && productData && (
<<<<<<< HEAD
        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Product Details Column */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                {productData.title}
              </h2>

              {/* Price and Discount */}
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-blue-600 mr-4">
                  {formatPrice(productData.initial_price)}
                </span>
                {productData.discount && (
                  <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded">
                    <Percent size={16} className="mr-1" />
                    <span className="font-semibold">{productData.discount} OFF</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {productData.categories.map((category, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                <p 
                  className="text-gray-600 dark:text-gray-400 text-sm cursor-pointer"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription 
                    ? productData.description 
                    : `${productData.description.slice(0, 250)}...`}
                  <span className="text-blue-600 ml-2">
                    {showFullDescription ? "Show less" : "Read more"}
                  </span>
                </p>
              </div>
            </div>

            {/* Additional Info Column */}
            <div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-3">
                  <ShoppingCart size={20} className="mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Seller: {productData.seller_name}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <Tag size={20} className="mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    ASIN: {productData.asin}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star size={20} className="mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Reviews: {productData.reviews_count}
                  </span>
                </div>
              </div>

              {productData.variation_details && (
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Variation Details
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    {productData.variation_details.name}
                  </p>
                </div>
              )}
            </div>
          </div>
=======
        <div className="bg-white rounded shadow-sm p-4 dark:bg-black">
          <div className="border-b pb-2 mb-3">
            <h2 className="text-xl font-bold mb-3 border p-2 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
              {productData.title}
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="border p-2 rounded bg-gray-50 dark:bg-gray-900">
                <span className="text-gray-600 dark:text-gray-300 text-sm">Price:</span>
                <div className="font-semibold text-gray-800 dark:text-white">
                  {productData.selling_price}
                  {productData.mrp && (
                    <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm line-through">{productData.mrp}</span>
                  )}
                </div>
              </div>
              <div className="border p-2 rounded bg-gray-50 dark:bg-gray-900">
                <span className="text-gray-600 dark:text-white text-sm">Rating:</span>
                <div className="font-semibold text-gray-800 dark:text-white">
                  {productData.rating} ({productData.review_count} reviews)
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3 border p-2 rounded bg-gray-50 dark:bg-gray-900">
            <h3 className="font-medium mb-1 text-gray-800 dark:text-white">Description</h3>
            <p
              className="text-gray-700 dark:text-white text-sm overflow-hidden line-clamp-5 cursor-pointer"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? productData.description : `${productData.description.slice(0, 100)}... Read more`}
            </p>
          </div>
          <Link
            href={productData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm "
          >
            View on Amazon
          </Link>
>>>>>>> nabin
        </div>
      )}
    </div>
    </Layout>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> nabin
