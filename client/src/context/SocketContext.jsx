import  { createContext , useContext , useEffect, useRef  } from "react";
import {io} from 'socket.io-client'
import { useStore } from "../store";

const SocketContext = createContext(null);

const HOST = "https://vedic-backend-neon.vercel.app"
export  const SocketProvider = ({children}) => {
    const socket = useRef(null);
    const {userInfo  } = useStore();
    
    useEffect(() => {
        if(userInfo) {
            socket.current = io(HOST,{
                withCredentials : true ,
                query : {userId : userInfo.userId}
            })

            socket.current.on("connect",() => {
                console.log("Connected to socket server");
            })

            socket.current.on('online-list' , (data) => {
                const {setOnlineUsers} = useStore.getState();
                setOnlineUsers(data);
            });

            return (() => {
                socket.current.disconnect();
            })
        }
    },[userInfo]);
    


    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};



export const useSocket = () => {
    return useContext(SocketContext);
};