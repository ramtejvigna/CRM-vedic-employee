import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaChevronDown,
} from "react-icons/fa";
import { Button, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { routes } from "../routes";
import { useStore } from "../store";
import UseClickOutside from "./UseClickOutside";
export function Sidenav() {
  const {openSidenav , setOpenSidenav} = useStore();
  const [activeRoute, setActiveRoute] = useState(null);
  const ref = useRef();

  UseClickOutside(ref ,() =>  setOpenSidenav(false));


  return (
    <motion.aside
      ref = {ref}
      animate={{ left: openSidenav ? 0 : "-100%" }}
      transition={{
        duration : 0.5,
        ease : "easeInOut"
      }}
      className="bg-white flex flex-col gap-10 overflow-auto m-5 w-80 rounded-lg shadow-xl p-3 px-5 md:static z-30 fixed top-0 left-0 bottom-0"
    >
      <Link to="/">
        <Typography className="font-bold text-center text-2xl text-black uppercase tracking-wider p-2">
          Admin Dashboard
        </Typography>
      </Link>

      <div>
        <ul className="w-full gap-4 flex flex-col">
          {routes.map((route, index) => {
            return route.routes ? (
              <SubMenu
                key={index}
                route={route}
                isActive={activeRoute === route.name}
                setActiveRoute={setActiveRoute}
              />
            ) : (
              <li key={index} className="w-full">
                <NavLink to={`/dashboard/${route.path}`}>
                  {({ isActive }) => (
                    <Button
                      onClick={() => setActiveRoute(route.name)}
                      variant={isActive ? "gradient" : "text"}
                      color={isActive ? "blue-gray" : "white"}
                      className={`flex items-center gap-4 p-4 px-6 capitalize ${
                        isActive
                          ? "bg-black !text-white hover:bg-black/70"
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
      </div>
    </motion.aside>
  );
}

const SubMenu = ({ route, setActiveRoute }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setActiveRoute(route.name);
  };

  return (
    <div>
      <Button
        onClick={handleToggle}
        variant={isOpen ? "gradient" : "text"}
        color={isOpen ? "blue-gray" : "white"}
        className={`flex items-center gap-4 p-4 px-6 capitalize ${
          isOpen
            ? "bg-black !text-white hover:bg-black/70"
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
          <ul className="pl-6 flex flex-col gap-0">
            {route.routes.map((subRoute, index) => (
              <li key={index} className="py-2">
                <NavLink
                  to={`/dashboard/${subRoute.path}`}
                  className="text-xl font-light hover:text-gray-800"
                  onClick={() => setActiveRoute(subRoute.name)}
                >
                  {({ isActive }) => (
                    <div className="flex gap-2 h-12">
                      <span className="w-[1px] h-[122%] relative bg-black">
                        {index !== 0 && index !== subRoute.length - 1 && (
                          <div className="absolute top-[-5px] w-2 h-2 bg-black rounded-full left-[-3px]"></div>
                        )}
                      </span>
                      <Button
                        onClick={() => setActiveRoute(subRoute.name)}
                        variant={isActive ? "gradient" : "text"}
                        color={isActive ? "blue-gray" : "white"}
                        className={`flex-1 flex items-center gap-4 p-3 px-6 capitalize ${
                          isActive
                            ? "bg-gray-400 !text-white hover:bg-black/70"
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
    </div>
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