import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../shared/features/theme/themeSlice';
import windowSizeReducer from '../shared/slice/windowsizeSlice';
import sidebarReducer from '../shared/components/navigation/sidebar/sidebarSlice';
import topbarReducer from '../shared/components/navigation/topbar/topbarSlice';
import alertReducer from '../shared/components/popups/alert/alertSlice';
import basemappopupReducer from '../features/livemap/slice/baseMapPopupSlice';
import livemapReducer from '../features/livemap/slice/livemapSlice';
import altitudeReducer from "../features/livemap/slice/altitudeSlice";
import vpchartReducer from '../features/vp_chart/vpChartSlice';
import vptschartReducer from '../features/vpts_chart/vptsChartSlice';
import vtipchartReducer from '../features/vtip_chart/vtipChartSlice';
import radaroptionReducer from '../features/history_map/slice/radarOptionSlice';
import historymapReducer from '../features/history_map/slice/historyMapSice';
import basemaphistoryReducer from '../features/history_map/slice/baseMapOption';

import sevippopupReducer from '../features/livemap/slice/SevipPopupSlice';
import classificationpopupReducer from '../features/livemap/slice/classificationPopupSlice';
import radarpopupReducer from '../features/livemap/slice/radarPopupSlice';
import histClassificationReducer from '../features/history_map/slice/histClassificationPopupSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        windowsize: windowSizeReducer,
        sidebar: sidebarReducer,
        topbar: topbarReducer,
        alert: alertReducer,
        basemappopup: basemappopupReducer,
        livemap: livemapReducer,
        altitude: altitudeReducer,
        vpchart: vpchartReducer,
        vptschart: vptschartReducer,
        vtipchart: vtipchartReducer,
        radaroption: radaroptionReducer,
        historymap: historymapReducer,
        basemaphistory: basemaphistoryReducer,

        // Refactor
        sevippopup: sevippopupReducer,
        classificationpopup: classificationpopupReducer,
        hist_classifPopup: histClassificationReducer,
        radarpopup: radarpopupReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;