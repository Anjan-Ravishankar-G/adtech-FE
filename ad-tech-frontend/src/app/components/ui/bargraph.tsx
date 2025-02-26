"use client";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

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
    dataLabels: {
      enabled: false, // Disable data labels on the pie chart
    },
    colors: combined
      ? ["#F44336"]
      : ["#F44336", "#2196F3", "#4CAF50", "#FFC107", "#9C27B0", "#2a40f1", "#2af1c7", ],
    series: combined
      ? [Math.round(series.reduce((acc, val) => acc + val, 0) / series.length)]
      : series,
    labels: combined ? ["Overall Progress"] : labels,
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
    </div>
  );
};

export default BasicPieChart;