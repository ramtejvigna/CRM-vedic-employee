import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useStore } from "../../store";
export function StatisticsCard({ color, icon, title, value, footer }) {
  // Define colors for each card
  const floatingContainerColor = {
    "Today's Money": "bg-[#303030]", // Dark gray for Today's Money
    "Today's Users": "bg-blue-500", // blue for Today's Users
    "New Clients": "bg-green-500", // green for New Clients
    "Sales": "bg-pink-500", // pink for Sales
  };
  const { isDarkMode } = useStore()

  return (
    <Card className={`relative border border-blue-gray-100 ${isDarkMode ? ' bg-black text-white' : 'bg-white'} shadow-lg -translate-y-4`}>
      {/* Centered Floating Square Container with different colors */}
      <div className={`absolute top-[-1rem] left-4 ${floatingContainerColor[title]} p-5 rounded-2xl flex items-center justify-center shadow-lg`}>
        {/* Center the icon inside the colored square */}
        {icon}
      </div>
      <CardHeader
        variant="gradient"
        color={color}
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center"
      >
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal opacity-70">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="font-bold">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t p-4 opacity-70">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
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
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;