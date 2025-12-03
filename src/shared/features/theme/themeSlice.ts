import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { dark, light } from "../../features/theme/theme";
import type { theme } from "../../features/theme/types";



const savedTheme = localStorage.getItem('theme') as theme | null;

export const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const preffered = savedTheme ?? "system";
const systemTheme = getSystemTheme();
const resolveTheme = (name: theme) => {
    if (name === 'light') return light;
    if (name === 'dark') return dark;
    return systemTheme === 'dark' ? dark : light;
}


  

type themeState = {
    currentTheme: typeof light;
    themeName: theme;
    isDarkMode: boolean;
};

const initialState: themeState = {
    themeName: preffered,
    currentTheme: resolveTheme(preffered),
    isDarkMode: resolveTheme(preffered) === dark,
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
        },
        setToSystemTheme: (state) => {
            state.themeName = 'system';
            const system = getSystemTheme();
            state.currentTheme = system === 'dark' ? dark : light;
            state.isDarkMode = system === 'dark';
            localStorage.setItem('theme', 'system');
        },
        applySystemTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            const sys = action.payload;
            state.currentTheme = sys === 'dark' ? dark : light;
            state.isDarkMode = sys === 'dark';
        }
    }
})


export const { toggleTheme, setToDarkTheme, setToLightTheme, setToSystemTheme, applySystemTheme } = themeSlice.actions;
export default themeSlice.reducer;