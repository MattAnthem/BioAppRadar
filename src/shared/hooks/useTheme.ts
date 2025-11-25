import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";

/**
 * Hook to get the current theme and a function to toggle the theme.
 * @returns An object containing the current theme and a function to toggle the theme.
 */
export const useTheme = () => {
    const theme = useAppSelector((state: RootState) => state.theme.currentTheme);
    const dispatch = useAppDispatch();
    
    const toggleTheme = () => {
        dispatch(toggleTheme);
    };
    
    return { theme, toggleTheme };
}