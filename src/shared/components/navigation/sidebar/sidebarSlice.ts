import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuNames } from "../../buttons/navbtn/MenuTypes";

const active_link = localStorage.getItem('active_link') as MenuNames | 'home';

interface SidebarState {
    isMinimized: boolean;
    activeButton: MenuNames;
}


const initialState: SidebarState = {
    isMinimized: false,
    activeButton: active_link
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleMinimize: (state) => { 
            state.isMinimized = !state.isMinimized 
        },
        setActiveButton: (state, action) => { 
            state.activeButton = action.payload;
            localStorage.setItem('active_link', state.activeButton);
        },
        setMinimized: (state, action: PayloadAction<boolean>) => {
            state.isMinimized = action.payload
        }
    }
});

export const { toggleMinimize, setActiveButton, setMinimized } = sidebarSlice.actions;
export default sidebarSlice.reducer;

