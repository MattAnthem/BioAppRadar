import { createSlice } from "@reduxjs/toolkit";
import { dark, light } from "../../features/theme/theme";
import type { theme } from "../../features/theme/types";



const savedTheme = localStorage.getItem('theme') as theme | null;

type themeState = {
    currentTheme: typeof light;
    themeName: theme;
    isDarkMode: boolean;
};

const initialState: themeState = {
    currentTheme: savedTheme === 'light' ? light : dark,
    themeName: savedTheme ?? 'light',
    isDarkMode: savedTheme === 'dark',
};


const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.themeName = state.themeName === 'light' ? 'dark' : 'light';
            state.currentTheme = state.themeName === 'light' ? light : dark;
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('theme', state.themeName);
        } 
    }
})


export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;