import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../shared/features/theme/themeSlice';
import windowSizeReducer from '../shared/slice/windowsizeSlice';
import sidebarReducer from '../shared/components/navigation/sidebar/sidebarSlice';
import topbarReducer from '../shared/components/navigation/topbar/topbarSlice';
import alertReducer from '../shared/components/popups/alert/alertSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        windowsize: windowSizeReducer,
        sidebar: sidebarReducer,
        topbar: topbarReducer,
        alert: alertReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;