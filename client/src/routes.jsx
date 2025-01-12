import { FaUsers, FaHome, FaTasks, FaMoneyBillWave, FaEdit, FaChartLine, FaCog } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6"
import { MdOutlineTaskAlt } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { BiSolidBabyCarriage } from "react-icons/bi";
import { GiThreeLeaves } from "react-icons/gi";

import Home from "./components/employee/Dashboard";
import { element } from "prop-types";
import Tasks from "./components/employee/Tasks";
import LeaveManagement from "./components/employee/LeaveApply";
import BabyDatabase from "./components/employee/BabyDatabase";
import CustomerTable from "./components/employee/CustomerView";

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
    icon: <FaUserLarge {...icon} />, 
  },
  {
    name: "Todo",
    path: "tasks",
    icon: <MdOutlineTaskAlt {...icon} />,
    element : <Tasks/>
  },
  {
    name: "baby database",
    path: "babyDatabase",
    icon: <BiSolidBabyCarriage {...icon} />,
    element: <BabyDatabase />,
  },
  {
    name: "leave apply",
    path: "leave",
    icon: <GiThreeLeaves {...icon} />,
    element: <LeaveManagement />,
  },
  {
    name: "Customer's View",
    path: "customersView",
    icon:<FaUsers {...icon}/>,
    element: <CustomerTable />,
  },
  // {
  //   name: "settings",
  //   path: "settings",
  //   icon: <FaCog {...icon} />, 
  // },
];