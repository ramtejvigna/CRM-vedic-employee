import { FaUsers, FaUserMd, FaHome, FaTasks, FaMoneyBillWave, FaEdit, FaChartLine, FaCog } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { BiSolidBabyCarriage } from "react-icons/bi";
import { GiThreeLeaves } from "react-icons/gi";

import Home from "./components/employee/Dashboard";
import { Leave } from "./components/employee/Leave";
import { element } from "prop-types";
import Tasks from "./components/employee/Tasks";


const icon = {
  className: "text-xl",
};

export const routes = [
  {
    name: "dashboard",
    path: "home",
    icon: <FaHome {...icon} />,
    element: <Home />,
  },
  {
    name: "customers",
    path: "customers",
    icon: <FaUserMd {...icon} />, 
  },
  {
    name: "task management",
    path: "tasks",
    icon: <MdOutlineTaskAlt {...icon} />,
    element : <Tasks/>
  },
  {
    name: "baby database",
    path: "baby",
    icon: <BiSolidBabyCarriage {...icon} />,
    element: <Home />,
  },
  {
    name: "leave apply",
    path: "leave",
    icon: <GiThreeLeaves {...icon} />,
    element: <Leave />,
  },
  {
    name: "reports",
    path: "reports",
    icon: <TbReportAnalytics {...icon} />,
    element: <Home />,
  },
  {
    name: "settings",
    path: "settings",
    icon: <FaCog {...icon} />, 
  },
];