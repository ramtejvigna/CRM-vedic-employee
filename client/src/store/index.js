import {create} from 'zustand'
import { ControllerSlice } from './slices/ControllerSlice'
import { ThemeSlice } from './slices/ThemeSlice'
export const useStore = create((set) => ({
    ...ControllerSlice(set) ,
    ...ThemeSlice(set),
    openSidenav: false,
    setOpenSidenav: (state) => set({ openSidenav: state }),
    activeRoute: "Dashboard",  // Default to Dashboard
    setActiveRoute: (route) => set({ activeRoute: route }),

    userInfo : undefined,
    setUserInfo : (data) => set((state) => ({...state , userInfo : data})),

    onlineUsers : [] ,
    setOnlineUsers : (data) => set((state) => ({...state , onlineUsers : data })),
}))
