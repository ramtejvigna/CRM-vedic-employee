import {
  CurrencyRupeeIcon,  // More specific for Indian Rupees
  UsersIcon,          // Keep for customers
  DocumentTextIcon,   // Better for PDFs
  ClipboardDocumentListIcon, // Better for tasks
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
      color: "gray",
      icon: CurrencyRupeeIcon,  // Changed to rupee-specific icon
      title: "Today's Revenue",
      value: "₹53,000",
      footer: {
          color: "text-green-500",
          value: "+55%",
          label: "than last week",
      },
  },
  {
      color: "gray",
      icon: UsersIcon,  // Kept the same
      title: "Today's Customers",
      value: "23",
      footer: {
          color: "text-green-500",
          value: "+3%",
          label: "than last month",
      },
  },
  {
      color: "gray",
      icon: DocumentTextIcon,  // Changed for PDFs
      title: "PDFs generated Today",
      value: "22",
      footer: {
          color: "text-red-500",
          value: "-2%",
          label: "than yesterday",
      },
  },
  {
      color: "gray",
      icon: ClipboardDocumentListIcon,  // Changed for tasks
      title: "Total Tasks",
      value: "3",
      footer: {
          color: "text-green-500",
          value: "+5%",
          label: "than yesterday",
      },
  },
];

export default statisticsCardsData;