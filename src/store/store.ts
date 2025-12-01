import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../shared/features/theme/themeSlice';
import windowSizeReducer from '../shared/slice/windowsizeSlice';
import sidebarReducer from '../shared/components/navigation/sidebar/sidebarSlice';
import topbarReducer from '../shared/components/navigation/topbar/topbarSlice';
import alertReducer from '../shared/components/popups/alert/alertSlice';
import basemappopupReducer from '../features/livemap/slice/baseMapPopupSlice';
import livemapReducer from '../features/livemap/slice/livemapSlice';
import altitudeReducer from "../features/livemap/slice/altitudeSlice";

import historymapReducer from '../features/history_map/slice/historyMapSlice';
import basemaphistoryReducer from '../features/history_map/slice/histBaseMapPopupSlice';

import classificationpopupReducer from '../features/livemap/slice/classificationPopupSlice';
import histClassificationReducer from '../features/history_map/slice/histClassificationPopupSlice';
import vcrossPopupReducer from '../features/vcross_map/slice/vcrossPopupSlice';
import vcrossMapReducer from '../features/vcross_map/slice/vcrossMapSlice';
import histAltitudeReducer from '../features/history_map/slice/histAltitudeSlice';
import histRadarPopupReducer from '../features/history_map/slice/histRadarPopupSlice'
import histSevipPopupReducer from '../features/history_map/slice/histSevipPopup';
import boundaryReducer from "../shared/slice/boundarySlice";
import basemapvcrossReducer from '../features/vcross_map/slice/vcrossMapbaseSlice';

import vpchartReducer from '../features/charts/vp/slices/vpChartSlice';
import vpHistChartReducer from '../features/charts/vp/slices/vpHistChartSlice';
import vptschartReducer from '../features/charts/vpts/slices/vptsChartSlice';
import vptsHistChartReducer from '../features/charts/vpts/slices/vptsHistChartSlice';
import vtipchartReducer from '../features/charts/vtip/slices/vtipChartSlice';
import vtipHistChartReducer from '../features/charts/vtip/slices/vtipHistChartSlice';


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
        vp_histchart: vpHistChartReducer,
        vpts_histchart: vptsHistChartReducer,
        vtip_histchart: vtipHistChartReducer,

        boundary: boundaryReducer,

        // vcross
        vcross_basemap: basemapvcrossReducer,

        classificationpopup: classificationpopupReducer,
        vcrosspopup: vcrossPopupReducer,
        vcrossmap: vcrossMapReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;