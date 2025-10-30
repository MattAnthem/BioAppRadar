import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../shared/features/theme/themeSlice';
import windowSizeReducer from '../shared/slice/windowsizeSlice';
import sidebarReducer from '../shared/components/navigation/sidebar/sidebarSlice';
import topbarReducer from '../shared/components/navigation/topbar/topbarSlice';
import alertReducer from '../shared/components/popups/alert/alertSlice';
import varpopupReducer from '../shared/features/map-option-popups/mappopupsSlice';
import livemapReducer from '../features/livemap/livemapSlice';
import altitudeReducer from "../shared/features/altitude-slider/altitudeSlice";
import vpchartReducer from '../features/vp_chart/vpChartSlice';
import vptschartReducer from '../features/vpts_chart/vptsChartSlice';
import vtipchartReducer from '../features/vtip_chart/vtipChartSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        windowsize: windowSizeReducer,
        sidebar: sidebarReducer,
        topbar: topbarReducer,
        alert: alertReducer,
        mappopups: varpopupReducer,
        livemap: livemapReducer,
        altitude: altitudeReducer,
        vpchart: vpchartReducer,
        vptschart: vptschartReducer,
        vtipchart: vtipchartReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;