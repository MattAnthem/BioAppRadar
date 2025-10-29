import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";

export const useTheme = () => {
    const theme = useAppSelector((state: RootState) => state.theme.currentTheme);
    const dispatch = useAppDispatch();
    
    const toggleTheme = () => {
        dispatch(toggleTheme);
    };
    
    return { theme, toggleTheme };
}