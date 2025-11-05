import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RadarGridPayload, RadarPolarPayload } from "../../../api/endpoints/spatialDataAPI";


const avalaibleTimes: string[] = [
    "2020-11-10 12:00:33",
    "2020-11-10 12:10:05",
    "2020-11-10 12:20:10",
    "2020-11-10 12:30:16",
    "2020-11-10 12:40:23",
    "2020-11-10 12:50:30",
    "2020-11-10 12:05:20",
    "2020-11-10 12:15:25",
    "2020-11-10 12:15:26",
    "2020-11-10 12:35:01",
    "2020-11-10 12:45:08",
    "2020-11-10 12:55:14",
]

interface HistorymapSliceState {
    radarPayload: RadarPolarPayload | RadarGridPayload;
    timeRange: string[]
} 

const initialState: HistorymapSliceState = {
    radarPayload: {
        colorbar: 'viridis',
        parameter: 'ref',
        time: avalaibleTimes[0], 
        type: 'polar',
        elevation_angle: 0.5,
        height: 0,
    },
    timeRange: avalaibleTimes,
}

const historymapSlice = createSlice({
    name: 'historymap',
    initialState,
    reducers: {
        setHistoryMapPayload: (state, action: PayloadAction<Partial<RadarGridPayload | RadarPolarPayload>>) => {
            state.radarPayload = { ...state.radarPayload, ...action.payload }
        },
    }
});

export const { setHistoryMapPayload } = historymapSlice.actions;
export default historymapSlice.reducer;