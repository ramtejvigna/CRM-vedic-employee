import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useStore } from "../../store";
import {
  CurrencyRupeeIcon,
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

export function StatisticsCard({ color, title, value, footer }) {
  // Define colors for each card
  const floatingContainerColor = {
    "Today's Revenue": "bg-[#303030]", // Dark gray for Today's Revenue
    "Today's Customers": "bg-blue-500", // Blue for Today's Customers
    "PDFs generated Today": "bg-green-500", // Green for PDFs generated Today
    "Total Tasks": "bg-pink-500", // Pink for Total Tasks
  };

  // Select icon based on title
  let icon;
  switch (title) {
    case "Today's Revenue":
      icon = <CurrencyRupeeIcon className="w-6 h-6 text-white" />;
      break;
    case "Today's Customers":
      icon = <UsersIcon className="w-6 h-6 text-white" />;
      break;
    case "PDFs generated Today":
      icon = <DocumentTextIcon className="w-6 h-6 text-white" />;
      break;
    case "Total Tasks":
      icon = <ClipboardDocumentListIcon className="w-6 h-6 text-white" />;
      break;
    default:
      icon = null;
      break;
  }

  const { isDarkMode } = useStore();

  return (
    <Card className={`relative border border-blue-gray-100 ${isDarkMode ? ' bg-black text-white' : 'bg-white'} shadow-lg -translate-y-4`}>
      {/* Centered Floating Square Container with different colors */}
      <div className={`absolute top-[-1rem] left-4 ${floatingContainerColor[title]} p-5 rounded-2xl flex items-center justify-center shadow-lg`}>
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
        <CardFooter className="border-t border-blue-gray-50 p-4 px-7">
          <Typography
            variant="small"
            className={`font-normal ${footer.color}`}
          >
            <strong>{footer.value}</strong> {footer.label}
          </Typography>
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
  title: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.shape({
    color: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
  }),
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;
