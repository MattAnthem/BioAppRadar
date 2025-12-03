import { useEffect } from "react";
import type { theme } from "../features/theme/types";
import { useAppDispatch } from "../../store/hooks";
import { applySystemTheme } from "../features/theme/themeSlice";

/**
 * Synchronyze application theme to the browser theme
 * @param themeName 
 */
export function useSyncTheme (themeName: theme) {

    const dispatch = useAppDispatch();

    useEffect(() => {

        // Only apply this Hook if the user chose the system theme
        if (themeName !== 'system') return;

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            dispatch(applySystemTheme(media.matches ? 'dark' : 'light'));
        };

        handler();

        media.addEventListener('change', handler);

        return () => media.removeEventListener('change', handler);

    }, [dispatch, themeName])
}