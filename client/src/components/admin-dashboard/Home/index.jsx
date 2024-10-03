import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "../../cards";
import { StatisticsChart } from "../../charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "../../../data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useStore } from "../../../store";
export function Home() {
  const {isDarkMode} = useStore()
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
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
     {/* Projects Table Section */}
     <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className={`overflow-hidden xl:col-span-2 border ${isDarkMode ? "border-gray-700 text-white" : "border-blue-gray-100"} shadow-lg transition-transform duration-300 hover:shadow-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color={isDarkMode ? "white" : "blue-gray"} className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className={`flex items-center gap-1 font-normal ${isDarkMode ? "text-gray-400" : "text-blue-gray-600"}`}
              >
                <CheckCircleIcon strokeWidth={3} className={`h-4 w-4 ${isDarkMode ? "text-gray-600" : "text-blue-gray-200"}`} />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color={isDarkMode ? "gray" : "blue-gray"}>
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className={`overflow-x-scroll px-0 pt-0 pb-2 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map((el) => (
                    <th
                      key={el}
                      className={`border-b ${isDarkMode ? "border-gray-700" : "border-blue-gray-50"} py-3 px-6 text-left`}
                    >
                      <Typography
                        variant="small"
                        className={`text-[11px] font-medium uppercase ${isDarkMode ? "text-gray-500" : "text-blue-gray-400"}`}
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(({ img, name, members, budget, completion }, key) => {
                  const className = `py-3 px-5 ${key === projectsTableData.length - 1 ? "" : `border-b ${isDarkMode ? "border-gray-700" : "border-blue-gray-50"}`}`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} size="sm" className="w-10 h-10" />
                          <Typography variant="small" color={isDarkMode ? "white" : "blue-gray"} className="font-bold">
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${key === 0 ? "" : "-ml-2.5"}`}
                            />
                          </Tooltip>
                        ))}
                      </td>
                      <td className={className}>
                        <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                          {budget}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography variant="small" className="mb-1 block text-xs font-medium text-blue-gray-600">
                            {completion}%
                          </Typography>
                          <Progress
                            value={completion}
                            variant="gradient"
                            color={completion === 100 ? "green" : "blue"}
                            className="h-1"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* Orders Overview Section */}
        <Card className={`border ${isDarkMode ? "border-gray-700 text-white" : "border-blue-gray-100"} shadow-lg transition-transform duration-300 hover:shadow-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color={isDarkMode ? "white" : "blue-gray"} className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className={`flex items-center gap-1 font-normal ${isDarkMode ? "text-gray-400" : "text-blue-gray-600"}`}
            >
              <ArrowUpIcon strokeWidth={2} className={`h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-blue-gray-400"}`} />
              &nbsp;24% this month
            </Typography>
          </CardHeader>
          <CardBody className={`px-6 pt-0 pb-2 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            {ordersOverviewData.map(({ icon, color, title, description }, key) => (
              <div key={title} className="flex items-start gap-4 py-3">
                <div className={`rounded-xl border border-blue-gray-50 bg-blue-gray-50 p-3 ${color}`}>
                  {React.createElement(icon, {
                    className: "h-6 w-6",
                    strokeWidth: 2,
                  })}
                </div>
                <div>
                  <Typography
                    variant="small"
                    color={isDarkMode ? "white" : "blue-gray"}
                    className="block font-medium"
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="small"
                    className={`block font-normal ${isDarkMode ? "text-gray-400" : "text-blue-gray-500"}`}
                  >
                    {description}
                  </Typography>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;