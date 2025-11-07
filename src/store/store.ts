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
import historymapReducer from '../features/history_map/slice/historyMapSlice';
import basemaphistoryReducer from '../features/history_map/slice/histBaseMapPopupSlice';

import sevippopupReducer from '../features/livemap/slice/SevipPopupSlice';
import classificationpopupReducer from '../features/livemap/slice/classificationPopupSlice';
import radarpopupReducer from '../features/livemap/slice/radarPopupSlice';
import histClassificationReducer from '../features/history_map/slice/histClassificationPopupSlice';
import vcrossPopupReducer from '../features/vcross_map/slice/vcrossPopupSlice';
import vcrossMapReducer from '../features/vcross_map/slice/vcrossMapSlice';
import histAltitudeReducer from '../features/history_map/slice/histAltitudeSlice';
import histRadarPopupReducer from '../features/history_map/slice/histRadarPopupSlice'
import histSevipPopupReducer from '../features/history_map/slice/histSevipPopup';


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
        // hist
        historymap: historymapReducer,
        hist_basemap: basemaphistoryReducer,
        hist_classifpopup: histClassificationReducer,
        hist_altitude: histAltitudeReducer,
        hist_radarpopup: histRadarPopupReducer,
        hist_sevippopup: histSevipPopupReducer,


        // Refactor
        sevippopup: sevippopupReducer,
        classificationpopup: classificationpopupReducer,
        radarpopup: radarpopupReducer,
        vcrosspopup: vcrossPopupReducer,
        vcrossmap: vcrossMapReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;