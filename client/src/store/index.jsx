import {create} from 'zustand'
import { ControllerSlice } from './slices/ControllerSlice'
import { ThemeSlice } from './slices/ThemeSlice'
export const useStore = create((set) => ({
    ...ControllerSlice(set) ,
    ...ThemeSlice(set)
}))