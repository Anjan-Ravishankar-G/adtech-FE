"use client";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

<<<<<<< HEAD
import { ApexOptions } from 'apexcharts';

type BasicPieChartProps = {
  series: number[]; // Array of progress values for each brand
  height: number;
  labels?: string[]; // Brand names or identifiers (optional for combined chart)
  combined?: boolean; // Flag to determine whether to show the combined chart or individual charts
  hollowSize?: string; // Allow custom hollow size (not used in pie chart)
};

const BasicPieChart: React.FC<BasicPieChartProps> = ({ series, height, labels, combined, hollowSize }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "pie", // Chart type is pie
      height: height,
    },
    plotOptions: {
      pie: {
        donut: {
          size: hollowSize, // Use hollowSize for donut hole size (optional)
        },
      },
    },
=======
// Import types from 'react-apexcharts' for type safety
import { ApexOptions } from "apexcharts";
import { useState } from "react";

type BasicPieChartProps = {
  series: number[]; // Array of data values for each slice
  height: number; // Height of the chart
  labels?: string[]; // Labels for each slice (optional)
  width?: number; // Width of the chart (optional)
  responsiveBreakpoint?: number; // Breakpoint for responsive design (optional)
  colors?: string[]; // Custom colors for each slice (optional)
};

const BasicPieChart: React.FC<BasicPieChartProps> = ({
  series,
  height,
  labels = [], // Default labels
  width = 380, // Default width
  responsiveBreakpoint = 480, // Default breakpoint
  colors = [], // Default empty array for colors
}) => {
  const chartOptions: ApexOptions = {
>>>>>>> nabin
    dataLabels: {
      enabled: false, // This will remove the percentage labels
      style: {
        colors: ['#FFFFFF'], // Set data label colors to white
      },
    },
    series: series,
    chart: {
      width: width,
      type: "pie",
    },
    labels: labels,
    colors: colors.length > 0 ? colors : undefined , // Use custom colors if provided
    legend: {
      labels: {
        colors: 'var(--label-color)', // Use CSS variable for dynamic color
      },
    },
  
    
    responsive: [
      {
<<<<<<< HEAD
        breakpoint: 480,
=======
        breakpoint: responsiveBreakpoint,
>>>>>>> nabin
        options: {
          chart: {
            width: 200, // Adjust width for smaller screens
          },
          legend: {
            position: "bottom", // Move legend to the bottom for smaller screens
            labels: {
              colors: '#FFFFFF', // Set legend label color to white in dark mode
            },
          }, 
        },
      },
    ],
  };

<<<<<<< HEAD
  const colors = chartOptions.colors || [];

  return (
    <div>
      {/* Pie Chart */}
      <ApexCharts options={chartOptions} series={chartOptions.series} type="pie" height={height} />

      {/* Custom Legend */}
      {!combined && labels && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
          {labels.map((label, index) => (
            <div
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                margin: "0 10px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: colors[index],
                  marginRight: "5px",
                }}
              ></span>
              <span style={{ fontSize: "16px", color: "black" }}>{label}</span>
            </div>
          ))}
        </div>
      )}
=======
  return (
    <div className="text-black dark:text-white">
      <ApexCharts 
        options={chartOptions}
        series={chartOptions.series}
        type="pie"
        height={height}
      />
>>>>>>> nabin
    </div>
  );
};

export default BasicPieChart;