import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Button, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { routes } from "../routes";
import { useStore } from "../store";
import UseClickOutside from "./UseClickOutside";

export function Sidenav() {
  const { openSidenav, setOpenSidenav, isDarkMode } = useStore();
  const [activeRoute, setActiveRoute] = useState(null);
  const ref = useRef();

  UseClickOutside(ref, () => setOpenSidenav(false));

  const theme = isDarkMode ? "bg-black text-white" : "bg-white text-black";

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/signin"; // Redirect to sign-in page after logout
  };

  return (
    <motion.aside
      ref={ref}
      animate={{ left: openSidenav ? 0 : "-100%" }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className={`${
        theme
      } flex flex-col gap-6 overflow-auto w-1/5 min-w-[250px] rounded-lg shadow-lg p-4 fixed top-0 left-0 bottom-0 md:static z-30 transition-all h-full`}
    >
      <Link to="/">
        <Typography className="font-bold text-center text-2xl uppercase tracking-wider p-2">
          Admin Dashboard
        </Typography>
      </Link>

      <ul className="w-full gap-4 flex flex-col flex-1">
        {routes.map((route, index) => {
          return route.routes ? (
            <SubMenu
              key={index}
              route={route}
              activeRoute={activeRoute}
              setActiveRoute={setActiveRoute}
              isDarkMode={isDarkMode}
            />
          ) : (
            <li
              key={index}
              className={`w-full ${route.name === "settings" ? "mt-auto" : ""}`}
            >
              <NavLink to={`/admin/${route.path}`}>
                {({ isActive }) => (
                  <Button
                    onClick={() => setActiveRoute(route.name)}
                    variant={isActive ? "gradient" : "text"}
                    color={isActive ? "blue-gray" : "white"}
                    className={`flex items-center gap-4 p-3 px-6 capitalize ${
                      isActive
                        ? "bg-blue-500 !text-white hover:bg-blue-500/90"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                    fullWidth
                  >
                    {route.icon || <FaChevronDown />} {/* Fallback Icon */}
                    <Typography
                      color="inherit"
                      className="font-medium text-[1.4em] uppercase tracking-wider"
                    >
                      {route.name}
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <Button
        onClick={handleLogout}
        className="flex items-center gap-4 p-3 px-6 capitalize bg-red-500 !text-white hover:bg-red-600 mt-auto"
        fullWidth
      >
        Logout
      </Button>
    </motion.aside>
  );
}

const SubMenu = ({ route, activeRoute, setActiveRoute, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setActiveRoute(route.name);
  };

  return (
    <li>
      <Button
        onClick={handleToggle}
        variant={isOpen ? "gradient" : "text"}
        color={isOpen ? "blue-gray" : "white"}
        className={`flex items-center gap-4 p-3 px-6 capitalize ${
          activeRoute === route.name
            ? "bg-blue-500 !text-white hover:bg-blue-500/90"
            : "bg-white text-black hover:bg-gray-200"
        }`}
        fullWidth
      >
        {route.icon || <FaChevronDown />} {/* Fallback Icon */}
        <div className="flex-1 flex items-center justify-between">
          <Typography
            color="inherit"
            className="font-medium text-[1.4em] uppercase tracking-wider"
          >
            {route.name}
          </Typography>
          <FaChevronDown
            className={`text-xl justify-self-end transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </Button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {isOpen && route.routes && (
          <ul className="pl-6 flex flex-col gap-2">
            {route.routes.map((subRoute, index) => (
              <li key={index} className="py-2">
                <NavLink
                  to={`/admin/${subRoute.path}`}
                  className="text-xl font-light hover:text-gray-800"
                  onClick={() => setActiveRoute(subRoute.name)}
                >
                  {({ isActive }) => (
                    <div className="flex gap-2 h-12">
                      <span
                        className={`w-[1px] h-[122%] relative ${
                          isDarkMode ? "bg-white" : "bg-black"
                        }`}
                      >
                        {index !== 0 && index !== subRoute.length - 1 && (
                          <div
                            className={`absolute top-[-5px] w-2 h-2  rounded-full left-[-3px] ${
                              isDarkMode ? "bg-white" : "bg-black"
                            }`}
                          ></div>
                        )}
                      </span>
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={isActive ? "blue-gray" : "white"}
                        className={`flex-1 flex items-center gap-4 p-3 px-6 capitalize ${
                          isActive
                            ? "bg-blue-300 !text-white hover:bg-blue-300/90"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                        fullWidth
                      >
                        {subRoute.icon || <FaChevronDown />} {/* Fallback Icon */}
                        <Typography
                          color="inherit"
                          className="font-medium text-[1.4em] uppercase tracking-wider"
                        >
                          {subRoute.name}
                        </Typography>
                      </Button>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </li>
  );
};

Sidenav.propTypes = {
  route: PropTypes.shape({
    icon: PropTypes.node,
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default Sidenav;
