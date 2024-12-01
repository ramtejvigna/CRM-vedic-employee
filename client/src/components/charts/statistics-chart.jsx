import { Card, CardBody, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { useStore } from "../../store";
export function StatisticsChart({ color, chart, title, description, footer }) {
  const {isDarkMode} = useStore()

  return (
    <Card className={`relative border border-blue-gray-100 shadow-lg ${isDarkMode ? 'bg-black text-white': 'bg-white'}`}>
      {/* Chart Container */}
      <div
        className="chart-container"
        style={{
          width: '90%', // Smaller width for spacing on the sides
          height: '200px', // Height of the chart
          position: 'absolute', // Float above the card
          top: '-1cm', // Adjusted this value to stretch further back
          left: '50%', // Center horizontally
          transform: 'translateX(-50%)', // Center alignment correction
          borderRadius: '15px', // Rounded corners for the chart
          overflow: 'hidden', // Ensure the content inside respects the rounded corners
        }}
      >
        <Chart {...chart} />
      </div>

      {/* Background Container for Text */}
      <CardBody className="px-6 pt-40 pb-4 mt-2"> {/* Adjusted padding top (pt) for more space */}
        <Typography variant="h5" color="blue-gray" className="mb-2"> {/* Space below title for separation */}
          {title}
        </Typography>

        <Typography variant="small" className="font-normal text-blue-gray-600 mb-4"> {/* Added margin bottom for spacing */}
          {description}
        </Typography>
      </CardBody>
    </Card>
  );
}

StatisticsChart.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsChart.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  chart: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsChart.displayName = "/src/widgets/charts/statistics-chart.jsx";

export default StatisticsChart;