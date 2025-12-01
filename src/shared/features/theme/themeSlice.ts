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
        } ,
        setToLightTheme: (state) => {
            state.themeName = 'light';
            state.currentTheme = light;
            state.isDarkMode = false;
            localStorage.setItem('theme', 'light');
        },
        setToDarkTheme: (state) => {
            state.themeName = 'dark';
            state.currentTheme = dark;
            state.isDarkMode = true;
            localStorage.setItem('theme', 'dark');
        }
    }
})


export const { toggleTheme, setToDarkTheme, setToLightTheme } = themeSlice.actions;
export default themeSlice.reducer;