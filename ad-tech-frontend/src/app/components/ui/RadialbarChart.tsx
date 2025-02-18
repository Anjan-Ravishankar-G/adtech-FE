"use client";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

// Import types from 'react-apexcharts' for type safety
import { ApexOptions } from 'apexcharts';

type BasicRadialBarProps = {
  series: number[]; // Array of progress values for each brand
  height: number;
  labels?: string[]; // Brand names or identifiers (optional for combined chart)
  combined?: boolean; // Flag to determine whether to show the combined chart or individual charts
};

const BasicRadialBar: React.FC<BasicRadialBarProps> = ({ series, height, labels, combined }) => {
  // Define chartOptions with explicit type
  const chartOptions: ApexOptions = {
    chart: {
      type: "radialBar", // Explicitly defining the type as 'radialBar'
      height: height,
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "70%",
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "16px",
            color: "#888",
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: "18px",
            color: "#333",
          },
        },
      },
    },
    colors: combined
      ? ["#F44336"] // For the combined chart, use a single color
      : ["#F44336", "#2196F3", "#4CAF50", "#FFC107", "#9C27B0"], // Multiple colors for individual brands
    series: combined
      ? [Math.round(series.reduce((acc, val) => acc + val, 0) / series.length)] // Combined chart will average the progress
      : series, // Individual brand progress values
    labels: combined ? ["Overall Progress"] : labels, // If it's combined, show "Overall Progress" as the label
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
  };

  return <ApexCharts options={chartOptions} series={series} type="radialBar" height={height} />;
};

export default BasicRadialBar;
