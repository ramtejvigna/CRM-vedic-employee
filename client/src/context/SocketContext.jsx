import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useStore } from "../store";

const HOST = "https://vedic-backend-neon.vercel.app"; // Update HOST as needed

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null); // Reference to maintain socket instance
  const { userInfo } = useStore();

  useEffect(() => {
    if (userInfo) {
      try {
        // Initialize socket connection
        socket.current = io(HOST, {
          withCredentials: true,
          query: { userId: userInfo.userId }, // Pass userId from userInfo
          transports: ["polling", "websocket"], // Support fallback to polling
        });

        // Handle successful connection
        socket.current.on("connect", () => {
          console.log("Connected to socket server");
        });

        // Handle connection errors
        socket.current.on("connect_error", (error) => {
          console.error("Socket connection error:", error.message);
        });

        // Handle disconnection
        socket.current.on("disconnect", (reason) => {
          console.warn("Socket disconnected:", reason);
        });
      } catch (error) {
        console.error("Error in Connecting Socket:", error.message);
      }

      // Cleanup on unmount or userInfo change
      return () => {
        if (socket.current) {
          socket.current.disconnect();
          console.log("Socket disconnected");
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
