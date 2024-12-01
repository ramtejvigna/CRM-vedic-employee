import { useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { routes } from "../../../routes";
import { useStore } from "../../../store";
import UseClickOutside from "./UseClickOutside";

export function Sidenav() {
  const { openSidenav, setOpenSidenav, isDarkMode, setActiveRoute, activeRoute } = useStore();
  const ref = useRef();

  UseClickOutside(ref, () => setOpenSidenav(false));

  return (
    <motion.aside
      ref={ref}
      animate={{ left: openSidenav ? 0 : "-100%" }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className={`transition-all duration-300 flex flex-col gap-4 overflow-auto m-5 w-72 rounded-lg shadow-xl p-4 px-5 md:static z-30 fixed top-0 left-0 bottom-0 text-white bg-slate-900`}
    >
      <Link to="/">
        <Typography className="font-semibold text-center text-xl p-2">
          Employee Dashboard
        </Typography>
      </Link>

      <ul className="w-full gap-1.5 flex flex-col flex-1">
        {routes.map((route, index) => {
          return (
            <li key={index} className={`w-full ${route.name === "settings" ? "mt-auto bg-blue-500 rounded-xl" : ""}`}>
              <NavLink to={`/employee/${route.path}`}>
                {({ isActive }) => (
                  <Button
                    onClick={() => setActiveRoute(route.name)}  // Update active route in the store
                    variant={isActive ? "gradient" : "text"}
                    color={isActive ? "blue-gray" : "white"}
                    className={`flex items-center gap-4 p-3 px-6 text-sm font-normal capitalize ${isActive
                      && "bg-blue-500 hover:bg-blue-500/90 text-white"
                      }`}
                    fullWidth
                  >
                    {route.icon}{route.name}

                  </Button>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </motion.aside>
  );
}

Sidenav.propTypes = {
  route: PropTypes.shape({
    icon: PropTypes.node,
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default Sidenav;
