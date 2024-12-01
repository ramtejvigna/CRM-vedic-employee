import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { StatisticsCard } from "../../cards";
import { StatisticsChart } from "../../charts";
import { ClockIcon } from "@heroicons/react/24/solid";
import { statisticsChartsData } from "../../../data";
import axios from "axios";
import Cookies from "js-cookie"

export function Home() {
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const employeeId = Cookies.get('employeeId');

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`https://vedic-backend-neon.vercel.app/statistics/cards/${employeeId}`);
        setStatisticsCardsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching card data:", error);
        setLoading(false);
      }
    };

    fetchCardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchCardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [employeeId]);

  return (
    <div className="mt-12">
      <div >
        {loading ? (
          <div className="col-span-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="w-full">
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
              {statisticsCardsData.map(({ title, value, footer }) => (
                <StatisticsCard
                  key={title}
                  title={title}
                  value={value}
                  footer={footer}
                />
              ))}
            </div>


            <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
              {statisticsChartsData.map((props) => (
                <StatisticsChart
                  key={props.title}
                  {...props}
                  footer={
                    <Typography
                      variant="small"
                      className="flex items-center font-normal text-blue-gray-600"
                    >
                      <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                      &nbsp;{props.footer}
                    </Typography>
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default Home;
