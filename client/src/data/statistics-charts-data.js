import { chartsConfig } from "../configs";

// Website Views Chart Configuration
const websiteViewsChart = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Views",
      data: [50, 20, 10, 22, 50, 10, 40],
    },
  ],
  options: {
    ...chartsConfig,
    chart: {
      background: "#1E90FF", // Blue background for Website Views
      toolbar: {
        show: false, // Remove menu (three lines)
      },
    },
    colors: ["#FFFFFF"], // White bars and text
    plotOptions: {
      bar: {
        columnWidth: "20%", // Reduced bar width
        borderRadius: 5, // Rounded bars
      },
    },
    xaxis: {
      categories: ["M", "T", "W", "T", "F", "S", "S"],
      labels: {
        style: {
          colors: "#FFFFFF", // White text for x-axis labels
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#FFFFFF", // White text for y-axis labels
        },
      },
    },
    grid: {
      show: true, // Show grid for clearer graph lines
      borderColor: "rgba(255, 255, 255, 0.3)", // Light white grid lines with 30% opacity
      strokeDashArray: 4, // Dashed grid lines
      yaxis: {
        lines: {
          show: true, // Show grid lines for y-axis (horizontal lines)
        },
      },
      xaxis: {
        lines: {
          show: true, // Disable vertical grid lines for x-axis
        },
      },
    },
  },
};

// Daily Sales Chart Configuration
const dailySalesChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Sales",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    ...chartsConfig,
    chart: {
      background: "#28a745", // Green background for Daily Sales
      toolbar: {
        show: false, // Remove menu (three lines)
      },
    },
    colors: ["#FFFFFF"], // White line and text
    stroke: {
      lineCap: "round",
      width: 2,
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          colors: "#FFFFFF", // White text for x-axis labels
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#FFFFFF", // White text for y-axis labels
        },
      },
    },
    grid: {
      show: true, // Enable grid for Daily Sales
      borderColor: "rgba(255, 255, 255, 0.3)", // Light white grid lines with 30% opacity
      strokeDashArray: 4, // Dashed grid lines
      yaxis: {
        lines: {
          show: true, // Show grid lines for y-axis (horizontal lines)
        },
      },
      xaxis: {
        lines: {
          show: false, // Disable vertical grid lines for x-axis
        },
      },
    },
  },
};

// Completed Tasks Chart Configuration
const completedTasksChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Tasks",
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
  ],
  options: {
    ...chartsConfig,
    chart: {
      background: "#333333", // Black background for Completed Tasks
      toolbar: {
        show: false, // Remove menu (three lines)
      },
    },
    colors: ["#FFFFFF"], // White line and text
    stroke: {
      lineCap: "round",
      width: 2,
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          colors: "#FFFFFF", // White text for x-axis labels
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#FFFFFF", // White text for y-axis labels
        },
      },
    },
    grid: {
      show: true, // Enable grid for Completed Tasks
      borderColor: "rgba(255, 255, 255, 0.3)", // Light white grid lines with 30% opacity
      strokeDashArray: 4, // Dashed grid lines
      yaxis: {
        lines: {
          show: true, // Show grid lines for y-axis (horizontal lines)
        },
      },
      xaxis: {
        lines: {
          show: false, // Disable vertical grid lines for x-axis
        },
      },
    },
  },
};

export const statisticsChartsData = [
  {
    color: "blue",
    title: "Website Views",
    description: "Last Campaign Performance",
    footer: "campaign sent 2 days ago",
    chart: websiteViewsChart,
  },
  {
    color: "green",
    title: "Daily Sales",
    description: "15% increase in today sales",
    footer: "updated 4 min ago",
    chart: dailySalesChart,
  },
  {
    color: "black",
    title: "Completed Tasks",
    description: "Last Campaign Performance",
    footer: "just updated",
    chart: completedTasksChart,
  },
];

export default statisticsChartsData;