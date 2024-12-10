import React, { useState, useEffect } from "react";
import { StatisticsCard } from "../../cards";
import axios from "axios";
import Cookies from "js-cookie"
import EmployeeProfile from "./EmployeeProfile";

export function Home() {
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const employeeId = Cookies.get('employeeId');
  const [employee, setEmployee] = useState({});

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://vedic-backend-neon.vercel.app/api/employees/get-employee?id=${employeeId}`);
      setEmployee(response.data.employee);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching card data : ", error);
      setLoading(false);
    }
  };

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

    fetchEmployeeData();
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

            <EmployeeProfile employee={employee} />
          </div>
        )}
      </div>
    </div >
  );
}

export default Home;
